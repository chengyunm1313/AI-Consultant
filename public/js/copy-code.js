document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("figure.highlight").forEach((block) => {
    // 若已經被包在 .code-block 裡就跳過
    if (block.parentElement.classList.contains("code-block")) return;

    // 建立外層容器
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";

    // 插入容器，包住原有 code block
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    // 建立複製按鈕
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.innerText = "複製";

    // 加入按鈕（放在 .highlight 內部右上角）
    block.appendChild(copyBtn);

    // 複製功能
    copyBtn.addEventListener("click", () => {
      const codeElement = block.querySelector("td.code");
      if (codeElement) {
        const codeText = codeElement.innerText.trim();
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.innerText = "已複製！";
          setTimeout(() => (copyBtn.innerText = "複製"), 1500);
        }).catch(() => {
          copyBtn.innerText = "複製失敗";
          setTimeout(() => (copyBtn.innerText = "複製"), 1500);
        });
      }
    });
  });
});