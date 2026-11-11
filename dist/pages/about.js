(function(run){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();})(function(){
(function () {
function init() {
document.querySelectorAll('.item-approach h3').forEach(function (el) {
el.childNodes.forEach(function (node) {
if (node.nodeType === 3) node.textContent = node.textContent.replace(/[\s\u00a0]+/g, ' ');
});
});
document.querySelectorAll('.wp-h-more h2, .wp-p-more-sec p').forEach(function (el) {
var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
for (var node = walker.nextNode(); node; node = walker.nextNode()) {
var text = node.textContent.replace(/^[\s ]+/, '');
node.textContent = text;
if (text) break;
}
});
var rev = document.querySelector('.cont-card-rev');
if (rev && !rev.querySelector('.code-embed-2')) {
var box = document.createElement('div');
box.className = 'code-embed-2 w-embed w-script';
var s = document.createElement('script');
s.defer = true; s.async = true;
s.src = 'https://cdn.trustindex.io/loader.js?9cc04a779377562b4a7644e65e6';
box.appendChild(s);
rev.insertBefore(box, rev.firstChild);
rev.classList.add('has-google');
}
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
});
