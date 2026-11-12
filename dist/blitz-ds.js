(function(run){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();})(function(){
(function () {
function isLight(el) {
for (var e = el; e; e = e.parentElement) {
var m = getComputedStyle(e).backgroundColor.match(/[\d.]+/g);
if (!m) continue;
var alpha = m.length > 3 ? +m[3] : 1;
if (alpha === 0) continue;
return (.2126 * m[0] + .7152 * m[1] + .0722 * m[2]) / 255 > .5;
}
return true; // the page background is white
}
function markButtons() {
document.querySelectorAll('section a.button').forEach(function (a) {
var overPhoto = a.closest('.section-reviews, .section-case, .section-contact, .hero-about, .hero-serv-sub, .section.go, .section.cust-tattoo, .section.cards');
a.classList.toggle('ds-on-light', !overPhoto && isLight(a.parentElement));
});
}
function watchCtas() {
var targets = document.querySelectorAll('section a.button, section a.button-case, .section-book');
var visible = new Set();
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (en) {
if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target);
});
document.body.classList.toggle('ds-cta-quiet', visible.size > 0);
});
targets.forEach(function (t) {
if (!t.closest('.fixed-button')) io.observe(t);
});
}
function clearDock() {
var dock = document.querySelector('.wrapper-close');
if (!dock) return;
var buttons = document.querySelectorAll('section a.button, section a.button-case');
var io;
function watch() {
if (io) io.disconnect();
var r = dock.getBoundingClientRect();
var over = new Set();
io = new IntersectionObserver(function (entries) {
entries.forEach(function (en) {
if (en.isIntersecting) over.add(en.target); else over.delete(en.target);
});
document.body.classList.toggle('ds-dock-clear', over.size > 0);
}, { rootMargin: -(innerHeight - 140) + 'px 0px 0px ' + -(innerWidth - Math.max(r.width, 220) - 32) + 'px' });
buttons.forEach(function (b) {
if (!b.closest('.fixed-button')) io.observe(b);
});
}
watch();
addEventListener('resize', watch);
}
function rememberContact() {
var closed = false;
try { closed = sessionStorage.getItem('ds-contact-closed') === '1'; } catch (e) {}
if (closed) document.body.classList.add('ds-contact-closed');
var btn = document.querySelector('.wrapper-close .close');
if (!btn) return;
btn.addEventListener('click', function () {
document.body.classList.add('ds-contact-closing');
setTimeout(function () { document.body.classList.add('ds-contact-closed'); }, 380);
try { sessionStorage.setItem('ds-contact-closed', '1'); } catch (e) {}
});
}
function drawArrows() {
document.querySelectorAll('.but-serv .text-size-24').forEach(function (el) {
var t = el.lastChild;
if (!t || t.nodeType !== 3 || !/→\s*$/.test(t.data)) return;
var i = t.data.lastIndexOf('→');
var arrow = t.splitText(i); arrow.splitText(1);
var span = document.createElement('span'); span.className = 'ds-arr'; span.setAttribute('aria-hidden', 'true');
arrow.replaceWith(span); span.appendChild(arrow);
});
}
function linkFollowTiles() {
document.querySelectorAll('.cont-new.follow').forEach(function (block) {
var link = block.querySelector('.wp-but-follow a[href]');
if (!link) return;
block.querySelectorAll('.cont-galery .wp-im-follow').forEach(function (tile) {
tile.classList.add('ds-tile-link');
tile.setAttribute('role', 'link');
tile.setAttribute('tabindex', '0');
tile.setAttribute('aria-label', link.textContent.trim());
function open() { window.open(link.href, '_blank', 'noopener'); }
tile.addEventListener('click', open);
tile.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
});
});
}
function markLandmarks() {
var main = document.querySelector('.main-wrapper');
if (main && !main.getAttribute('role')) main.setAttribute('role', 'main');
var foot = document.querySelector('.section-contact');
if (foot && !foot.getAttribute('role')) foot.setAttribute('role', 'contentinfo');
}
function firstScreenEager() {
var first = document.querySelector('.main-wrapper > :first-child');
if (!first) return;
first.querySelectorAll('img[loading="lazy"]').forEach(function (img, i) {
if (i > 1) return;
var r = img.getBoundingClientRect();
if (r.top > window.innerHeight) return;
img.loading = 'eager';
img.setAttribute('fetchpriority', 'high');
});
}
function markLabels() {
document.querySelectorAll('.capptalize-aa').forEach(function (el) {
if (!/^\s*\/.*\/\s*$/.test(el.textContent)) return;
if (el.children.length) {
if (el.querySelector('*:not(span)')) return;
el.childNodes.forEach(function (n) {
if (n.nodeType !== 3 || n.data.indexOf('/') < 0) return;
var sp = document.createElement('span'); sp.className = 'ds-slash'; sp.setAttribute('aria-hidden', 'true');
n.replaceWith(sp); sp.appendChild(n);
});
el.querySelectorAll('span:not(.ds-slash)').forEach(function (sp) { sp.classList.remove('text-color-black', 'text-color-white', 'text-color-red'); });
el.classList.add('ds-label');
if (!isLight(el.parentElement)) el.classList.add('ds-label-dark');
return;
}
var t = el.textContent, a = t.indexOf('/'), b = t.lastIndexOf('/');
el.textContent = '';
function slash(s) { var sp = document.createElement('span'); sp.className = 'ds-slash'; sp.setAttribute('aria-hidden', 'true'); sp.textContent = s; return sp; }
el.appendChild(slash(t.slice(0, a + 1)));
el.appendChild(document.createTextNode(t.slice(a + 1, b)));
el.appendChild(slash(t.slice(b)));
el.classList.add('ds-label');
if (!isLight(el.parentElement)) el.classList.add('ds-label-dark');
});
}
function markContact() {
document.querySelectorAll('.section-contact .contact > p, .section-contact .link-contact, .wrapper-link-footer > a').forEach(function (el) {
if (el.children.length || el.querySelector('.ds-slash')) return;
var t = el.textContent, m = t.match(/^\s*\/\s*/);
if (m) {
el.textContent = '';
var sp = document.createElement('span'); sp.className = 'ds-slash'; sp.setAttribute('aria-hidden', 'true'); sp.textContent = m[0];
el.appendChild(sp); el.appendChild(document.createTextNode(t.slice(m[0].length)));
}
if (el.tagName === 'P') el.classList.add('ds-label', 'ds-label-dark');
});
}
function markCurrent() {
var segs = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
var en = segs[0] === 'en'; if (en) segs.shift();
var first = segs[0] || '';
document.querySelectorAll('.header-2026 .link-nav[href], .header-2026 .link-lang[href]').forEach(function (a) {
var h = a.getAttribute('href'); if (!h || h === '#') return;
var u; try { u = new URL(h, location.href); } catch (e) { return; }
if (u.origin !== location.origin) return;
var hs = u.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
var hen = hs[0] === 'en'; if (hen) hs.shift();
var on = a.classList.contains('link-lang') ? hen === en : (hen === en && (a.closest('.w-dropdown-list') ? hs.join('/') === segs.join('/') : (hs[0] || '') === first));
a.classList.toggle('ds-current', on);
if (!on) a.classList.remove('w--current');
});
document.querySelectorAll('.header-2026 .drop-nav').forEach(function (d) {
var t = d.querySelector('.w-dropdown-toggle');
if (!t) return;
var inSection = false;
d.querySelectorAll('a[href]').forEach(function (a) {
var u; try { u = new URL(a.getAttribute('href'), location.href); } catch (e) { return; }
var hs = u.pathname.replace(/\/+$/, '').split('/').filter(Boolean); var hen = hs[0] === 'en'; if (hen) hs.shift();
if (u.origin === location.origin && hen === en && hs[0] && hs[0] === first) inSection = true;
});
t.classList.toggle('ds-current', inSection);
});
}
function init() {
markCurrent();
markLabels();
markContact();
markLandmarks();
firstScreenEager();
linkFollowTiles();
drawArrows();
markButtons();
watchCtas();
clearDock();
rememberContact();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
function set() { document.documentElement.style.setProperty('--sbw', (innerWidth - document.documentElement.clientWidth) + 'px'); }
set();
addEventListener('resize', set);
})();
(function () {
function rgb(c) { var m = c && c.match(/[\d.]+/g); return m ? { r: +m[0], g: +m[1], b: +m[2], a: m[3] === undefined ? 1 : +m[3] } : null; }
function lum(o) { return (o.r * .299 + o.g * .587 + o.b * .114) / 255; }
function red(o) { return o.r > 150 && o.g < 90 && o.b < 90; }
function groundIsDark(el) {
for (var p = el; p && p.nodeType === 1; p = p.parentElement) {
if (p.classList.contains('ds-dk-box')) return true; // just turned dark (its colour may still be transitioning)
var s = getComputedStyle(p), o = rgb(s.backgroundColor);
if (o && o.a > .5) return lum(o) < .3 || red(o);
if (s.backgroundImage !== 'none') return true;
}
return true;
}
function run() {
var all = document.querySelectorAll('body *');
var skip = '.header-2026, script, style, svg *, img, video, iframe, .ds-grid';
for (var i = 0; i < all.length; i++) {
var e = all[i]; if (e.matches(skip) || e.closest('.header-2026, .ti-widget')) continue;
if (e.matches('[class*="arrow"], [class*="line-plus"], button, .button, [class*="button"], [class*="checkbox"], .w-slider-dot')) continue;
var o = rgb(getComputedStyle(e).backgroundColor);
if (o && o.a > .5 && lum(o) > .55 && !red(o)) e.classList.add('ds-dk-box');
}
for (var j = 0; j < all.length; j++) {
var el = all[j]; if (el.matches(skip) || el.closest('.header-2026, .ti-widget')) continue; // the reviews widget keeps its own light cards
var s = getComputedStyle(el);
var own = false;
for (var k = 0; k < el.childNodes.length; k++) { var n = el.childNodes[k]; if (n.nodeType === 3 && n.data.trim()) { own = true; break; } }
var t = rgb(s.color);
if ((own || el.matches('input, textarea, select, a, button')) && t && !red(t) && lum(t) < .5 && groundIsDark(el)) {
el.classList.add(lum(t) < .2 ? 'ds-dk-ink' : 'ds-dk-ink-muted');
}
var sides = ['Top', 'Right', 'Bottom', 'Left'];
for (var q = 0; q < 4; q++) {
var w = parseFloat(s['border' + sides[q] + 'Width']), bc = rgb(s['border' + sides[q] + 'Color']);
if (w > 0 && bc && bc.a > .05 && !red(bc) && lum(bc) < .35 && groundIsDark(el)) { el.classList.add('ds-dk-line'); break; }
}
}
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
(function () {
function init() {
var hero = document.querySelector('.main-wrapper > :first-child');
var bar = document.querySelector('.header-2026 .cont-header');
if (!hero || !bar) return;
var queued = false;
function update() {
queued = false;
var overHero = hero.getBoundingClientRect().bottom > bar.getBoundingClientRect().bottom + 8;
document.documentElement.classList.toggle('ds-over-hero', overHero);
}
function onScroll() { if (!queued) { queued = true; requestAnimationFrame(update); } }
update();
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
var V = '3.12.5', base = /\/_ds\//.test((document.currentScript || {}).src || '') ? '/_ds/' : 'https://cdnjs.cloudflare.com/ajax/libs/gsap/' + V + '/';
function load(src) {
return new Promise(function (ok, fail) {
var s = document.createElement('script');
s.src = src; s.async = false; s.onload = ok; s.onerror = fail;
document.head.appendChild(s);
});
}
window.dsMotion = (window.gsap ? Promise.resolve() : load(base + 'gsap.min.js'))
.then(function () { return window.CustomEase ? null : load(base + 'CustomEase.min.js'); })
.then(function () {
gsap.registerPlugin(CustomEase);
CustomEase.create('emphasized', 'M0,0 C0.05,0 0.133333,0.06 0.166666,0.4 C0.208333,0.82 0.25,1 1,1');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.globalTimeline.timeScale(100);
document.documentElement.classList.add('ds-gsap');
return gsap;
})
.catch(function () { return null; });
})();
(function () {
function init() {
var root = document.documentElement;
var bar = document.querySelector('.header-2026 .cont-header');
var group = bar && bar.querySelector('.cont-but-nav');
var cta = group && group.querySelector('a.button');
if (!bar || !group || !cta) return;
var desk = matchMedia('(min-width: 992px)');
var en = /^\/en(\/|$)/.test(location.pathname);
var btn = document.createElement('button');
btn.type = 'button';
btn.className = 'ds-menu-btn';
btn.setAttribute('aria-label', en ? 'Open menu' : 'Menü öffnen');
btn.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 5h12M2 11h12"/></svg>';
group.insertBefore(btn, cta);
var logo = bar.querySelector('.cont-logo-links');
var nav = bar.querySelector('.cont-nav-menu');
var lang = bar.querySelector('.wp-lang');
var G = null, tl = null, compactNow = false;
function shapes() {
group.style.setProperty('--ds-cta-w', cta.offsetWidth + 'px');
var b = bar.getBoundingClientRect(), c = cta.getBoundingClientRect(), m = btn.getBoundingClientRect();
var items = [].filter.call(bar.querySelectorAll('.wp-nav-menu > .wp-link-nav'), function (e) { return e.getBoundingClientRect().width > 0; });
var full = { left: 0, right: 0, top: c.top - b.top, bottom: b.bottom - c.bottom };
if (items.length) {
full.left = (nav ? nav.getBoundingClientRect().left : items[0].getBoundingClientRect().left) - b.left - 16;
full.right = b.right - items[items.length - 1].getBoundingClientRect().right - 16;
}
var small = { left: m.left - b.left, right: b.right - m.right, top: m.top - b.top, bottom: b.bottom - m.bottom };
return { full: full, small: small };
}
function vars(r) {
return { '--ds-hdr-left': Math.max(0, r.left) + 'px', '--ds-hdr-right': Math.max(0, r.right) + 'px',
'--ds-hdr-top': Math.max(0, r.top) + 'px', '--ds-hdr-bottom': Math.max(0, r.bottom) + 'px' };
}
function setVars(v) { for (var k in v) bar.style.setProperty(k, v[k]); }
function snap() {
if (tl) { tl.kill(); tl = null; }
if (!desk.matches) {
setVars(vars({ left: 0, right: 0, top: 0, bottom: 0 }));
if (G) G.set([logo, nav, lang, btn], { clearProps: 'opacity,visibility' });
return;
}
var s = shapes(), v = vars(compactNow ? s.small : s.full);
if (G) {
G.set(bar, v);
G.set([logo, nav, lang], { autoAlpha: compactNow ? 0 : 1 });
G.set(btn, { autoAlpha: compactNow ? 1 : 0 });
} else {
bar.classList.add('ds-hdr-instant'); setVars(v); void bar.offsetWidth;
requestAnimationFrame(function () { bar.classList.remove('ds-hdr-instant'); });
}
}
function animate(compact) {
var s = shapes();
if (!G) { setVars(vars(compact ? s.small : s.full)); return; } // CSS transition
if (tl) tl.kill();
tl = G.timeline({ onComplete: function () { tl = null; } });
var items = nav ? nav.querySelectorAll('.wp-nav-menu > .wp-link-nav') : [];
if (compact) {
tl.to([lang, logo, nav], { autoAlpha: 0, duration: 0.22, ease: 'power1.out' }, 0)
.to(bar, Object.assign(vars(s.small), { duration: 0.75, ease: 'emphasized' }), 0.04)
.to(btn, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0.38);
} else {
tl.to(btn, { autoAlpha: 0, duration: 0.14, ease: 'power1.out' }, 0)
.to(bar, Object.assign(vars(s.full), { duration: 0.75, ease: 'emphasized' }), 0)
.to(logo, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.18)
.set(nav, { autoAlpha: 1 }, 0.22)
.fromTo(items, { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.022, ease: 'power2.out', clearProps: 'transform' }, 0.22)
.to(lang, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.36);
}
}
function set(compact, instant) {
compact = !!compact;
if (compact === compactNow && !instant) return;
compactNow = compact;
root.classList.toggle('ds-hdr-compact', compact);
if (instant || !desk.matches) snap(); else animate(compact);
}
var openedAt = null, queued = false, leaveTimer = 0;
var anchorY = scrollY, goingUp = false;
function want() {
var y = scrollY;
if (y > anchorY + 8) { goingUp = false; anchorY = y; }
else if (y < anchorY - 8) { goingUp = true; anchorY = y; }
if (openedAt !== null && Math.abs(y - openedAt) > 160) openedAt = null;
return desk.matches && y > 80 && !goingUp && openedAt === null;
}
function update() { queued = false; set(want()); }
function onScroll() { if (!queued) { queued = true; requestAnimationFrame(update); } }
function open() { clearTimeout(leaveTimer); openedAt = scrollY; set(false); }
btn.addEventListener('click', open);
btn.addEventListener('mouseenter', open);
bar.addEventListener('mouseenter', function () { clearTimeout(leaveTimer); });
bar.addEventListener('mouseleave', function () {
if (openedAt === null) return;
leaveTimer = setTimeout(function () { openedAt = null; update(); }, 350);
});
set(want(), true);
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', function () { set(want(), true); });
if (document.fonts) document.fonts.ready.then(function () { snap(); });
(window.dsMotion || Promise.resolve(null)).then(function (g) { if (g) { G = g; snap(); } });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
function init() {
(window.dsMotion || Promise.resolve(null)).then(function (G) {
if (!G) return;
document.querySelectorAll('.header-2026 .drop-nav').forEach(function (d) {
var list = d.querySelector('.w-dropdown-list');
if (!list) return;
new MutationObserver(function () {
if (list.classList.contains('w--open')) {
G.fromTo(list, { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'emphasized', clearProps: 'transform,opacity,visibility' });
}
}).observe(list, { attributes: true, attributeFilter: ['class'] });
});
});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
function init() {
var items = [].slice.call(document.querySelectorAll('.qestion[data-w-id]'));
if (!items.length) return;
var open = new Set();
items.forEach(function (q) {
var a = q.querySelector('.wrapper-qestion-answer');
if (a && a.offsetHeight > 0) open.add(q);
q.addEventListener('click', function (e) {
if (!e.isTrusted) return; // our own clicks below
if (open.has(q)) { open.delete(q); return; }
open.forEach(function (o) {
if (o !== q) { open.delete(o); o.click(); }
});
open.add(q);
});
});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
function init() {
var t = [].slice.call(document.querySelectorAll('.section-contact, .page-wrapper > .footer'));
if (!t.length || !('IntersectionObserver' in window)) return;
var seen = new Set();
var io = new IntersectionObserver(function (es) {
es.forEach(function (e) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
document.documentElement.classList.toggle('ds-at-footer', seen.size > 0);
}, { rootMargin: '0px 0px -15% 0px' });
t.forEach(function (el) { io.observe(el); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
var html = document.documentElement;
var framed = false;
try { framed = window.self !== window.top && window.top.location.origin === location.origin; } catch (e) {}
if (framed) {
html.classList.add('ds-in-panel');
var base = document.createElement('base'); base.target = '_top'; document.head.appendChild(base);
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') window.top.postMessage('ds-panel-close', location.origin); });
return;
}
var panel = null, lastFocus = null, prevTitle = '', G = null;
if (window.dsMotion) window.dsMotion.then(function (g) { G = g; });
var en = /^\/en(\/|$)/.test(location.pathname);
function build(href) {
var root = document.createElement('div');
root.className = 'ds-panel';
root.setAttribute('role', 'dialog');
root.setAttribute('aria-modal', 'true');
root.innerHTML = '<div class="ds-panel__veil"></div><div class="ds-panel__sheet">' +
'<button type="button" class="ds-panel__close" aria-label="' + (en ? 'Close' : 'Schließen') + '">' +
'<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
'<iframe class="ds-panel__frame" title=""></iframe></div>';
var frame = root.querySelector('iframe');
frame.addEventListener('load', function () {
root.classList.add('is-ready');
try { if (frame.contentDocument && frame.contentDocument.title) document.title = frame.contentDocument.title; } catch (e) {}
});
frame.src = href;
root.querySelector('.ds-panel__veil').addEventListener('click', function () { close(true); });
root.querySelector('.ds-panel__close').addEventListener('click', function () { close(true); });
return root;
}
function open(href) {
if (panel) return;
lastFocus = document.activeElement;
prevTitle = document.title;
panel = build(href);
document.body.appendChild(panel);
html.classList.add('ds-panel-open');
try { history.pushState({ dsPanel: href }, '', href); } catch (e) {}
var sheet = panel.querySelector('.ds-panel__sheet'), veil = panel.querySelector('.ds-panel__veil');
if (G) {
G.fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, duration: .4, ease: 'power1.out' });
G.fromTo(sheet, { xPercent: 100 }, { xPercent: 0, duration: .75, ease: 'emphasized' });
}
panel.querySelector('.ds-panel__close').focus();
}
function close(viaUi) {
if (!panel) return;
var p = panel; panel = null;
html.classList.remove('ds-panel-open');
document.title = prevTitle;
if (viaUi && history.state && history.state.dsPanel) { try { history.back(); } catch (e) {} }
var done = function () { if (p.parentNode) p.parentNode.removeChild(p); if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); };
if (G) {
G.to(p.querySelector('.ds-panel__veil'), { autoAlpha: 0, duration: .35, ease: 'power1.in' });
G.to(p.querySelector('.ds-panel__sheet'), { xPercent: 100, duration: .5, ease: 'power3.in', onComplete: done });
} else done();
}
document.addEventListener('click', function (e) {
if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
var a = e.target.closest && e.target.closest('a[href]');
if (!a || a.origin !== location.origin) return;
var artist = /^(\/en)?\/(iryna|luis|natali|ulyana)$/;
var here = location.pathname.replace(/\/+$/, '');
if (!(/card-crew/.test(a.className) || (artist.test(a.pathname.replace(/\/+$/, '')) && a.closest('.main-wrapper') && window.self === window.top && !artist.test(here)))) return;
e.preventDefault();
open(a.getAttribute('href'));
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel) close(true); });
window.addEventListener('message', function (e) { if (e.origin === location.origin && e.data === 'ds-panel-close') close(true); });
window.addEventListener('popstate', function () { if (panel) close(false); });
})();
(function () {
function run() {
if (document.querySelector('.section-hero') || ![].some.call(document.querySelectorAll('link[href*="inner.css"], style'), function (n) { return n.tagName === 'LINK' || n.textContent.indexOf('inner.css') > -1; })) return; // home has the scale already
if (!window.matchMedia('(min-width: 992px)').matches) return;
var els = document.querySelectorAll('.main-wrapper *');
var picks = [];
for (var i = 0; i < els.length; i++) {
var e = els[i];
if (e.closest('.section-contact, .ti-widget, .w-embed, form, script, style, svg, .ds-grid')) continue;
var own = false;
for (var k = 0; k < e.childNodes.length; k++) { var n = e.childNodes[k]; if (n.nodeType === 3 && n.data.trim()) { own = true; break; } }
if (!own) continue;
var s = getComputedStyle(e), fs = parseFloat(s.fontSize), cls = [];
if (fs >= 44) cls.push('ds-t-h2');
else if (fs >= 24) { cls.push('ds-t-card'); if (e.textContent.trim().length > 110) cls.push('ds-t-long'); } // a paragraph set large is a statement, not a title
else if (fs >= 19.5) cls.push('ds-t-sub');
else if (parseInt(s.fontWeight, 10) >= 600) cls.push('ds-t-w');
if (s.fontStyle === 'italic') cls.push('ds-t-roman');
if (cls.length) picks.push([e, cls]);
}
picks.forEach(function (p) { p[1].forEach(function (c) { p[0].classList.add(c); }); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
(function () {
function run() {
if (document.querySelector('.section-hero') || ![].some.call(document.querySelectorAll('link[href*="inner.css"], style'), function (n) { return n.tagName === 'LINK' || n.textContent.indexOf('inner.css') > -1; })) return;
if (!window.matchMedia('(min-width: 992px)').matches) return;
var secs = document.querySelectorAll('.main-wrapper > section, .main-wrapper > .section');
for (var i = 0; i < secs.length; i++) {
var s = secs[i];
if (i === 0 || /hero|section-contact/.test(s.className)) continue; // page heroes keep their own composition
var label = s.querySelector('.ds-label'), head = null, hs = s.querySelectorAll('.ds-t-h2');
for (var j = 0; j < hs.length; j++) { var q = hs[j].getBoundingClientRect(); if (q.width > 0 && q.height > 0 && q.left >= 0 && q.top >= s.getBoundingClientRect().top - 1 && getComputedStyle(hs[j]).visibility !== 'hidden') { head = hs[j]; break; } }
if (!label || !head) continue;
var lr = label.getBoundingClientRect(), hr = head.getBoundingClientRect();
if (hr.left - lr.left > 100 || lr.top > hr.bottom) continue; // already side by side, or the tag belongs to something lower
var lca = label.parentElement;
while (lca && !lca.contains(head)) lca = lca.parentElement;
if (!lca || !s.contains(lca)) continue;
if (lca.getBoundingClientRect().width < s.getBoundingClientRect().width * .6) continue; // a narrow side column keeps tag over heading
var a = label, b = head;
while (a.parentElement !== lca) a = a.parentElement;
while (b.parentElement !== lca) b = b.parentElement;
if (a === b) continue;
while (getComputedStyle(b).display === 'contents' && b !== head) { var nb = null; for (var c = 0; c < b.children.length; c++) if (b.children[c].contains(head)) nb = b.children[c]; if (!nb) break; b = nb; }
lca.classList.add('ds-sec-head');
a.classList.add('ds-sec-tag');
b.classList.add('ds-sec-title');
var prev = b, whole = '';
var hid = lca.querySelectorAll('h1, h2, h3');
for (var w = 0; w < hid.length; w++) if (!hid[w].getClientRects().length) whole += ' ' + hid[w].textContent.replace(/\s+/g, ' ');
for (var n = b.nextElementSibling; n; n = n.nextElementSibling) {
var t = n.matches('.ds-t-h2') ? n : n.querySelector('.ds-t-h2');
if (!(t && t.getBoundingClientRect().width > 0 && whole.indexOf(n.textContent.replace(/\s+/g, ' ').trim()) > -1 && n.getBoundingClientRect().top - prev.getBoundingClientRect().bottom < 40)) break;
n.classList.add('ds-sec-title');
var pull = n.getBoundingClientRect().top - prev.getBoundingClientRect().bottom;
if (pull > 0) n.style.setProperty('--sec-pull', pull + 'px');
prev = n;
}
var sl = head.getBoundingClientRect().left - (parseFloat(getComputedStyle(b).marginLeft) || 0) - lca.getBoundingClientRect().left;
if (sl > 1) a.style.setProperty('--sec-left', sl + 'px');
a.style.setProperty('--sec-top', (head.getBoundingClientRect().top - lca.getBoundingClientRect().top - (label.getBoundingClientRect().top - a.getBoundingClientRect().top)) + 'px');
}
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 0); }); else setTimeout(run, 0);
})();
(function () {
var root = document.documentElement, on = null;
function upd() { var v = window.scrollY < window.innerHeight * .6; if (v !== on) { on = v; root.classList.toggle('ds-at-top', v); } }
window.addEventListener('scroll', upd, { passive: true });
window.addEventListener('resize', upd);
upd();
})();
(function () {
var inFrame = window.self !== window.top;
var path = location.pathname.replace(/\/+$/, '') || '/';
var en = /^\/en(\/|$)/.test(path);
var segs = path.split('/').filter(Boolean); if (en) segs.shift();
function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
ready(function () {
document.querySelectorAll('.link-lang[href]').forEach(function (a) {
var toEn = /^\/en\/?$/.test(a.getAttribute('href'));
var k = document.querySelector('link[rel="alternate"][hreflang="' + (toEn ? 'en' : 'de') + '"]');
if (!k) return;
try { a.setAttribute('href', new URL(k.getAttribute('href'), location.href).pathname); } catch (e) {}
});
});
ready(function () {
document.querySelectorAll('.card-team').forEach(function (t) {
var a = t.querySelector('a[href="#"]'), h = t.querySelector('h3, .text-card-crew');
var m = h && h.textContent.trim().toLowerCase().match(/^(iryna|luis|natal[yi]|ulyana)/);
if (a && m) a.setAttribute('href', (en ? '/en/' : '/') + m[1].replace('nataly', 'natali'));
});
});
ready(function () {
if (inFrame) return;
var KEY = 'ds-back', st = null;
try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) {}
document.addEventListener('click', function (e) {
var a = e.target.closest && e.target.closest('a[href]');
if (!a || a.target === '_blank' || a.origin !== location.origin || a.classList.contains('ds-back')) return;
var to = a.pathname.replace(/\/+$/, '') || '/';
if (to === path) return;
try {
if (a.closest('.main-wrapper')) sessionStorage.setItem(KEY, JSON.stringify({ from: path, to: to }));
else sessionStorage.removeItem(KEY); // menu and footer links start a fresh visit
} catch (e2) {}
}, true);
var parent = null, label = null;
if (segs.length > 1 && /^(leistungen|services)$/.test(segs[0])) { parent = en ? '/en/services' : '/leistungen'; label = en ? 'All services' : 'Alle Leistungen'; }
else if (segs.length > 1 && segs[0] === 'blog' && !en) { parent = '/blog'; label = 'Blog'; }
else if (segs.length === 1 && /^(iryna|luis|natali|ulyana)$/.test(segs[0])) { parent = en ? '/en/about-us' : '/uber-uns'; label = 'Team'; }
var fromLink = !!(st && st.to === path && st.from && st.from !== path);
if (!parent && !fromLink) return;
var b = document.createElement('a');
b.className = 'ds-back';
b.href = fromLink ? st.from : parent;
b.textContent = fromLink && st.from !== parent ? (en ? 'Back' : 'Zurück') : label;
b.addEventListener('click', function (e) {
if (fromLink && history.length > 1 && document.referrer && new URL(document.referrer).pathname.replace(/\/+$/, '') === st.from.replace(/\/+$/, '')) { e.preventDefault(); history.back(); }
});
document.body.appendChild(b);
});
ready(function () {
var cards = document.querySelectorAll('.card-trust');
if (!cards.length) return;
cards.forEach(function (c) {
var w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT), n, hits = [];
while ((n = w.nextNode())) if (n.data.indexOf('★') > -1) hits.push(n);
hits.forEach(function (t) {
var i = t.data.indexOf('★'), rest = t.splitText(i); rest.splitText(1);
var sp = document.createElement('span'); sp.className = 'ds-star';
rest.parentNode.insertBefore(sp, rest); sp.appendChild(rest);
});
});
var rev = document.querySelector('.section.reviews a[href*="google."]');
cards.forEach(function (c) {
if (rev && /google/i.test(c.textContent)) {
c.classList.add('ds-trust-link'); c.setAttribute('role', 'link'); c.tabIndex = 0;
var go = function () { window.open(rev.href, '_blank', 'noopener'); };
c.addEventListener('click', go);
c.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
}
});
var team = [], seen = {};
document.querySelectorAll('.card-team').forEach(function (t) {
var a = t.querySelector('a[href]'), img = t.querySelector('.bg-card-team img');
if (!a || !img || seen[a.getAttribute('href')]) return;
seen[a.getAttribute('href')] = 1; team.push([a.getAttribute('href'), img.currentSrc || img.src]);
});
var artists = null;
cards.forEach(function (c) { if (!artists && /künstler|artists/i.test(c.textContent)) artists = c; });
var num = artists && artists.querySelector('.hero-about-p');
if (num && team.length) {
var box = document.createElement('span'); box.className = 'ds-faces';
team.forEach(function (m) {
var a = document.createElement('a'); a.href = m[0];
var im = document.createElement('img'); im.src = m[1]; im.alt = ''; im.loading = 'lazy';
a.appendChild(im); box.appendChild(a);
});
num.appendChild(box); artists.classList.add('ds-trust-faces');
}
});
ready(function () {
if (!document.querySelector('.hero-serv-sub')) return;
document.querySelectorAll('.card-team').forEach(function (c) {
var a = c.querySelector('a[href$="/natali"]'), img = c.querySelector('.bg-card-team img');
if (!a || !img) return;
img.removeAttribute('srcset'); img.removeAttribute('sizes');
img.src = 'https://cdn.prod.website-files.com/67ab1cdc35957b3f4f5c5836/684844f927af4cd648624827_nataly.avif';
});
});
(function () {
var EASE = 'cubic-bezier(.22, 1, .36, 1)', veil = null, clone = null, src = null, busy = false, openY = 0;
function ok(img) {
if (!img || img.tagName !== 'IMG' || !img.complete || !img.naturalWidth) return false;
if (!img.closest('.main-wrapper') || img.closest('a[href], button, .cont-new.follow, .example-wp, .section-contact, .ti-widget, .ds-faces, .slider.two-slides, .ub, .ds-lb-cell, .w-embed, [class*="hero-background"], [class*="hero-bg"], .header-2026')) return false;
if (/\.svg(\?|$)/i.test(img.currentSrc || img.src)) return false;
var r = img.getBoundingClientRect();
return r.width >= 160 && r.height >= 160;
}
function rectOf(el) { var r = el.getBoundingClientRect(); return { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }; }
function open(img) {
if (clone || busy) return;
busy = true; src = img; openY = window.scrollY;
veil = document.createElement('div'); veil.className = 'ds-zoom'; veil.setAttribute('role', 'dialog'); veil.setAttribute('aria-modal', 'true');
clone = img.cloneNode(false); clone.className = 'ds-zoom__img'; clone.removeAttribute('loading'); clone.removeAttribute('style');
if (clone.hasAttribute('srcset')) clone.sizes = '100vw';
var pad = Math.max(24, Math.min(window.innerWidth, window.innerHeight) * .05);
var mw = window.innerWidth - pad * 2, mh = window.innerHeight - pad * 2, ar = img.naturalWidth / img.naturalHeight;
var w = mw, h = w / ar; if (h > mh) { h = mh; w = h * ar; }
var to = { left: (window.innerWidth - w) / 2 + 'px', top: (window.innerHeight - h) / 2 + 'px', width: w + 'px', height: h + 'px' };
var from = rectOf(img);
for (var k in from) clone.style[k] = from[k];
document.body.appendChild(veil); document.body.appendChild(clone);
img.style.visibility = 'hidden';
requestAnimationFrame(function () { veil.classList.add('is-open'); });
var an = clone.animate([from, to], { duration: 550, easing: EASE, fill: 'forwards' });
an.onfinish = function () { for (var k in to) clone.style[k] = to[k]; an.cancel(); busy = false; };
veil.addEventListener('click', close); clone.addEventListener('click', close);
document.addEventListener('keydown', onKey); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', close);
}
function close() {
if (!clone || busy) return;
busy = true;
document.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', close);
veil.classList.remove('is-open');
src.style.visibility = 'hidden';
var s = src; s.style.visibility = ''; var to = rectOf(s); s.style.visibility = 'hidden';
var an = clone.animate([rectOf(clone), to], { duration: 450, easing: 'cubic-bezier(.45, 0, .2, 1)', fill: 'forwards' });
an.onfinish = function () { s.style.visibility = ''; clone.remove(); veil.remove(); clone = veil = src = null; busy = false; };
}
function onKey(e) { if (e.key === 'Escape') close(); }
function onScroll() { if (Math.abs(window.scrollY - openY) > 2) close(); }
document.addEventListener('click', function () { on = false; tag.classList.remove('is-on'); }, true);
document.addEventListener('click', function (e) {
if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
var img = e.target.closest && e.target.closest('img');
if (!img && e.target.querySelector) { var only = e.target.querySelectorAll(':scope > img'); if (only.length === 1) img = only[0]; }
if (!ok(img)) return;
e.preventDefault(); open(img);
});
document.addEventListener('mouseover', function (e) {
var img = e.target.tagName === 'IMG' ? e.target : null;
if (img && !img.classList.contains('ds-zoomable') && ok(img)) img.classList.add('ds-zoomable');
});
})();
})();
(function () {
function run() {
document.querySelectorAll('.cont-new.follow').forEach(function (b) {
var link = b.querySelector('a[href*="instagram.com"]'); if (!link) return;
b.querySelectorAll('.wp-im-follow').forEach(function (w) {
w.classList.add('ds-follow-link'); w.setAttribute('role', 'link'); w.tabIndex = 0;
var go = function () { window.open(link.href, '_blank', 'noopener'); };
w.addEventListener('click', go);
w.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
});
});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
(function () {
function build() {
document.querySelectorAll('.cont-exmp').forEach(function (box) {
if (box.querySelector('.arrow-exmpl, .ds-masonry')) return;
var items = [].slice.call(box.querySelectorAll(':scope > .wp-exmp > .wp-im-exmp')).filter(function (w) { return w.querySelector('img'); });
if (items.length < 4) return;
var list = document.createElement('div');
list.className = 'ds-masonry';
items.forEach(function (w) { var im = w.querySelector('img'); im.loading = 'eager'; list.appendChild(w); });
box.querySelectorAll(':scope > .wp-exmp').forEach(function (p) { if (!p.children.length) p.remove(); });
box.appendChild(list);
box.classList.add('ds-has-masonry');
var layout = function () {
var cs = getComputedStyle(list), cols = parseInt(cs.getPropertyValue('--m-col')) || 4, gap = parseFloat(cs.columnGap) || 16;
if (cols < 2) { list.style.height = ''; items.forEach(function (el) { el.style.cssText = ''; }); return; }
var w = (list.clientWidth - (cols - 1) * gap) / cols, h = Array(cols).fill(0);
items.forEach(function (el) {
el.style.position = 'absolute'; el.style.width = w + 'px';
var i = h.indexOf(Math.min.apply(null, h));
el.style.left = i * (w + gap) + 'px'; el.style.top = h[i] + 'px';
h[i] += el.offsetHeight + gap;
});
list.style.height = Math.max(0, Math.max.apply(null, h) - gap) + 'px';
};
var t; var later = function () { clearTimeout(t); t = setTimeout(layout, 60); };
layout();
items.forEach(function (el) { var im = el.querySelector('img'); if (!im.complete) { im.addEventListener('load', later, { once: true }); im.addEventListener('error', later, { once: true }); } });
window.addEventListener('resize', later);
});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
(function () {
var GROUPS = [
{ cell: '.ub-w', grid: true },
{ cell: '.cont-new.studio .grid-studio img', grid: true },
{ cell: '.section-case:is(.home, .eng) .slider-case .w-slide img', grid: false },
{ cell: '.ds-masonry > .wp-im-exmp', grid: true },
{ cell: '.cont-galery .wp-im-gal', grid: true },
{ cell: '.section.over-hide .card-serv.shop .bg-card-studio', grid: true },
{ cell: '.section.over-hide .card-top', grid: true }
];
function init() {
if (document.querySelector('.ds-lb')) return;
var groups = GROUPS.map(function (g) {
var cells = [].slice.call(document.querySelectorAll(g.cell)).filter(function (c) { return c.tagName === 'IMG' || c.querySelector('img'); });
cells.forEach(function (c) { c.classList.add('ds-lb-cell'); });
return { cells: cells, imgs: cells.map(function (c) { return c.tagName === 'IMG' ? c : c.querySelector('img'); }), grid: g.grid };
}).filter(function (g) { return g.cells.length; });
if (!groups.length) return;
var en = /^\/en(\/|$)/.test(location.pathname);
var EASE = 'cubic-bezier(.45,0,.55,1)', DUR = 600;
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var lb = document.createElement('div');
lb.className = 'ds-lb';
lb.setAttribute('role', 'dialog');
lb.setAttribute('aria-modal', 'true');
lb.innerHTML =
'<img class="ds-lb__img" alt="">' +
'<div class="ds-lb__nav">' +
'<div class="ds-lb__col is-start"><p class="ds-lb__text"><span data-lb-cur>01</span> / <span data-lb-tot></span></p></div>' +
'<div class="ds-lb__col is-center">' +
'<button type="button" class="ds-lb__btn" data-lb-prev><span class="ds-lb__dot"></span><span class="ds-lb__text">' + (en ? 'Prev' : 'Zurück') + '</span></button>' +
'<button type="button" class="ds-lb__btn" data-lb-next><span class="ds-lb__text">' + (en ? 'Next' : 'Weiter') + '</span><span class="ds-lb__dot"></span></button>' +
'</div>' +
'<div class="ds-lb__col is-end"><button type="button" class="ds-lb__btn" data-lb-close><span class="ds-lb__text">' + (en ? 'Close' : 'Schließen') + '</span></button></div>' +
'</div>';
document.body.appendChild(lb);
var im = lb.querySelector('.ds-lb__img');
var cur = lb.querySelector('[data-lb-cur]'), tot = lb.querySelector('[data-lb-tot]');
var pad = function (n) { return (n < 10 ? '0' : '') + n; };
var G = null, open = false, busy = false, idx = 0, start = 0, hidden = null;
function srcOf(i) { return G.imgs[i].currentSrc || G.imgs[i].src; }
function target(i) {
var nw = G.imgs[i].naturalWidth || 4, nh = G.imgs[i].naturalHeight || 5;
var top = 80, bottom = 96, side = 32;
var bw = innerWidth - 2 * side, bh = innerHeight - top - bottom;
var s = Math.min(bw / nw, bh / nh), w = nw * s, h = nh * s;
return { left: (innerWidth - w) / 2, top: top + (bh - h) / 2, width: w, height: h };
}
function place(r) { im.style.left = r.left + 'px'; im.style.top = r.top + 'px'; im.style.width = r.width + 'px'; im.style.height = r.height + 'px'; }
function frame(r, rad) { return { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: rad }; }
function radius(c) { var r = getComputedStyle(c).borderTopLeftRadius; return r && r !== '0px' ? r : '4.762px'; }
function inView(r) { return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && r.width > 0; }
function setCounter() { cur.textContent = pad(idx + 1); }
function show(i) {
if (!open || busy) return;
idx = (i + G.imgs.length) % G.imgs.length;
setCounter();
var go = function () { im.src = srcOf(idx); im.alt = G.imgs[idx].alt || ''; place(target(idx)); im.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' }); };
if (reduce) { go(); return; }
busy = true;
im.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease-in' }).onfinish = function () { go(); busy = false; };
}
function openAt(g, i) {
if (open || busy) return;
G = g; open = true; busy = true; idx = start = i; setCounter(); tot.textContent = pad(G.imgs.length);
var cell = G.cells[i], from = cell.getBoundingClientRect(), to = target(i), rad = radius(cell);
im.src = srcOf(i); im.alt = G.imgs[i].alt || '';
place(to);
lb.classList.add('is-on'); document.documentElement.classList.add('ds-lb-open');
hidden = cell; cell.style.visibility = 'hidden';
if (G.grid) G.cells.forEach(function (c) { if (c !== cell) c.classList.add('ds-lb-dim'); });
void lb.offsetWidth;
lb.classList.add('is-open');
var done = function () { busy = false; };
if (reduce) { done(); return; }
im.animate([frame(from, rad), frame(to, '4.762px')], { duration: DUR, easing: EASE }).onfinish = done;
}
function close() {
if (!open || busy) return;
busy = true;
var back = G.grid || idx === start;
var cell = G.cells[back ? idx : start], to = cell.getBoundingClientRect(), from = target(idx);
lb.classList.remove('is-open');
G.cells.forEach(function (c) { c.classList.remove('ds-lb-dim'); });
if (hidden && hidden !== cell) hidden.style.visibility = '';
cell.style.visibility = 'hidden';
var end = function () {
cell.style.visibility = ''; hidden = null;
lb.classList.remove('is-on'); im.removeAttribute('src'); document.documentElement.classList.remove('ds-lb-open');
open = false; busy = false;
};
if (reduce) { end(); return; }
var a = back && inView(to)
? im.animate([frame(from, '4.762px'), frame(to, radius(cell))], { duration: DUR, easing: EASE, fill: 'forwards' })
: im.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, easing: 'ease-out', fill: 'forwards' });
a.onfinish = function () { end(); a.cancel(); };
}
document.addEventListener('click', function (e) {
if (!e.target.closest || e.button !== 0) return;
for (var k = 0; k < groups.length; k++) {
var g = groups[k];
for (var j = 0; j < g.cells.length; j++) {
if (g.cells[j] === e.target || g.cells[j].contains(e.target)) {
e.preventDefault(); e.stopImmediatePropagation();
openAt(g, j); return;
}
}
}
}, true);
lb.querySelector('[data-lb-prev]').addEventListener('click', function () { show(idx - 1); });
lb.querySelector('[data-lb-next]').addEventListener('click', function () { show(idx + 1); });
lb.querySelector('[data-lb-close]').addEventListener('click', close);
lb.addEventListener('click', function (e) { if (!e.target.closest('.ds-lb__img, .ds-lb__btn')) close(); });
document.addEventListener('keydown', function (e) {
if (!open) return;
if (e.key === 'Escape') close();
else if (e.key === 'ArrowRight') show(idx + 1);
else if (e.key === 'ArrowLeft') show(idx - 1);
});
var x0 = 0;
lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1)); });
['wheel', 'touchmove'].forEach(function (t) { lb.addEventListener(t, function (e) { e.preventDefault(); }, { passive: false }); });
window.addEventListener('resize', function () { if (open && !busy) place(target(idx)); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
var SETS = [
{ card: '.card-team', link: 'a.button', btn: 'a.button' },
{ card: 'a.card-serv-new', link: null, btn: '.but-serv' }
];
function init() {
var tag = document.createElement('div');
tag.className = 'ds-cursor';
tag.setAttribute('aria-hidden', 'true');
tag.innerHTML = '<span class="ds-cursor__t"></span>';
document.body.appendChild(tag);
var txt = tag.firstChild, x = 0, y = 0, cx = 0, cy = 0, on = false, raf = 0;
document.documentElement.classList.add('ds-cursor-cards');
function labelOf(card, set) {
if (card.__dsLabel) return card.__dsLabel;
var b = card.querySelector(set.btn);
var t = b ? b.textContent.replace(/[→↗›>]/g, '').replace(/\s+/g, ' ').trim() : '';
return (card.__dsLabel = t);
}
function find(el) {
for (var i = 0; i < SETS.length; i++) {
var c = el.closest && el.closest(SETS[i].card);
if (c && c.closest('.main-wrapper')) return { card: c, set: SETS[i] };
}
return null;
}
function tick() {
cx += (x - cx) * .25; cy += (y - cy) * .25;
tag.style.transform = 'translate3d(' + (cx + 18) + 'px,' + (cy + 18) + 'px,0)';
raf = (on || Math.abs(x - cx) + Math.abs(y - cy) > .5) ? requestAnimationFrame(tick) : 0;
}
document.addEventListener('mousemove', function (e) {
x = e.clientX; y = e.clientY;
var hit = find(e.target), t = hit && labelOf(hit.card, hit.set);
if (t) {
if (!on) { cx = x; cy = y; }
txt.textContent = t; on = true; tag.classList.add('is-on');
} else if (on) { on = false; tag.classList.remove('is-on'); }
if (!raf) raf = requestAnimationFrame(tick);
}, { passive: true });
document.addEventListener('mouseleave', function () { on = false; tag.classList.remove('is-on'); });
window.addEventListener('scroll', function () { if (on) { on = false; tag.classList.remove('is-on'); } }, { passive: true });
document.addEventListener('click', function () { on = false; tag.classList.remove('is-on'); }, true);
document.addEventListener('click', function (e) {
if (e.defaultPrevented || e.button !== 0 || (e.target.closest && e.target.closest('a, button'))) return;
var hit = find(e.target);
if (!hit || !hit.set.link) return;
var a = hit.card.querySelector(hit.set.link);
if (a) a.click();
});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
function init() {
var host = document.querySelector('.header-2026 .cont-nav-menu');
if (!host || host.querySelector('.ds-ft-icons')) return;
var S = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"';
var icons = [
['wa.me', 'WhatsApp', '<svg ' + S + ' fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3.6 20.4l1.2-4.1a8.4 8.4 0 1 1 3.1 3z"/><path d="M9.2 7.9c-.4 0-.9.5-.9 1.3 0 2.6 3.4 6 6 6 .8 0 1.3-.5 1.3-.9v-.8l-1.8-.8-.9.8c-1.1-.4-2.1-1.4-2.5-2.5l.8-.9-.8-1.8z" fill="currentColor" stroke="none"/></svg>'],
['instagram.com', 'Instagram', '<svg ' + S + ' fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>'],
['facebook.com', 'Facebook', '<svg ' + S + ' fill="currentColor"><path d="M13.4 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21z"/></svg>'],
['youtube.com', 'YouTube', '<svg ' + S + ' fill="currentColor"><path fill-rule="evenodd" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z"/></svg>'],
['tiktok.com', 'TikTok', '<svg ' + S + ' fill="currentColor"><path d="M16.3 3c.3 2.3 1.6 3.7 3.9 3.9v3.1a7 7 0 0 1-3.9-1.2v6.1a5.7 5.7 0 1 1-5.7-5.7l.6.1v3.2l-.6-.1a2.5 2.5 0 1 0 2.5 2.5V3z"/></svg>']
];
var links = Array.prototype.slice.call(document.querySelectorAll('.section-contact .link-contact:not(.hidden)'));
var row = document.createElement('div');
row.className = 'ds-ft-icons';
icons.forEach(function (ic) {
var src = links.filter(function (a) { return a.href.indexOf(ic[0]) > -1; })[0];
if (!src) return;
var a = document.createElement('a');
a.href = src.href; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', ic[1]);
a.innerHTML = ic[2];
row.appendChild(a);
});
if (row.children.length) host.appendChild(row);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
function init() {
var sec = document.querySelector('.main-wrapper > .section-contact:last-child');
if (!sec || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var wrap = document.createElement('div');
wrap.className = 'ds-fpar';
sec.parentNode.insertBefore(wrap, sec);
wrap.appendChild(sec);
sec.classList.add('ds-fpar__inner');
var dark = document.createElement('div');
dark.className = 'ds-fpar__dark';
wrap.appendChild(dark);
var ticking = false;
function update() {
ticking = false;
var r = wrap.getBoundingClientRect(), vh = innerHeight;
var top = r.top + scrollY, max = document.documentElement.scrollHeight - vh;
var start = Math.max(0, top - vh), end = Math.min(top, max);
var p = end > start ? (scrollY - start) / (end - start) : 1;
p = Math.max(0, Math.min(1, p));
var pad = parseFloat(getComputedStyle(sec).paddingTop) || 0;
var shift = Math.min(sec.offsetHeight * .25, pad);
sec.style.transform = 'translate3d(0,' + (-shift * (1 - p)).toFixed(1) + 'px,0)';
dark.style.opacity = (.5 * (1 - p)).toFixed(3);
}
var req = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
window.addEventListener('scroll', req, { passive: true });
window.addEventListener('resize', req);
update();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
var DE = (document.documentElement.lang || '').toLowerCase().indexOf('de') === 0;
var T = DE
? { req: 'Bitte ausfüllen', name: 'Mindestens 2 Zeichen', mail: 'Bitte gültige E-Mail eingeben', tel: 'Bitte gültige Telefonnummer eingeben' }
: { req: 'Please fill this in', name: 'At least 2 characters', mail: 'Please enter a valid email', tel: 'Please enter a valid phone number' };
function kind(inp) {
var n = (inp.name || '').toLowerCase();
if (inp.type === 'email' || /mail/.test(n)) return 'mail';
if (inp.type === 'tel' || /number|phone|tel/.test(n)) return 'tel';
return 'name';
}
function check(inp) {
var v = inp.value.trim(), k = kind(inp);
if (!v) return inp.required ? T.req : '';
if (k === 'mail' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return T.mail;
if (k === 'tel' && (!/^[+\d\s()\/.-]+$/.test(v) || v.replace(/\D/g, '').length < 6)) return T.tel;
if (k === 'name' && v.length < 2) return T.name;
return '';
}
function init() {
document.querySelectorAll('.main-wrapper form.normal-form').forEach(function (form) {
if (form.__dsFv) return;
form.__dsFv = true;
form.setAttribute('novalidate', '');
var fields = [].slice.call(form.querySelectorAll('input.filed[required], textarea.filed[required]')).map(function (inp) {
var wrap = document.createElement('span');
wrap.className = 'ds-fv';
inp.parentNode.insertBefore(wrap, inp);
wrap.appendChild(inp);
wrap.insertAdjacentHTML('beforeend', '<span class="ds-fv__ico" aria-hidden="true"></span>');
var msg = document.createElement('span');
msg.className = 'ds-fv__msg';
msg.id = (inp.id || 'f' + Math.random().toString(36).slice(2)) + '-err';
msg.setAttribute('aria-live', 'polite');
wrap.parentNode.insertBefore(msg, wrap.nextSibling);
var f = { inp: inp, wrap: wrap, msg: msg, started: false };
var run = function () {
var e = check(inp);
wrap.classList.toggle('is-error', !!e);
wrap.classList.toggle('is-ok', !e && !!inp.value.trim());
msg.textContent = e;
msg.classList.toggle('is-on', !!e);
if (e) { inp.setAttribute('aria-invalid', 'true'); inp.setAttribute('aria-describedby', msg.id); }
else inp.removeAttribute('aria-invalid');
return !e;
};
f.run = run;
inp.addEventListener('blur', function () { if (inp.value.trim()) f.started = true; if (f.started) run(); });
inp.addEventListener('input', function () { if (f.started) run(); });
return f;
});
window.addEventListener('submit', function (e) {
if (e.target !== form) return;
var bad = null;
fields.forEach(function (f) { f.started = true; if (!f.run() && !bad) bad = f; });
if (bad) {
e.preventDefault(); e.stopImmediatePropagation();
bad.inp.focus({ preventScroll: true });
var r = bad.wrap.getBoundingClientRect();
if (r.top < 120 || r.bottom > innerHeight) scrollBy({ top: r.top - innerHeight / 3, behavior: 'smooth' });
}
}, true);
});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
function slug(t) {
return t.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}
function init() {
var art = document.querySelector('.section.article .rich-article');
if (!art) return;
var hs = [].slice.call(art.querySelectorAll('h2, h3')).filter(function (h) { return h.textContent.trim(); });
if (art.querySelectorAll('h2').length < 3) return;
var DE = (document.documentElement.lang || '').toLowerCase().indexOf('de') === 0;
var sec = art.closest('.section.article');
var nav = document.createElement('nav');
nav.className = 'ds-toc';
nav.setAttribute('aria-label', DE ? 'Inhalt' : 'Contents');
var inner = '<div class="ds-toc__in"><div class="ds-toc__title">' + (DE ? 'Inhalt' : 'Contents') + '</div><ol class="ds-toc__list">';
var used = {};
hs.forEach(function (h, i) {
if (!h.id) { var s = slug(h.textContent) || 'section-' + (i + 1); while (used[s] || document.getElementById(s)) s += '-' + (i + 1); h.id = s; }
used[h.id] = 1;
inner += '<li class="ds-toc__item' + (h.tagName === 'H3' ? ' is-sub' : '') + '"><a class="ds-toc__link" href="#' + h.id + '"></a></li>';
});
nav.innerHTML = inner + '</ol></div>';
var links = [].slice.call(nav.querySelectorAll('.ds-toc__link'));
links.forEach(function (a, i) { a.textContent = hs[i].textContent.trim(); });
sec.appendChild(nav);
document.documentElement.classList.add('ds-has-toc');
var OFF = 110;
links.forEach(function (a, i) {
a.addEventListener('click', function (e) {
e.preventDefault(); e.stopPropagation(); // Webflow's own hash scroll would land the heading under the header
var y = hs[i].getBoundingClientRect().top + scrollY - OFF + 1;
scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
history.replaceState(null, '', '#' + hs[i].id);
});
});
var cur = -1, ticking = false;
function update() {
ticking = false;
var k = -1;
for (var i = 0; i < hs.length; i++) { if (hs[i].getBoundingClientRect().top - OFF - 40 <= 0) k = i; else break; }
if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4 && art.getBoundingClientRect().bottom < innerHeight) k = hs.length - 1;
if (k === cur) return;
if (cur > -1) links[cur].classList.remove('is-active');
if (k > -1) {
links[k].classList.add('is-active');
var box = nav.firstChild, lt = links[k].offsetTop, lh = links[k].offsetHeight;
if (lt < box.scrollTop || lt + lh > box.scrollTop + box.clientHeight - 32) box.scrollTo({ top: Math.max(0, lt - box.clientHeight / 3), behavior: 'smooth' });
}
cur = k;
}
addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
update();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
(function () {
var y = String(new Date().getFullYear());
document.querySelectorAll('.footer .capptalize-aa').forEach(function (el) {
if (el.children.length) return;
var t = el.textContent, n = t.replace(/(©\s*)\d{4}/, '$1' + y);
if (n !== t) el.textContent = n;
});
})();
(function () {
var KEY = 'ds-shutter', N = 10, root = document.documentElement;
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function store(v) { try { v ? sessionStorage.setItem(KEY, '1') : sessionStorage.removeItem(KEY); } catch (e) {} }
if (reduce) { root.classList.remove('ds-shutter-in'); store(false); return; }
var wrap = document.createElement('div');
wrap.className = 'ds-shutter';
wrap.setAttribute('aria-hidden', 'true');
for (var i = 0; i < N; i++) wrap.appendChild(document.createElement('i'));
document.body.appendChild(wrap);
var bands = wrap.children, busy = false;
var OPEN = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
function page() { return document.querySelector('.main-wrapper'); }
function reveal(g) {
store(false);
if (!g) { root.classList.remove('ds-shutter-in'); return; }
g.set(bands, { yPercent: 0, clipPath: OPEN });
wrap.classList.add('is-on');
root.classList.remove('ds-shutter-in');
var tl = g.timeline({ onComplete: function () { wrap.classList.remove('is-on'); g.set(page(), { clearProps: 'transform' }); } });
tl.to(bands, { duration: .75, ease: 'expo.out', yPercent: -50, clipPath: 'polygon(0% 0%, 100% 0%, 100% -2%, 0% -2%)', stagger: { amount: .3, from: 'end' } }, 0);
if (page()) tl.from(page(), { y: '20vh', duration: .8, ease: 'expo.out' }, 0);
}
function cover(g, href) {
busy = true;
store(true);
wrap.classList.add('is-on');
g.set(bands, { yPercent: 50, clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' });
var tl = g.timeline({ onComplete: function () { location.href = href; } });
tl.to(bands, { duration: .5, ease: 'power3.in', yPercent: 0, clipPath: OPEN, stagger: { amount: .3, from: 'end' } }, 0);
if (page()) tl.to(page(), { y: '-15vh', duration: .75, ease: 'power3.in' }, 0);
}
function internal(a, e) {
if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
if (a.target && a.target !== '_self') return false;
if (a.hasAttribute('download') || a.closest('[data-no-transition], .w-lightbox, .w-dropdown-toggle')) return false;
var raw = a.getAttribute('href') || '';
if (!raw || raw.charAt(0) === '#' || /^(mailto|tel|javascript):/i.test(raw)) return false;
var u = new URL(a.href, location.href);
if (u.origin !== location.origin) return false;
if (u.pathname === location.pathname && u.search === location.search) return false; // same page or an anchor on it
return true;
}
(window.dsMotion || Promise.resolve(null)).then(function (g) {
if (root.classList.contains('ds-shutter-in')) reveal(g);
if (!g) return;
document.addEventListener('click', function (e) {
var a = e.target.closest && e.target.closest('a[href]');
if (!a || busy || !internal(a, e)) return;
e.preventDefault();
cover(g, a.href);
});
});
addEventListener('pageshow', function (e) {
if (!e.persisted) return;
busy = false; store(false);
root.classList.remove('ds-shutter-in');
wrap.classList.remove('is-on');
if (window.gsap) gsap.set(page(), { clearProps: 'transform' });
});
})();
(function () {
var sec = document.querySelector('.section-reviews');
var link = sec && sec.querySelector('.wrapper-button-review > a');
if (!link) return;
function place() {
var slot = sec.querySelector('.ti-widget .ti-header-write-btn-container');
if (!slot) return false;
if (link.parentNode !== slot) {
slot.classList.add('ds-rev-actions');
slot.insertBefore(link, slot.firstChild);
sec.querySelector('.wrapper-button-review').classList.add('ds-moved');
}
return true;
}
if (place()) return;
var mo = new MutationObserver(function () { if (place()) mo.disconnect(); });
mo.observe(sec, { childList: true, subtree: true });
})();
(function () {
var h = document.querySelector('.section.hero-shop h1');
if (!h || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var PX_PER_S = 75;
var box = document.createElement('div'); box.className = 'ds-mq';
h.parentNode.insertBefore(box, h);
function item(node) {
var it = document.createElement('div'); it.className = 'ds-mq__item';
var mark = document.createElement('span'); mark.className = 'ds-mq__mark'; mark.setAttribute('aria-hidden', 'true');
it.appendChild(node); it.appendChild(mark); return it;
}
function copy() {
var c = document.createElement('div'); c.className = h.className + ' ds-mq__copy';
c.setAttribute('aria-hidden', 'true'); c.setAttribute('data-nosnippet', ''); c.innerHTML = h.innerHTML; return c;
}
var lists = [];
for (var l = 0; l < 2; l++) {
var list = document.createElement('div'); list.className = 'ds-mq__list';
if (l) list.setAttribute('aria-hidden', 'true');
for (var i = 0; i < 3; i++) list.appendChild(item(l === 0 && i === 0 ? h : copy()));
box.appendChild(list); lists.push(list);
}
function speed() { lists.forEach(function (x) { x.style.animationDuration = (x.offsetWidth / PX_PER_S) + 's'; }); }
speed(); window.addEventListener('resize', speed);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(speed);
new IntersectionObserver(function (es) {
es.forEach(function (e) { lists.forEach(function (x) { x.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'; }); });
}).observe(box);
document.documentElement.classList.add('ds-has-mq');
})();
(function () {
var host = document.querySelector('.section.hero-shop .cont-hero-text');
if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // keeps the flat set image
var P = [
['6a5fa36a53b86b1305e7d8ee_bfd68d6c-1f2b-4912-9b96-630c90200c89', .7944, .4657, .4164, -80.81, 1536 / 1024],
['6a5fa36a3d1d44384e59729a_d7c1e2c0-f488-459a-818c-2e16288462f3', .4823, .5, .7355, -23.03, 1],
['6a5fa36984f25c4ed3f221c6_1109a354-9370-44a4-b11e-f61f1e518be1', .6710, .5515, .6581, 0, 1122 / 1402],
['6a5fa36a1635bdb3e9f7e65e_a8eae842-6d3f-4139-86c9-fa558a3c0651', .4088, .7551, .3144, 0, 1122 / 1402]
];
var tiles = [].slice.call(document.querySelectorAll('.card-serv.shop .bg-card-studio'));
function tileFor(id) {
for (var i = 0; i < tiles.length; i++) { var im = tiles[i].querySelector('img'); if (im && (im.getAttribute('src') || '').indexOf(id.split('_')[1]) > -1) return tiles[i]; }
return null;
}
var set = document.createElement('div'); set.className = 'ds-set'; set.setAttribute('aria-hidden', 'true');
var fly = document.createElement('div'); fly.className = 'ds-fly'; fly.setAttribute('aria-hidden', 'true');
var pieces = P.map(function (p, i) {
var tile = tileFor(p[0]), src = tile && tile.querySelector('img');
if (!src) return null; // the card is gone: the piece stays out
var im = document.createElement('img'); im.className = 'ds-fly__p'; im.alt = ''; im.decoding = 'async';
im.src = src.getAttribute('src'); if (src.getAttribute('srcset')) im.srcset = src.getAttribute('srcset');
im.sizes = '(max-width: 767px) 90vw, 45vw';
fly.appendChild(im);
return { el: im, x: p[1], y: p[2], w: p[3], r: p[4], a: p[5], tile: tile, lag: [0, .04, .08, .12][i], arc: i === 0 };
}).filter(Boolean);
if (pieces.length < P.length) { fly.innerHTML = ''; return; } // keep the flat set image
host.appendChild(set); document.body.appendChild(fly); host.classList.add('ds-has-set');
function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
var raf = 0;
function frame() {
raf = 0;
var S = set.getBoundingClientRect(), vh = innerHeight, y = window.scrollY;
pieces.forEach(function (p) {
var cx0 = S.left + p.x * S.width, cy0 = S.top + p.y * S.height, w0 = p.w * S.width;
var t = 0, lin = 0, cx1 = cx0, cy1 = cy0, w1 = w0;
if (p.tile) {
var T = p.tile.getBoundingClientRect();
cx1 = T.left + T.width / 2; cy1 = T.top + T.height / 2;
var im = p.tile.querySelector('img'), cs = im && getComputedStyle(im);
if (cs && cs.objectFit === 'contain') { // as the card shows it: contain inside the image's padding
var bw = T.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), bh = T.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
w1 = p.a > bw / bh ? bw : bh * p.a;
} else w1 = p.a > T.width / T.height ? T.height * p.a : T.width; // object-fit: cover
var end = Math.max(1, cy1 + y - vh * .55); // done when the card's middle is a bit above the screen middle
lin = clamp((y / end - p.lag) / (1 - p.lag)); t = ease(lin);
}
var cx, cy, w, h, r;
if (p.arc && p.tile) {
var cyDoc = cy1 + y, aEnd = Math.max(1, Math.min(end * .5, cyDoc - vh * 1.05));
var ta = clamp(y / aEnd), tb = clamp((vh - cy1) / (vh * .45)); // tb: card middle from screen bottom to 55%
if (tb > 0) {
var e = 1 - Math.pow(1 - tb, 3); // ease-out: arrives softly
var bx = -w1 * .55, by = cy1 - T.height * .85;
cx = bx + (cx1 - bx) * e; cy = by + (cy1 - by) * e; w = w1; r = -55 * (1 - e);
t = tb;
} else {
var ea = ta * ta * ta; // ease-in: picks up speed as it leaves
var ox = innerWidth + w0 * .4, oy = -w0 * .7;
cx = cx0 + (ox - cx0) * ea; cy = cy0 + (oy - cy0) * ea; w = w0; r = p.r + 12 * ea;
t = ta >= 1 ? .5 : ta * .5;
}
h = w / p.a;
p.tile.classList.toggle('ds-await', tb < 1);
p.el.hidden = tb >= 1 || (ta >= 1 && tb <= 0);
if (p.el.hidden) return;
} else {
var landed = t >= 1;
if (p.tile) p.tile.classList.toggle('ds-await', !landed);
p.el.hidden = landed;
if (landed) return;
cx = cx0 + (cx1 - cx0) * t; cy = cy0 + (cy1 - cy0) * t; w = w0 + (w1 - w0) * t; h = w / p.a; r = p.r * (1 - t);
}
var home = t <= 0;
p.el.style.width = w.toFixed(1) + 'px';
p.el.style.setProperty('--t', t.toFixed(3));
p.el.style.transform = 'translate3d(' + (cx - w / 2).toFixed(1) + 'px,' + (cy - h / 2).toFixed(1) + 'px,0) rotate(' + r.toFixed(2) + 'deg)';
if (home) p.el.style.setProperty('--t', '0');
});
}
function kick() { if (!raf) raf = requestAnimationFrame(frame); }
frame();
window.addEventListener('scroll', kick, { passive: true });
window.addEventListener('resize', kick);
window.addEventListener('load', kick);
})();
(function () {
var host = document.querySelector('.cont-new.shop');
if (!host) return;
var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
var own = document.querySelector('script[src*="/blitz-ds@"][src$="/blitz-ds.js"]');
var hostImg = own ? own.src.replace(/blitz-ds\.js$/, 'img/') : '';
if (!local && !hostImg) return;
var IDS = ['6a5fa36a3d1d44384e59729a_d7c1e2c0-f488-459a-818c-2e16288462f3',
'6a5fa36a1635bdb3e9f7e65e_a8eae842-6d3f-4139-86c9-fa558a3c0651', '6a5fa36984f25c4ed3f221c6_1109a354-9370-44a4-b11e-f61f1e518be1',
'6a5fa36a53b86b1305e7d8ee_bfd68d6c-1f2b-4912-9b96-630c90200c89'];
var imgDir = 'https://cdn.prod.website-files.com/67ab1cdc35957b3f4f5c5836/';
var stage = document.createElement('div'); stage.className = 'ds-hm'; stage.setAttribute('aria-hidden', 'true'); stage.setAttribute('data-nosnippet', '');
var lists = [];
function row(cls, fill) {
var r = document.createElement('div'); r.className = 'ds-hm__row ' + cls;
for (var l = 0; l < 3; l++) { var list = document.createElement('div'); list.className = 'ds-hm__list'; fill(list); r.appendChild(list); lists.push(list); }
stage.appendChild(r);
}
row('ds-hm__text', function (list) {
for (var i = 0; i < 3; i++) {
var w = document.createElement('div'); w.className = 'ds-hm__word';
w.innerHTML = '<span>Branded Merch <em>by Blitz</em></span><i></i>'; list.appendChild(w);
}
});
row('ds-hm__goods', function (list) {
IDS.forEach(function (id) {
var it = document.createElement('div'); it.className = 'ds-hm__item' + (id.indexOf('bfd68d6c-1f2b-4912-9b96-630c90200c89') > -1 ? ' is-small' : ''); // the pen
var im = document.createElement('img'); im.alt = ''; im.loading = 'lazy'; im.decoding = 'async';
if (local) { im.src = imgDir + id + '-p-500.webp'; im.srcset = imgDir + id + '-p-500.webp 500w, ' + imgDir + id + '-p-800.webp 800w'; }
else im.src = hostImg + id.split('_')[1] + '.webp';
im.sizes = '(max-width: 767px) 55vw, 24vw';
it.appendChild(im); list.appendChild(it);
});
});
host.appendChild(stage);
var rows = [
{ el: stage.children[0], sign: -1, drift: 40, travel: .5, x: 0, w: 0 },
{ el: stage.children[1], sign: 1, drift: 30, travel: 1, x: 0, w: 0 }
];
var WAVE_Y = .25, PER_WAVE = 10, WAVE_TRAVEL = .25, waveLen = 1, goods = [];
function measure() {
rows.forEach(function (r) { r.w = r.el.firstChild.offsetWidth; });
goods = [].map.call(rows[1].el.querySelectorAll('.ds-hm__item'), function (it) {
return { el: it, x: it.offsetLeft, w: it.offsetWidth, h: it.offsetHeight };
});
var first = goods.slice(0, IDS.length), avg = first.reduce(function (a, g) { return a + g.w; }, 0) / Math.max(1, first.length);
waveLen = Math.max(stage.offsetWidth, avg * PER_WAVE) * (innerWidth < 768 ? .75 : 1);
}
measure(); window.addEventListener('resize', measure);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
stage.querySelectorAll('img').forEach(function (im) { im.addEventListener('load', measure); });
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var dir = 1, lastY = window.scrollY, last = 0, on = false, raf = 0;
function progress() {
var r = stage.getBoundingClientRect(), vh = window.innerHeight;
return Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
}
function frame(t) {
var dt = last ? Math.min(.05, (t - last) / 1000) : 0; last = t;
var y = window.scrollY; if (y !== lastY) { dir = y > lastY ? 1 : -1; lastY = y; }
var p = progress();
rows.forEach(function (r) {
if (!r.w) return;
if (!reduce) r.x += r.sign * dir * r.drift * dt;
var x = r.x + r.sign * p * r.w * r.travel;
var total = x;
x = ((x % r.w) + r.w) % r.w - r.w; // keep it in [-w, 0): the copies always cover the row
for (var c = r.el.firstChild; c; c = c.nextSibling) c.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
if (r === rows[1] && !reduce) {
var roll = total / waveLen * Math.PI * 2 * WAVE_TRAVEL, vw = stage.offsetWidth;
goods.forEach(function (g) {
var gx = g.x + x;
if (gx + g.w < 0 || gx > vw) return;
var y = Math.sin(gx / waveLen * Math.PI * 2 + roll) * g.h * WAVE_Y;
g.el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
});
}
});
raf = on ? requestAnimationFrame(frame) : 0;
}
new IntersectionObserver(function (es) {
on = es[0].isIntersecting;
if (on && !raf) { last = 0; raf = requestAnimationFrame(frame); }
}).observe(stage);
})();
(function () {
var box = document.querySelector('.cont-new.centr > .wp-im-gift');
if (!box || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var host = box.parentNode, cur = -1, target = 0, raf = 0;
function measure() {
var r = host.getBoundingClientRect(), vh = innerHeight;
var start = vh * .9, end = vh * .5 - r.height / 2; // top position at p = 0 and at p = 1
target = Math.max(0, Math.min(1, (start - r.top) / (start - end)));
}
function frame() {
raf = 0;
cur = cur < 0 ? target : cur + (target - cur) * .18;
if (Math.abs(target - cur) < .001) cur = target;
box.style.setProperty('--p', cur.toFixed(4));
if (cur !== target) raf = requestAnimationFrame(frame);
}
function update() { measure(); if (!raf) raf = requestAnimationFrame(frame); }
window.addEventListener('scroll', update, { passive: true });
window.addEventListener('resize', update);
update();
})();
(function () {
var cards = document.querySelectorAll('.cont-new.cards > .cont-text-card');
if (!cards.length) return;
var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
var url = local ? '/_ds/paper-shaders.js' : 'https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.0.82/+esm';
var NUM = ['angle', 'seed', 'scale', 'roughness', 'roughness-size', 'roughness-rows', 'fiber', 'fiber-size', 'folds',
'fold-size-x', 'fold-size-y', 'fold-offset-x', 'fold-offset-y', 'wrinkles', 'wrinkle-size', 'crumples', 'crumple-count', 'drops'];
function camel(s) { return s.replace(/-(\w)/g, function (m, c) { return c.toUpperCase(); }); }
import(url).then(function (P) {
var noise = P.getShaderNoiseTexture();
return (noise.decode ? noise.decode() : Promise.resolve()).then(function () { return [P, noise]; });
}).then(function (r) {
var P = r[0], noise = r[1], mounts = [];
function uniforms(card) {
var cs = getComputedStyle(card), v = function (n) { return cs.getPropertyValue('--paper-' + n).trim(); };
var u = {
u_isImage: false, u_imageAspectRatio: card.offsetWidth / Math.max(1, card.offsetHeight), u_blending: 0, u_distortion: 0, u_clip: false,
u_colorBack: P.getShaderColorFromString(v('color-back') || '#00000000'),
u_colorPaper: P.getShaderColorFromString(v('color-paper') || '#ffffff'),
u_colorShadow: P.getShaderColorFromString(v('color-shadow') || '#b3b3b3'),
u_noiseTexture: noise,
u_fit: P.ShaderFitOptions.cover, u_rotation: 0, u_offsetX: 0, u_offsetY: 0, u_originX: .5, u_originY: .5,
u_worldWidth: 0, u_worldHeight: 0
};
NUM.forEach(function (n) { u['u_' + camel(n)] = parseFloat(v(n)) || 0; });
return { on: v('on') !== '0', u: u };
}
cards.forEach(function (card, i) {
var box = document.createElement('div');
box.className = 'ds-paper';
box.setAttribute('aria-hidden', 'true');
card.insertBefore(box, card.firstChild);
var c = uniforms(card);
box.hidden = !c.on;
try { mounts[i] = new P.ShaderMount(box, P.paperTextureFragmentShader, c.u, undefined, 0, 0); }
catch (e) { box.remove(); }
});
document.addEventListener('ds-paper-update', function () {
cards.forEach(function (card, i) {
if (!mounts[i]) return;
var c = uniforms(card);
mounts[i].parentElement.hidden = !c.on;
mounts[i].setUniforms(c.u);
});
});
}).catch(function () {});
})();
});
