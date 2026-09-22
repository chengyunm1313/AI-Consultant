(function () {
  'use strict';

  function initSiteMotion() {
    var body = document.body;
    if (!body || !body.classList.contains('site-v1')) return;

    body.classList.add('site-v1--motion-ready');

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    disableReducedMotionCarousels(reducedMotion);
    var revealItems = document.querySelectorAll('[data-reveal]');

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (item) { item.classList.add('is-visible'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

      revealItems.forEach(function (item) { revealObserver.observe(item); });
    }

    var workflowSteps = document.querySelectorAll('[data-workflow-step]');
    if (!workflowSteps.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      workflowSteps.forEach(function (step) { step.classList.add('is-active'); });
      return;
    }

    var workflowObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-active', entry.isIntersecting);
      });
    }, { rootMargin: '-30% 0px -48% 0px', threshold: 0 });

    workflowSteps.forEach(function (step) { workflowObserver.observe(step); });
  }

  function disableReducedMotionCarousels(reducedMotion) {
    if (!reducedMotion) return;

    document.querySelectorAll('[data-bs-ride="carousel"], [data-bs-interval]').forEach(function (carousel) {
      carousel.removeAttribute('data-bs-ride');
      carousel.removeAttribute('data-bs-interval');

      if (!window.bootstrap || !window.bootstrap.Carousel) return;
      var instance = window.bootstrap.Carousel.getInstance(carousel);
      if (instance) instance.pause();
    });

    document.querySelectorAll('.swiper').forEach(function (element) {
      var swiper = element.swiper;
      if (swiper && swiper.autoplay && typeof swiper.autoplay.stop === 'function') {
        swiper.autoplay.stop();
      }
    });
  }

  function closeMobileNavigation() {
    var nav = document.getElementById('siteNavMenu');
    if (!nav || !nav.classList.contains('show') || !window.bootstrap) return;
    var collapse = window.bootstrap.Collapse.getInstance(nav);
    if (collapse) collapse.hide();
  }

  function initNavigation() {
    document.querySelectorAll('#siteNavMenu a').forEach(function (link) {
      link.addEventListener('click', closeMobileNavigation);
    });
  }

  function init() {
    initSiteMotion();
    initNavigation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
