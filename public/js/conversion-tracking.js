(function () {
  'use strict';

  var trackedData = [
    ['trackPlacement', 'placement'],
    ['trackMethod', 'contact_method']
  ];

  function trackLinkClick(event) {
    var target = event.target;
    if (!(target instanceof Element)) return;

    var link = target.closest('a[data-track-event]');
    if (!link) return;

    var eventName = link.getAttribute('data-track-event');
    if (!eventName) return;

    var params = {
      page_path: window.location.pathname
    };

    trackedData.forEach(function (item) {
      var value = link.dataset[item[0]];
      if (value) params[item[1]] = value;
    });

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(['event', eventName, params]);
  }

  document.addEventListener('click', trackLinkClick);
})();
