/* global URLSearchParams */
(function () {
  'use strict';

  var currentScript = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i -= 1) {
      if (/\/avatar\/embed\.js(\?|$)/.test(scripts[i].src || '')) return scripts[i];
    }
    return null;
  })();

  if (document.getElementById('avatar-widget-root')) return;

  var base = currentScript ? currentScript.src.replace(/[^/]*$/, '') : '/avatar/';
  var widgetUrl = currentScript && currentScript.getAttribute('data-widget')
    ? currentScript.getAttribute('data-widget')
    : base + 'widget.html';
  var startOpen = currentScript && currentScript.getAttribute('data-open') === 'true';

  var params = new URLSearchParams();
  ['model', 'knowledge', 'voice'].forEach(function (key) {
    var value = currentScript && currentScript.getAttribute('data-' + key);
    if (value) params.set(key, value);
  });

  var iframeSrc = widgetUrl + (params.toString() ? (widgetUrl.indexOf('?') === -1 ? '?' : '&') + params.toString() : '');
  var widgetOrigin = (function () {
    try { return new URL(widgetUrl, window.location.href).origin; } catch (error) { return '*'; }
  })();

  var style = document.createElement('style');
  style.textContent = [
    '#avatar-widget-root{position:fixed;right:16px;bottom:16px;z-index:2147483000;font-family:"Noto Sans TC",system-ui,sans-serif;}',
    '#avatar-widget-root .avatar-frame{width:100%;height:100%;border:0;background:transparent;color-scheme:normal;}',
    '#avatar-widget-root .avatar-toggle{width:62px;height:62px;border:0;border-radius:50%;cursor:pointer;background:#111827;color:#fff;box-shadow:0 14px 34px rgba(17,24,39,.28);font-weight:800;font-size:17px;letter-spacing:.02em;display:flex;align-items:center;justify-content:center;}',
    '#avatar-widget-root .avatar-toggle:hover{transform:translateY(-1px);box-shadow:0 16px 38px rgba(17,24,39,.34);}',
    '#avatar-widget-root .avatar-toggle:focus-visible{outline:3px solid rgba(37,99,235,.35);outline-offset:4px;}',
    '@media (max-width: 480px){#avatar-widget-root.avatar-open{right:10px;bottom:10px;width:min(360px,calc(100vw - 20px))!important;height:min(430px,calc(100vh - 28px))!important;}#avatar-widget-root.avatar-closed{right:12px;bottom:12px;}}'
  ].join('');
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.id = 'avatar-widget-root';

  var iframe = document.createElement('iframe');
  iframe.className = 'avatar-frame';
  iframe.src = iframeSrc;
  iframe.title = '享哥 AI 虛擬助理';
  iframe.setAttribute('allow', 'microphone; autoplay');
  iframe.setAttribute('allowtransparency', 'true');

  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'avatar-toggle';
  toggle.textContent = 'AI';
  toggle.setAttribute('aria-label', '開啟享哥 AI 虛擬助理');

  root.appendChild(iframe);
  root.appendChild(toggle);
  document.body.appendChild(root);

  function setOpen(isOpen) {
    root.classList.toggle('avatar-open', isOpen);
    root.classList.toggle('avatar-closed', !isOpen);
    root.style.width = isOpen ? '360px' : '62px';
    root.style.height = isOpen ? '430px' : '62px';
    iframe.style.display = isOpen ? 'block' : 'none';
    toggle.style.display = isOpen ? 'none' : 'flex';
    if (isOpen && iframe.contentWindow) {
      window.setTimeout(function () {
        iframe.contentWindow.postMessage({ ns: 'hsiang-avatar-host', type: 'open' }, widgetOrigin);
      }, 80);
    }
  }

  toggle.addEventListener('click', function () { setOpen(true); });
  setOpen(startOpen);

  window.addEventListener('message', function (event) {
    if (widgetOrigin !== '*' && event.origin !== widgetOrigin) return;
    var data = event.data || {};
    if (data.ns !== 'hsiang-avatar') return;
    if (data.type === 'close') setOpen(false);
  });

  window.AvatarWidget = {
    open: function () { setOpen(true); },
    close: function () { setOpen(false); },
    say: function (text) {
      setOpen(true);
      if (!iframe.contentWindow) return;
      iframe.contentWindow.postMessage({
        ns: 'hsiang-avatar-host',
        type: 'say',
        text: String(text || '').slice(0, 500)
      }, widgetOrigin);
    }
  };
})();
