#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_BASE_URL = 'https://blog.es2idea.com';
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_PUBLIC_DIR = 'public';
const DEFAULT_PATHS = [
  '/',
  '/service/',
  '/posts/aeo-implementation-tools-optimization-guide/',
  '/posts/create-your-ai-writing-clone-with-writerule-txt/',
  '/posts/visualize-ai-writing-sop-with-claude-svg/',
  '/posts/seo-article-writing-guide/'
];

const EXPECTED_SCHEMA = {
  '/': {faq: true, howto: false, requirePostChecks: false},
  '/service/': {faq: true, howto: false, requirePostChecks: false},
  '/posts/aeo-implementation-tools-optimization-guide/': {faq: false, howto: false, requirePostChecks: true},
  '/posts/create-your-ai-writing-clone-with-writerule-txt/': {faq: true, howto: true, requirePostChecks: true},
  '/posts/visualize-ai-writing-sop-with-claude-svg/': {faq: true, howto: true, requirePostChecks: true},
  '/posts/seo-article-writing-guide/': {faq: false, howto: true, requirePostChecks: true}
};

function parseArgs(argv) {
  const options = {
    baseUrl: DEFAULT_BASE_URL,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    mode: 'remote',
    publicDir: DEFAULT_PUBLIC_DIR,
    paths: DEFAULT_PATHS.slice()
  };

  argv.forEach((arg) => {
    if (arg.startsWith('--base=')) {
      options.baseUrl = arg.slice('--base='.length);
      return;
    }
    if (arg.startsWith('--timeout-ms=')) {
      const timeoutMs = Number(arg.slice('--timeout-ms='.length));
      if (Number.isFinite(timeoutMs) && timeoutMs > 0) options.timeoutMs = timeoutMs;
      return;
    }
    if (arg.startsWith('--mode=')) {
      const mode = arg.slice('--mode='.length);
      if (mode === 'remote' || mode === 'local') options.mode = mode;
      return;
    }
    if (arg.startsWith('--public-dir=')) {
      options.publicDir = arg.slice('--public-dir='.length);
      return;
    }
    if (arg.startsWith('--paths=')) {
      const value = arg.slice('--paths='.length).trim();
      if (!value) return;
      options.paths = value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  });

  return options;
}

function withTrailingSlash(pathname) {
  if (!pathname) return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function normalizePath(pathname) {
  if (!pathname) return '/';
  if (/^https?:\/\//i.test(pathname)) {
    const parsed = new URL(pathname);
    return withTrailingSlash(parsed.pathname);
  }
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withTrailingSlash(normalized);
}

function urlFromPath(baseUrl, pathname) {
  const parsedBase = new URL(baseUrl);
  parsedBase.pathname = normalizePath(pathname);
  parsedBase.search = '';
  parsedBase.hash = '';
  return parsedBase.toString();
}

function pageIdFromUrl(url) {
  const parsed = new URL(url);
  parsed.pathname = normalizePath(parsed.pathname);
  parsed.search = '';
  parsed.hash = '';
  return `${parsed.toString()}#webpage`;
}

function readLocalHtml(publicDir, pathname) {
  const normalizedPath = normalizePath(pathname);
  const targetPath = normalizedPath === '/'
    ? path.join(publicDir, 'index.html')
    : path.join(publicDir, normalizedPath, 'index.html');
  return {
    source: targetPath,
    html: fs.readFileSync(targetPath, 'utf8')
  };
}

async function readRemoteHtml(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {'user-agent': 'jsonld-validator/1.0'}
    });
    const html = await response.text();
    return {
      source: url,
      status: response.status,
      html
    };
  } finally {
    clearTimeout(timer);
  }
}

function getTypeList(node) {
  if (!node || !node['@type']) return [];
  return Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
}

function getFirstNodeByType(nodes, expectedType) {
  return (nodes || []).find((node) => getTypeList(node).includes(expectedType));
}

