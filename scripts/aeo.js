'use strict';

function stripHtml(text = '') {
  return String(text)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shorten(text = '', limit = 120) {
  const normalized = stripHtml(text);
  if (!normalized) return '';
  if (normalized.length <= limit) return normalized;
  return normalized.slice(0, limit - 3).trim() + '...';
}

function absoluteUrl(baseUrl, path) {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  const base = String(baseUrl || '').replace(/\/$/, '');
  const pathname = String(path).startsWith('/') ? String(path) : `/${path}`;
  return `${base}${pathname}`;
}

function formatDate(date) {
  if (!date) return '';
  if (typeof date.format === 'function') return date.format('YYYY-MM-DD');
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

hexo.extend.generator.register('aeo-llms', function() {
  const data = hexo.locals.get('data') || {};
  const postsModel = hexo.locals.get('posts');
  const config = hexo.config || {};
  const aeo = data.aeo || {};
  const business = aeo.business || {};
  const pages = aeo.pages || {};
  const siteUrl = String(business.url || config.url || '').replace(/\/$/, '');
  const featuredPosts = (postsModel ? postsModel.toArray() : [])
    .filter((post) => post.published !== false)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 12)
    .map((post) => {
      const tags = post.tags && typeof post.tags.toArray === 'function'
        ? post.tags.toArray().map((tag) => tag.name).filter(Boolean)
        : [];
      const description = shorten(post.description || post.excerpt || post.content, 130);
      return {
        title: post.title,
        url: absoluteUrl(siteUrl, post.path),
        date: formatDate(post.date),
        description,
        tags
      };
    });

  const lines = [
    `# ${business.name || config.title}`,
    '',
    `> ${business.description || config.description || ''}`,
    '',
    '## 官方頁面',
    `- 網站首頁：${siteUrl}/`,
    `- 服務頁：${absoluteUrl(siteUrl, '/service/')}`,
    `- 關於享哥：${absoluteUrl(siteUrl, '/collection/')}`,
    `- 聯絡頁：${absoluteUrl(siteUrl, '/contact/')}`,
    '',
    '## 主要服務',
    ...(business.service_catalog || []).map((service) => `- ${service.name}：${service.description}`),
    '',
    '## 適合對象',
    '- 想導入 AI 內容產製與流程自動化的中小企業',
    '- 想提升電商轉換、品牌行銷與內容效率的團隊',
    '- 需要企業內訓、顧問診斷或專案陪跑的品牌與教育單位',
    '',
    '## 聯絡方式',
    `- Email：${business.email || ''}`,
    `- LINE：${(business.same_as || []).find((item) => item.includes('lin.ee')) || ''}`,
    '',
    '## 專長主題',
    ...(business.knows_about || business.service_types || []).map((item) => `- ${item}`),
    '',
    '## 最新文章',
    ''
  ];

  featuredPosts.forEach((post) => {
    lines.push(`- ${post.title}`);
    lines.push(`  網址：${post.url}`);
    if (post.date) lines.push(`  日期：${post.date}`);
    if (post.description) lines.push(`  摘要：${post.description}`);
    if (post.tags.length) lines.push(`  主題：${post.tags.join('、')}`);
    lines.push('');
  });

  lines.push('## 語言');
  lines.push(`- ${config.language || 'zh-TW'}`);
  lines.push('');
  lines.push('## AI 可讀說明');
  lines.push('- 本站聚焦 AI 應用規劃、n8n 自動化工作流、電商品牌行銷、AI 自媒體與數位轉型顧問。');
  lines.push('- 若要理解本站服務內容，請優先閱讀服務頁與上方最新文章。');

  return {
    path: 'llms.txt',
    data: lines.join('\n'),
    layout: false
  };
});
