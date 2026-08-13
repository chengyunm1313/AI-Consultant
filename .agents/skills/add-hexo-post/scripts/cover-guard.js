#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_IMAGE_DIR = path.resolve(process.cwd(), 'themes/hexschool/source/images');
const COVER_PATTERN = /^cover(\d+)\.png$/i;

function printUsage() {
  console.error(
    [
      '用法：',
      '  node cover-guard.js next [images-dir]',
      '  node cover-guard.js verify <image>',
      '  node cover-guard.js normalize <input> <output>'
    ].join('\n')
  );
}

function fail(message) {
  throw new Error(message);
}

function requireDirectory(directory) {
  if (!fs.existsSync(directory)) fail(`找不到圖片資料夾：${directory}`);
  if (!fs.statSync(directory).isDirectory()) fail(`圖片路徑不是資料夾：${directory}`);
}

function getCoverEntries(directory) {
  requireDirectory(directory);

  return fs.readdirSync(directory, {withFileTypes: true})
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const match = entry.name.match(COVER_PATTERN);
      if (!match) return undefined;
      return {
        name: entry.name,
        number: Number(match[1]),
        normalizedName: entry.name.toLowerCase()
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.number - right.number || left.name.localeCompare(right.name));
}

function findNextCover(directory) {
  const entries = getCoverEntries(directory);
  const maxNumber = entries.length ? entries[entries.length - 1].number : 0;
  let nextNumber = maxNumber + 1;
  const names = new Set(entries.map((entry) => entry.normalizedName));

  while (names.has(`cover${nextNumber}.png`)) nextNumber += 1;

  return {
    maxNumber,
    nextNumber,
    output: path.join(directory, `cover${nextNumber}.png`)
  };
}

function runNext(directoryArgument) {
  const directory = path.resolve(process.cwd(), directoryArgument || DEFAULT_IMAGE_DIR);
  const result = findNextCover(directory);
  const maxLabel = result.maxNumber ? `cover${result.maxNumber}.png` : '目前沒有 cover<number>.png';

  console.log(`目前最大封面：${maxLabel}`);
  console.log(`下一個可用封面：${result.output}`);
}

function loadSharp() {
  try {
    return require('sharp');
  } catch (error) {
    fail('找不到 sharp。請先確認專案依賴已安裝，再重試 cover 檢查。');
  }
}

async function readImageMetadata(imagePath) {
  if (!fs.existsSync(imagePath)) fail(`找不到圖片：${imagePath}`);
  if (!fs.statSync(imagePath).isFile()) fail(`圖片路徑不是檔案：${imagePath}`);

  const sharp = loadSharp();
  const metadata = await sharp(imagePath).metadata();
  return metadata;
}

async function runVerify(imageArgument) {
  if (!imageArgument) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const imagePath = path.resolve(process.cwd(), imageArgument);
  if (path.extname(imagePath).toLowerCase() !== '.png') {
    fail(`封面必須是 PNG：${imagePath}`);
  }

  const metadata = await readImageMetadata(imagePath);
  if (metadata.format !== 'png') fail(`圖片副檔名是 PNG，但實際格式不是 PNG：${imagePath}`);
  if (metadata.width !== 1200 || metadata.height !== 800) {
    fail(`封面尺寸必須是 1200x800，目前是 ${metadata.width || '?'}x${metadata.height || '?'}：${imagePath}`);
  }

  console.log(`封面檢查通過：${imagePath}（1200x800 PNG）`);
}

async function runNormalize(inputArgument, outputArgument) {
  if (!inputArgument || !outputArgument) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const inputPath = path.resolve(process.cwd(), inputArgument);
  const outputPath = path.resolve(process.cwd(), outputArgument);
  if (!fs.existsSync(inputPath)) fail(`找不到 imagegen 輸出：${inputPath}`);
  if (fs.existsSync(outputPath) && inputPath !== outputPath) {
    fail(`拒絕覆寫既有封面：${outputPath}`);
  }
  if (!fs.existsSync(path.dirname(outputPath))) {
    fail(`找不到輸出資料夾：${path.dirname(outputPath)}`);
  }

  const sharp = loadSharp();
  const temporaryPath = inputPath === outputPath
    ? `${outputPath}.cover-guard-${process.pid}.tmp.png`
    : outputPath;

  await sharp(inputPath)
    .resize(1200, 800, {
      fit: 'cover',
      position: 'centre'
    })
    .png()
    .toFile(temporaryPath);

  fs.renameSync(temporaryPath, outputPath);

  await runVerify(outputPath);
  console.log(`封面已正規化：${outputPath}`);
}

async function main() {
  const [mode, firstArgument, secondArgument] = process.argv.slice(2);

  if (!mode) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  if (mode === 'next') {
    runNext(firstArgument);
    return;
  }
  if (mode === 'verify') {
    await runVerify(firstArgument);
    return;
  }
  if (mode === 'normalize') {
    await runNormalize(firstArgument, secondArgument);
    return;
  }

  printUsage();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`[cover-guard] ${error.message}`);
  process.exitCode = 1;
});
