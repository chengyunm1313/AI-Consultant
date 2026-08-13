#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const IMAGE_DIR = path.join(PUBLIC_DIR, 'images');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

function getFilesRecursively(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  const entries = fs.readdirSync(dir, {withFileTypes: true});

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFilesRecursively(filePath));
      continue;
    }
    files.push(filePath);
  }

  return files;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceReferences(referenceFiles, sourceName, targetName) {
  const variants = [
    {source: sourceName, target: targetName},
    {source: encodeURI(sourceName), target: encodeURI(targetName)}
  ];
  let changedFiles = 0;
  let replacements = 0;

  for (const filePath of referenceFiles) {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let updatedContent = originalContent;

    for (const variant of variants) {
      if (variant.source === variant.target) continue;
      const matcher = new RegExp(escapeRegExp(variant.source), 'g');
      const matches = updatedContent.match(matcher);
      if (!matches) continue;

      replacements += matches.length;
      updatedContent = updatedContent.replace(matcher, variant.target);
    }

    if (updatedContent === originalContent) continue;
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    changedFiles += 1;
  }

  return {changedFiles, replacements};
}

async function main() {
  if (!fs.existsSync(IMAGE_DIR)) {
    throw new Error(`找不到圖片資料夾：${IMAGE_DIR}`);
  }

  const imageFiles = fs.readdirSync(IMAGE_DIR, {withFileTypes: true})
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => entry.name);

  if (!imageFiles.length) {
    throw new Error(`圖片資料夾沒有可轉換的 JPG、JPEG 或 PNG：${IMAGE_DIR}`);
  }

  const referenceFiles = getFilesRecursively(PUBLIC_DIR)
    .filter((filePath) => ['.html', '.css'].includes(path.extname(filePath).toLowerCase()))
    .sort();

  let convertedCount = 0;
  let changedFileCount = 0;
  let replacementCount = 0;

  for (const sourceName of imageFiles) {
    const extension = path.extname(sourceName);
    const baseName = sourceName.slice(0, -extension.length);
    const targetName = `${baseName}.webp`;
    const sourcePath = path.join(IMAGE_DIR, sourceName);
    const targetPath = path.join(IMAGE_DIR, targetName);

    await sharp(sourcePath).toFile(targetPath);
    const result = replaceReferences(referenceFiles, sourceName, targetName);

    convertedCount += 1;
    changedFileCount += result.changedFiles;
    replacementCount += result.replacements;
    console.log(`✅ ${sourceName} → ${targetName}，更新 ${result.replacements} 個引用`);
  }

  console.log(`WebP 後處理完成：${convertedCount} 張圖片、${replacementCount} 個引用、${changedFileCount} 個檔案。`);
}

main().catch((error) => {
  console.error(`[toWebp] 轉檔失敗：${error.message}`);
  process.exitCode = 1;
});