function parseJsonLdGraph(html) {
  const scriptPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const nodes = [];
  let match;
  while ((match = scriptPattern.exec(html)) !== null) {
    const rawJson = String(match[1] || '').trim();
    if (!rawJson) continue;
    try {
      const parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed && parsed['@graph'])) {
        parsed['@graph'].forEach((item) => nodes.push(item));
      } else if (parsed && typeof parsed === 'object') {
        nodes.push(parsed);
      }
    } catch (error) {
      nodes.push({__parseError: error.message});
    }
  }
  return nodes;
}

function isLanguageEntity(value) {
  return value && typeof value === 'object' && value['@type'] === 'Language' && typeof value.name === 'string';
}

function validatePage(targetUrl, html, expected) {
  const results = [];
  const nodes = parseJsonLdGraph(html);

  const parseErrors = nodes.filter((node) => node && node.__parseError);
  results.push({
    pass: parseErrors.length === 0,
    label: 'JSON-LD 可解析',
    detail: parseErrors.length ? parseErrors.map((item) => item.__parseError).join('; ') : ''
  });

  const websiteNode = getFirstNodeByType(nodes, 'WebSite');
  const webPageNode = getFirstNodeByType(nodes, 'WebPage') || getFirstNodeByType(nodes, 'CollectionPage');
  const blogPostingNode = getFirstNodeByType(nodes, 'BlogPosting');
  const breadcrumbNode = getFirstNodeByType(nodes, 'BreadcrumbList');
  const localBusinessNode = (nodes || []).find((node) => getTypeList(node).includes('LocalBusiness'));
  const faqNode = getFirstNodeByType(nodes, 'FAQPage');
  const howToNode = getFirstNodeByType(nodes, 'HowTo');

  results.push({
    pass: !/<meta name=["']keywords["']/i.test(html),
    label: '未輸出 meta keywords',
    detail: ''
  });

  results.push({
    pass: !!websiteNode && websiteNode.publisher && String(websiteNode.publisher['@id'] || '').endsWith('/#organization'),
    label: 'WebSite.publisher 指向 Organization',
    detail: websiteNode && websiteNode.publisher ? String(websiteNode.publisher['@id'] || '') : ''
  });

  if (webPageNode) {
    const expectedWebPageId = pageIdFromUrl(targetUrl);
    results.push({
      pass: webPageNode['@id'] === expectedWebPageId,
      label: 'WebPage.@id 正確',
      detail: `expected=${expectedWebPageId}, actual=${webPageNode['@id'] || ''}`
    });

    results.push({
      pass: !!breadcrumbNode
        && !!webPageNode.breadcrumb
        && webPageNode.breadcrumb['@id']
        && webPageNode.breadcrumb['@id'] === breadcrumbNode['@id'],
      label: 'WebPage.breadcrumb 與 BreadcrumbList 對齊',
      detail: `webPage=${webPageNode.breadcrumb ? webPageNode.breadcrumb['@id'] : ''}, breadcrumb=${breadcrumbNode ? breadcrumbNode['@id'] : ''}`
    });
  } else {
    results.push({
      pass: false,
      label: '存在 WebPage/CollectionPage 節點',
      detail: ''
    });
  }

  if (localBusinessNode) {
    const languages = Array.isArray(localBusinessNode.availableLanguage)
      ? localBusinessNode.availableLanguage
      : [];
    results.push({
      pass: languages.length > 0 && languages.every(isLanguageEntity),
      label: 'LocalBusiness.availableLanguage 為 Language 物件',
      detail: languages.length ? JSON.stringify(languages) : ''
    });

    const hasStreetAddress = !!(localBusinessNode.address && localBusinessNode.address.streetAddress);
    results.push({
      pass: !hasStreetAddress,
      label: 'LocalBusiness.address 無 streetAddress',
      detail: hasStreetAddress ? String(localBusinessNode.address.streetAddress) : ''
    });
  } else {
    results.push({
      pass: false,
      label: '存在 LocalBusiness 節點',
      detail: ''
    });
  }

  if (expected.requirePostChecks) {
    results.push({
      pass: !!blogPostingNode,
      label: '存在 BlogPosting 節點',
      detail: ''
    });

    if (blogPostingNode) {
      const expectedWebPageId = pageIdFromUrl(targetUrl);
      results.push({
        pass: !!blogPostingNode.author && String(blogPostingNode.author['@id'] || '').endsWith('/#person'),
        label: 'BlogPosting.author 指向 Person',
        detail: blogPostingNode.author ? String(blogPostingNode.author['@id'] || '') : ''
      });
      results.push({
        pass: !!blogPostingNode.publisher && String(blogPostingNode.publisher['@id'] || '').endsWith('/#organization'),
        label: 'BlogPosting.publisher 指向 Organization',
        detail: blogPostingNode.publisher ? String(blogPostingNode.publisher['@id'] || '') : ''
      });
      results.push({
        pass: !!blogPostingNode.mainEntityOfPage && blogPostingNode.mainEntityOfPage['@id'] === expectedWebPageId,
        label: 'BlogPosting.mainEntityOfPage 指向 WebPage',
        detail: blogPostingNode.mainEntityOfPage ? String(blogPostingNode.mainEntityOfPage['@id'] || '') : ''
      });
      results.push({
        pass: !!blogPostingNode.image && blogPostingNode.image['@type'] === 'ImageObject',
        label: 'BlogPosting.image 為 ImageObject',
        detail: blogPostingNode.image ? String(blogPostingNode.image['@type'] || '') : ''
      });
    }
  }

  if (typeof expected.faq === 'boolean') {
    results.push({
      pass: expected.faq ? !!faqNode : !faqNode,
      label: expected.faq ? '應存在 FAQPage' : '不應存在 FAQPage',
      detail: faqNode ? `faqCount=${(faqNode.mainEntity || []).length}` : ''
    });
  }

  if (typeof expected.howto === 'boolean') {
    results.push({
      pass: expected.howto ? !!howToNode : !howToNode,
      label: expected.howto ? '應存在 HowTo' : '不應存在 HowTo',
      detail: howToNode ? `steps=${(howToNode.step || []).length}` : ''
    });
  }

  return results;
}

function printResult(title, checks) {
  const allPass = checks.every((item) => item.pass);
  console.log(`\n${allPass ? '✅' : '❌'} ${title}`);
  checks.forEach((item) => {
    const icon = item.pass ? '  ✅' : '  ❌';
    const detail = item.detail ? ` | ${item.detail}` : '';
    console.log(`${icon} ${item.label}${detail}`);
  });
  return allPass;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const targetList = options.paths.map((inputPath) => {
    const normalizedPath = normalizePath(inputPath);
    const expected = EXPECTED_SCHEMA[normalizedPath] || {requirePostChecks: normalizedPath.startsWith('/posts/')};
    return {path: normalizedPath, expected};
  });

  console.log('JSON-LD 驗證開始');
  console.log(`模式: ${options.mode}`);
  console.log(`基底網址: ${options.baseUrl}`);
  if (options.mode === 'local') {
    console.log(`本地目錄: ${options.publicDir}`);
  }

  let passedPages = 0;
  let failedPages = 0;

  for (const target of targetList) {
    const targetUrl = urlFromPath(options.baseUrl, target.path);
    try {
      const pageData = options.mode === 'local'
        ? readLocalHtml(options.publicDir, target.path)
        : await readRemoteHtml(targetUrl, options.timeoutMs);

      if (options.mode === 'remote') {
        const status = Number(pageData.status);
        if (!Number.isFinite(status) || status < 200 || status >= 300) {
          const ok = printResult(`${targetUrl}`, [{
            pass: false,
            label: 'HTTP 狀態碼須為 2xx',
            detail: `status=${status}`
          }]);
          if (ok) passedPages += 1;
          else failedPages += 1;
          continue;
        }
      }

      const checkResults = validatePage(targetUrl, pageData.html, target.expected);
      const success = printResult(targetUrl, checkResults);
      if (success) passedPages += 1;
      else failedPages += 1;
    } catch (error) {
      printResult(targetUrl, [{
        pass: false,
        label: '讀取或解析失敗',
        detail: error.message
      }]);
      failedPages += 1;
    }
  }

  console.log('\n-------------------------');
  console.log(`總頁數: ${targetList.length}`);
  console.log(`通過: ${passedPages}`);
  console.log(`失敗: ${failedPages}`);
  console.log('-------------------------');

  if (failedPages > 0) {
    process.exitCode = 1;
  }
}

main();
