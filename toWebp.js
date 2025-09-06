function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const imageFolder = './public/images'; // 依你的 Hexo 目錄而定
const folderPath = './public';
const folderPathCss = './public/css';
// 读取文件夹中的文件列表
fs.readdir(imageFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  // 过滤出图片文件（你可以根据需要设置更多的图片格式）
  const imageFiles = files.filter(file => ['.jpg', '.jpeg', '.png'].some(ext => file.endsWith(ext)));
  // 遍历每个图片文件
  imageFiles.forEach(file => {
    const filePath = path.join(imageFolder, file);
    // 使用 Sharp 库将图片转换为 WebP 格式
    sharp(filePath)
      .toFile(`${filePath.slice(0, -4)}.webp`, (err, info) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`${file} converted to WebP`);
        let originalFileName = file.split('.').slice(0, -1).join('.');
        const htmlFiles = getAllHtmlFiles(folderPath).filter(filePath => {
          return fs.readFileSync(filePath, 'utf8').includes(originalFileName);
        });
        //遍历每个包含图片引用的 HTML 文件
          htmlFiles.forEach(filePath => {
            // 读取文件内容
            let fileContent = fs.readFileSync(filePath, 'utf8');
            // 替换对应图片文件名（只替换包含图片引用的 HTML 文件）
            const regex = new RegExp(`${originalFileName}\\.(jpg|jpeg|png)`, 'g');
            fileContent = fileContent.replace(regex, `${originalFileName}.webp`);
            fs.writeFileSync(filePath, fileContent, 'utf8');
            console.log(`${filePath} img to webp`);
          });


          const cssFiles = fs.readdirSync(folderPathCss).filter(file => {
            const filePath = path.join(folderPathCss, file);
            const stats = fs.statSync(filePath);
            return stats.isFile() && fs.readFileSync(filePath, 'utf8').includes(originalFileName);
          });
  
          //遍历每个包含图片引用的 CSS 文件
            cssFiles.forEach(file => {
              const filePath = path.join(folderPathCss, file);
              // 读取文件内容
              let fileContent = fs.readFileSync(filePath, 'utf8');
              // 替换对应图片文件名（只替换包含图片引用的 HTML 文件）
              const regex = new RegExp(`${originalFileName}\\.(jpg|jpeg|png)`, 'g');
              fileContent = fileContent.replace(regex, `${originalFileName}.webp`);
              fs.writeFileSync(filePath, fileContent, 'utf8');
              console.log(`${file} url to webp`);
            });
      });
  });
});