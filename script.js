// Small details only. Everything on the page works without this file.

// 1. Nav gets a hairline once you scroll; the current section gets a blue dot.
(function () {
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav ul a'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if (!('IntersectionObserver' in window)) return;

  var visible = new Map();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible.set(e.target, e.isIntersecting); });
    var current = null;
    sections.forEach(function (s) { if (visible.get(s)) current = current || s; });
    links.forEach(function (a, i) {
      if (sections[i] === current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(function (s) { if (s) observer.observe(s); });
})();

// 2. Restrained entrance: elements fade up once as they enter the viewport.
(function () {
  var items = document.querySelectorAll('[data-reveal]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      observer.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el, i) {
    // stagger the first screen slightly
    if (el.closest('.hero')) el.style.transitionDelay = (i * 80) + 'ms';
    observer.observe(el);
  });
})();

// 3. Copy email.
document.querySelectorAll('.copy').forEach(function (button) {
  var email = button.dataset.email;
  var hint = button.querySelector('.copy-hint');
  var status = document.getElementById('copy-status');

  button.addEventListener('click', function () {
    if (!navigator.clipboard) return selectText(button.querySelector('.copy-text'));
    navigator.clipboard.writeText(email).then(function () {
      button.classList.add('copied');
      if (hint) hint.textContent = 'Copied';
      if (status) status.textContent = 'Email address copied';
      setTimeout(function () {
        button.classList.remove('copied');
        if (hint) hint.textContent = 'Copy';
        if (status) status.textContent = '';
      }, 1800);
    }, function () { selectText(button.querySelector('.copy-text')); });
  });
});

function selectText(el) {
  var range = document.createRange();
  range.selectNodeContents(el);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
