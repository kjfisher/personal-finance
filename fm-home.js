/* Future Millionaires Arcade: "back to the Arcade" button on every game.
   Add to a page with: <script src="/fm-home.js" defer></script>
   Tap once = "Leave game?" (so a stray tap doesn't lose progress), tap again within 3 seconds = go to the Arcade. */
(function () {
  if (window.__fmHome) return; window.__fmHome = true;
  var st = document.createElement('style');
  st.textContent = `
.fmh-btn{position:fixed;left:max(14px,env(safe-area-inset-left,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));z-index:9998;
  font:700 16px "Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif;padding:12px 16px;border-radius:999px;border:2px solid #E0A800;
  background:#F3F5F8;color:#14213D;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer;display:flex;gap:6px;align-items:center;text-decoration:none;min-width:136px;justify-content:center;white-space:nowrap}
.fmh-btn.ask{background:#E0A800;color:#14213D}
.fmh-btn:focus-visible{outline:3px solid #14213D;outline-offset:3px}
body.fmh-on{padding-bottom:84px}
body.fmh-on .fmc-btn{left:calc(max(14px,env(safe-area-inset-left,0px)) + 148px)!important}
@media print{.fmh-btn{display:none}}`;
  document.head.appendChild(st);
  var a = document.createElement('a');
  a.className = 'fmh-btn'; a.href = '/'; a.setAttribute('aria-label', 'Back to the Arcade home page');
  var label = '<span aria-hidden="true">🏠</span> Arcade', timer = null;
  a.innerHTML = label;
  a.addEventListener('click', function (e) {
    if (a.classList.contains('ask')) return; /* second tap: follow the link */
    e.preventDefault(); a.classList.add('ask'); a.innerHTML = 'Leave game?'; a.setAttribute('aria-label', 'Tap again to leave the game and go to the Arcade');
    clearTimeout(timer); timer = setTimeout(function () { a.classList.remove('ask'); a.innerHTML = label; a.setAttribute('aria-label', 'Back to the Arcade home page'); }, 3000);
  });
  document.body.appendChild(a); document.body.classList.add('fmh-on');
})();
