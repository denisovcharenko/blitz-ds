(function(run){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();})(function(){
(function () {
function init() {
var items = document.querySelectorAll('.section-hero .item-hero');
if (!items.length) return;
var row = document.createElement('div');
row.className = 'ds-facts';
items[0].parentNode.insertBefore(row, items[0]);
items.forEach(function (item) {
item.querySelectorAll('br').forEach(function (br) { br.replaceWith(' '); });
row.appendChild(item);
});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
function init() {
var root = document.querySelector('.section.gl-pad.dark .divtimeline');
if (!root) return;
var steps = Array.prototype.slice.call(root.querySelectorAll(':scope > .divstep'));
if (steps.length < 2) return;
var line = document.createElement('div');
var fill = document.createElement('div');
line.className = 'ds-tl-line';
fill.className = 'ds-tl-fill';
line.setAttribute('aria-hidden', 'true');
line.appendChild(fill);
root.appendChild(line);
var markers = steps.map(function (step, i) {
var num = step.querySelector('.divstep__head > p:first-child');
var m = document.createElement('div');
m.className = 'ds-tl-marker';
m.setAttribute('aria-hidden', 'true');
m.textContent = num ? num.textContent.trim() : String(i + 1).padStart(2, '0');
if (num) num.classList.add('ds-sr');
step.insertBefore(m, step.firstChild);
return m;
});
root.classList.add('ds-tl');
var reduce = matchMedia('(prefers-reduced-motion: reduce)');
var centers = [], top = 0, span = 0, current = -2;
function measure() {
var base = root.getBoundingClientRect().top;
centers = markers.map(function (m) { var r = m.getBoundingClientRect(); return r.top + r.height / 2 - base; });
top = centers[0];
span = centers[centers.length - 1] - top;
line.style.top = top + 'px';
line.style.height = span + 'px';
}
function setCurrent(index) {
if (index === current) return;
current = index;
steps.forEach(function (step, i) {
step.setAttribute('data-status', index >= 0 && i <= index ? 'active' : 'inactive');
step.toggleAttribute('data-current', i === index);
});
}
function update() {
if (reduce.matches) { fill.style.transform = 'scaleY(1)'; setCurrent(steps.length - 1); return; }
var mark = innerHeight * 0.5 - root.getBoundingClientRect().top; // activation line, in the timeline's own coordinates
var p = span > 0 ? Math.min(Math.max((mark - top) / span, 0), 1) : 1;
fill.style.transform = 'scaleY(' + p + ')';
var index = -1;
centers.forEach(function (c, i) { if (mark + 0.5 >= c) index = i; });
setCurrent(index);
}
var queued = false;
function onScroll() {
if (queued) return;
queued = true;
requestAnimationFrame(function () { queued = false; update(); });
}
function refresh() { measure(); update(); }
refresh();
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', refresh);
addEventListener('load', refresh);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
if (reduce.addEventListener) reduce.addEventListener('change', refresh);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
function init() {
var el = document.querySelector('.section-hero .cont-hero-map > div.capptalize-aa');
if (!el) return;
var a = document.createElement('a');
a.className = el.className;
a.href = 'https://www.google.com/maps?ll=51.010576,13.692511&z=20&t=m&hl=uk&gl=PL&mapclient=embed&cid=1829539260246909949';
a.target = '_blank';
a.rel = 'noopener';
while (el.firstChild) a.appendChild(el.firstChild);
el.parentNode.replaceChild(a, el);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
var VIDEO = false; // 2026-11-12: home hero keeps the photo; this clip moved to the Leistungen / Services hero (leistungen.js)
if (!VIDEO) return;
var bg = document.querySelector('.section-hero .wrapper-hero-background');
if (!bg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
if (navigator.connection && navigator.connection.saveData) return;
var own = document.querySelector('script[src*="/blitz-ds@"][src$="/blitz-ds.js"]');
var base = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? '../img/' : own ? own.src.replace(/blitz-ds\.js$/, 'media/') : '';
if (!base) return;
var v = document.createElement('video');
v.className = 'ds-hero-video'; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
v.preload = 'auto'; v.poster = base + 'hero-ink-poster.jpg';
v.innerHTML = '<source src="' + base + 'hero-ink.webm" type="video/webm"><source src="' + base + 'hero-ink.mp4" type="video/mp4">';
v.addEventListener('playing', function () { v.classList.add('is-on'); }, { once: true });
bg.insertBefore(v, bg.firstChild);
var p = v.play(); if (p && p.catch) p.catch(function () {});
if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { e[0].isIntersecting ? v.play().catch(function () {}) : v.pause(); }).observe(bg);
})();
(function () {
var sec = document.querySelector('.section-faq');
if (!sec || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
if (navigator.connection && navigator.connection.saveData) return;
var own = document.querySelector('script[src*="/blitz-ds@"][src$="/blitz-ds.js"]');
var base = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? '../img/' : own ? own.src.replace(/blitz-ds\.js$/, 'media/') : '';
if (!base) return;
var wrap = document.createElement('div');
wrap.className = 'ds-faq-bg'; wrap.setAttribute('aria-hidden', 'true');
var v = document.createElement('video');
v.className = 'ds-faq-video'; v.muted = true; v.loop = true; v.playsInline = true;
v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
v.preload = 'metadata'; v.poster = base + 'hero-video-poster.jpg';
[['hero-video.webm', 'video/webm'], ['hero-video.mp4', 'video/mp4']].forEach(function (f) {
var s = document.createElement('source'); s.src = base + f[0]; s.type = f[1]; v.appendChild(s);
});
v.addEventListener('playing', function () { v.classList.add('is-on'); });
wrap.appendChild(v);
sec.insertBefore(wrap, sec.firstChild);
sec.classList.add('ds-has-faq-video');
new IntersectionObserver(function (es) {
if (es[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
}, { rootMargin: '200px 0px' }).observe(sec);
})();
});
