const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imageFolder = './public/images';
const folderPath = './public';
const folderPathCss = './public/css';
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png']);

function getAllFiles(dir) {
  const results = [];

  if (!fs.existsSync(dir)) return results;

  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results.push(...getAllFiles(filePath));
    } else {
      results.push(filePath);
    }
  });

  return results;
}

function getAllHtmlFiles(dir) {
  return getAllFiles(dir).filter((filePath) => path.extname(filePath).toLowerCase() === '.html');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceImageReferences(originalFileName, replacementFileName) {
  const imagePattern = new RegExp(`${escapeRegExp(originalFileName)}\\.(jpg|jpeg|png)`, 'g');

  getAllHtmlFiles(folderPath).forEach((filePath) => {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    if (!fileContent.includes(originalFileName)) return;

    fileContent = fileContent.replace(imagePattern, replacementFileName);
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`${filePath} img to webp`);
  });

  getAllFiles(folderPathCss)
    .filter((filePath) => path.extname(filePath).toLowerCase() === '.css')
    .forEach((filePath) => {
      let fileContent = fs.readFileSync(filePath, 'utf8');
      if (!fileContent.includes(originalFileName)) return;

      fileContent = fileContent.replace(imagePattern, replacementFileName);
      fs.writeFileSync(filePath, fileContent, 'utf8');
      console.log(`${filePath} url to webp`);
    });
}

async function convertImage(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const originalFileName = path.basename(filePath, extension);
  const webpPath = path.join(path.dirname(filePath), `${originalFileName}.webp`);
  const relativeFilePath = path.relative(imageFolder, filePath);

  try {
    await sharp(filePath).toFile(webpPath);
    console.log(`${relativeFilePath} converted to WebP`);
    replaceImageReferences(originalFileName, `${originalFileName}.webp`);
  } catch (error) {
    console.error(`WebP 轉換失敗：${relativeFilePath}`);
    console.error(error);
  }
}

async function main() {
  const imageFiles = getAllFiles(imageFolder).filter((filePath) => {
    return supportedExtensions.has(path.extname(filePath).toLowerCase());
  });

  for (const filePath of imageFiles) {
    await convertImage(filePath);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
