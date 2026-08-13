#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.resolve(process.cwd(), 'source', '_posts');
const FRONT_MATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const REQUIRED_FIELDS = ['title', 'date', 'cover', 'description'];
const EMPTY_VALUE_PATTERN = /^(?:['"]{2}|null|~)$/i;

function walkMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(absolutePath));
      continue;
    }
    if (entry.isFile() && absolutePath.endsWith('.md')) {
      files.push(absolutePath);
    }
  }

  return files;
}

function getFrontMatter(content) {
  const match = content.match(FRONT_MATTER_PATTERN);
  return match ? match[1] : '';
}

function getFieldValue(frontMatter, field) {
  const pattern = new RegExp(`^\\s*${field}\\s*:\\s*(.*?)\\s*$`, 'mi');
  const match = frontMatter.match(pattern);
  return match ? String(match[1] || '').trim() : null;
}

function checkPostMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontMatter = getFrontMatter(content);

  if (!frontMatter) {
    return {ok: false, reasons: ['缺少 front matter']};
  }

  const reasons = [];
  for (const field of REQUIRED_FIELDS) {
    const value = getFieldValue(frontMatter, field);
    if (value === null) {
      reasons.push(`缺少 ${field} 欄位`);
      continue;
    }
    if (!value || EMPTY_VALUE_PATTERN.test(value)) {
      reasons.push(`${field} 欄位為空值`);
    }
  }

  return {ok: reasons.length === 0, reasons};
}

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`[verify:post-metadata] 找不到文章資料夾：${POSTS_DIR}`);
    process.exit(1);
  }

  const files = walkMarkdownFiles(POSTS_DIR).sort();
  if (!files.length) {
    console.error('[verify:post-metadata] source/_posts 內沒有任何 .md 文章檔案');
    process.exit(1);
  }

  const failures = [];
  for (const filePath of files) {
    const result = checkPostMetadata(filePath);
    if (!result.ok) {
      failures.push({
        file: path.relative(process.cwd(), filePath),
        reasons: result.reasons
      });
    }
  }

  if (failures.length) {
    console.error(`[verify:post-metadata] 檢查失敗，共 ${failures.length} 篇文章 metadata 不完整：`);
    for (const failure of failures) {
      console.error(`- ${failure.file}（${failure.reasons.join('；')}）`);
    }
    process.exit(1);
  }

  console.log(`[verify:post-metadata] 檢查通過，共 ${files.length} 篇文章皆有有效 title、date、cover、description。`);
}

main();
