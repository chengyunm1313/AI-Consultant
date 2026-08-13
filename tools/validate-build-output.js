#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const REQUIRED_FILES = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'service/index.html',
  'works/index.html',
  'contact/index.html',
  'n8n-automation/index.html'
];

function parseArgs(argv) {
  const options = {publicDir: DEFAULT_PUBLIC_DIR};
  for (const arg of argv) {
    if (arg.startsWith('--public-dir=')) {
      options.publicDir = path.resolve(process.cwd(), arg.slice('--public-dir='.length));
    }
  }
  return options;
}

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(filePath));
      continue;
    }
    if (entry.isFile()) files.push(filePath);
  }

  return files;
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, codePoint) => String.fromCodePoint(Number(codePoint)))
    .replace(/&#x([0-9a-f]+);/gi, (_, codePoint) => String.fromCodePoint(parseInt(codePoint, 16)));
}

function decodeAssetPath(value) {
  const cleanPath = value.split(/[?#]/, 1)[0];
  return decodeURIComponent(decodeHtmlEntities(cleanPath));
}

function getLocalImageReferences(filePath, content) {
  const references = [];
  const htmlPattern = /\b(?:src|href|poster)=['"](\/images\/[^'"]+)['"]/gi;
  const cssPattern = /url\(\s*['"]?(\/images\/[^'"\s)]+)['"]?\s*\)/gi;

  const patterns = path.extname(filePath).toLowerCase() === '.css'
    ? [cssPattern]
    : [htmlPattern];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      references.push({value: match[1], index: match.index});
    }
  }

  return references;
}

function checkRequiredFiles(publicDir, failures) {
  for (const relativePath of REQUIRED_FILES) {
    const filePath = path.join(publicDir, relativePath);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      failures.push(`${relativePath} 不存在`);
    }
  }
}

function checkRequiredContent(publicDir, failures) {
  const checks = [
    {
      file: 'index.html',
      pattern: /application\/ld\+json/i,
      reason: '首頁缺少 JSON-LD'
    },
    {
      file: 'robots.txt',
      pattern: /Content-Signal:\s*ai-train=no/i,
      reason: 'robots.txt 缺少 Content-Signal'
    },
    {
      file: 'sitemap.xml',
      pattern: /<urlset[\s>]/i,
      reason: 'sitemap.xml 不是有效的 urlset 輸出'
    },
    {
      file: 'llms.txt',
      pattern: /AI|llms|服務|文章/i,
      reason: 'llms.txt 缺少可識別的網站內容'
    }
  ];

  for (const check of checks) {
    const filePath = path.join(publicDir, check.file);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    if (!check.pattern.test(content)) failures.push(check.reason);
  }
}

function checkLocalImages(publicDir, failures) {
  const referenceFiles = walkFiles(publicDir)
    .filter((filePath) => ['.html', '.css'].includes(path.extname(filePath).toLowerCase()));
  let referenceCount = 0;

  for (const filePath of referenceFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const reference of getLocalImageReferences(filePath, content)) {
      referenceCount += 1;
      let decodedPath;
      try {
        decodedPath = decodeAssetPath(reference.value);
      } catch (error) {
        failures.push(`${path.relative(publicDir, filePath)} 的圖片路徑無法解碼：${reference.value}`);
        continue;
      }

      const assetPath = path.join(publicDir, decodedPath.replace(/^\//, ''));
      if (!fs.existsSync(assetPath)) {
        failures.push(`${path.relative(publicDir, filePath)} 引用不存在的圖片：${reference.value}`);
      }

      if (/\.(?:jpe?g|png)(?:[?#]|$)/i.test(decodedPath)) {
        failures.push(`${path.relative(publicDir, filePath)} 仍引用未轉 WebP 圖片：${reference.value}`);
      }
    }
  }

  if (referenceCount === 0) failures.push('找不到任何 HTML/CSS 本地圖片引用，請確認建置輸出是否完整');
}

function main() {
  const {publicDir} = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(publicDir)) {
    console.error(`[verify:build-output] 找不到建置目錄：${publicDir}`);
    process.exit(1);
  }

  const failures = [];
  checkRequiredFiles(publicDir, failures);
  checkRequiredContent(publicDir, failures);
  checkLocalImages(publicDir, failures);

  if (failures.length) {
    console.error(`[verify:build-output] 檢查失敗，共 ${failures.length} 項：`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`[verify:build-output] 檢查通過：必要路徑、AEO 輸出與本地圖片引用皆正常。`);
}

main();
