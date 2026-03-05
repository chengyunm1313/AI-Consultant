#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.resolve(process.cwd(), 'source', '_posts');
const FRONT_MATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const DATE_LINE_PATTERN = /^\s*date\s*:\s*(.*?)\s*$/mi;
const EMPTY_DATE_PATTERN = /^(['"]{2}|null|~)?$/i;

function walkMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
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

function checkPostDate(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontMatter = getFrontMatter(content);

  if (!frontMatter) {
    return { ok: false, reason: '缺少 front matter' };
  }

  const dateMatch = frontMatter.match(DATE_LINE_PATTERN);
  if (!dateMatch) {
    return { ok: false, reason: '缺少 date 欄位' };
  }

  const value = String(dateMatch[1] || '').trim();
  if (EMPTY_DATE_PATTERN.test(value)) {
    return { ok: false, reason: 'date 欄位為空值' };
  }

  return { ok: true };
}

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`[verify:post-dates] 找不到文章資料夾：${POSTS_DIR}`);
    process.exit(1);
  }

  const files = walkMarkdownFiles(POSTS_DIR).sort();
  if (!files.length) {
    console.error('[verify:post-dates] source/_posts 內沒有任何 .md 文章檔案');
    process.exit(1);
  }

  const failures = [];

  for (const filePath of files) {
    const result = checkPostDate(filePath);
    if (!result.ok) {
      failures.push({
        file: path.relative(process.cwd(), filePath),
        reason: result.reason
      });
    }
  }

  if (failures.length) {
    console.error(`[verify:post-dates] 檢查失敗，共 ${failures.length} 篇文章缺少有效 date：`);
    for (const failure of failures) {
      console.error(`- ${failure.file}（${failure.reason}）`);
    }
    process.exit(1);
  }

  console.log(`[verify:post-dates] 檢查通過，共 ${files.length} 篇文章皆有有效 date。`);
}

main();
