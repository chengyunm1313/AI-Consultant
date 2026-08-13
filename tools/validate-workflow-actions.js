#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const WORKFLOWS_DIR = path.resolve(process.cwd(), '.github', 'workflows');
const USES_PATTERN = /^\s*uses:\s*([^@\s]+)@([^\s#]+)(?:\s+#.*)?$/gm;
const SHA_PATTERN = /^[0-9a-f]{40}$/i;

function main() {
  if (!fs.existsSync(WORKFLOWS_DIR)) {
    console.error(`[verify:workflow-actions] 找不到 workflow 資料夾：${WORKFLOWS_DIR}`);
    process.exit(1);
  }

  const workflowFiles = fs.readdirSync(WORKFLOWS_DIR)
    .filter((file) => /\.ya?ml$/i.test(file))
    .sort();
  const failures = [];
  let actionCount = 0;

  for (const file of workflowFiles) {
    const filePath = path.join(WORKFLOWS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    let match;

    while ((match = USES_PATTERN.exec(content)) !== null) {
      const action = match[1];
      const ref = match[2];
      actionCount += 1;

      if (action.startsWith('./') || SHA_PATTERN.test(ref)) continue;
      const line = content.slice(0, match.index).split(/\r?\n/).length;
      failures.push(`${path.relative(process.cwd(), filePath)}:${line} ${action}@${ref} 未固定為 40 碼完整 SHA`);
    }
  }

  if (failures.length) {
    console.error(`[verify:workflow-actions] 檢查失敗，共 ${failures.length} 個未固定的 Actions：`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log(`[verify:workflow-actions] 檢查通過，共 ${actionCount} 個 Actions 皆使用完整 SHA。`);
}

main();
