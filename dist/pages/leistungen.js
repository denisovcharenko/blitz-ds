(function(run){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();})(function(){
(function () {
function init() {
document.querySelectorAll('.card-serv-new .text-size-16 br').forEach(function (br) {
br.replaceWith(document.createTextNode(' '));
});
}
function pinRows() {
if (!window.matchMedia('(min-width: 768px)').matches) return;
document.querySelectorAll('.grid-serv.page-tst').forEach(function (row) {
var stage = row.parentElement, sec = stage.closest('.section');
if (!sec || row.children.length < 4) return;
row.classList.add('ds-hrow'); stage.classList.add('ds-hstage'); sec.classList.add('ds-hsec');
var dist = 0;
function size() {
var last = row.lastElementChild;
dist = Math.max(0, last.offsetLeft + last.offsetWidth - row.clientWidth);
sec.style.height = 'calc(100vh + ' + dist + 'px)';
move();
}
var cur = 0, raf = 0, ease = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : .14;
function target() { return Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / (dist || 1))) * dist; }
function frame() {
var t = target();
cur += (t - cur) * ease;
if (Math.abs(t - cur) < .3) cur = t;
row.style.transform = 'translate3d(' + (-cur).toFixed(2) + 'px,0,0)';
raf = cur === t ? 0 : requestAnimationFrame(frame);
}
function move() { if (!raf) raf = requestAnimationFrame(frame); }
row.style.position = 'relative';
size();
cur = target(); row.style.transform = 'translate3d(' + (-cur) + 'px,0,0)';
window.addEventListener('scroll', move, { passive: true });
window.addEventListener('resize', size);
});
}
function start() { init(); pinRows(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
(function () {
var bg = document.querySelector('.section.hero-serv .wrapper-hero-background');
if (!bg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
if (navigator.connection && navigator.connection.saveData) return;
var own = document.querySelector('script[src*="/blitz-ds@"][src$="/blitz-ds.js"]');
var base = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? '../img/' : own ? own.src.replace(/blitz-ds\.js$/, 'media/') : '';
if (!base) return;
var v = document.createElement('video');
v.className = 'ds-hero-video'; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
v.preload = 'auto'; v.poster = base + 'hero-ink-poster.jpg';
[['hero-ink.webm', 'video/webm'], ['hero-ink.mp4', 'video/mp4']].forEach(function (f) {
var s = document.createElement('source'); s.src = base + f[0]; s.type = f[1]; v.appendChild(s);
});
v.addEventListener('playing', function () { v.classList.add('is-on'); }, { once: true });
bg.insertBefore(v, bg.firstChild);
bg.classList.add('ds-has-video');
var p = v.play(); if (p && p.catch) p.catch(function () {});
new IntersectionObserver(function (e) {
if (e[0].isIntersecting) { var q = v.play(); if (q && q.catch) q.catch(function () {}); } else v.pause();
}).observe(bg);
})();
});
