/* Future Millionaires Arcade: in-game calculator (compound interest + basic).
   Add to a game with: <script src="/fm-calc.js" defer></script>
   Nothing is saved or sent anywhere. */
(function () {
  if (window.__fmCalc) return; window.__fmCalc = true;
  var css = `
.fmc-btn{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));z-index:9998;
  font:700 16px "Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif;padding:12px 18px;border-radius:999px;border:2px solid #E0A800;
  background:#14213D;color:#F3F5F8;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer;display:flex;gap:8px;align-items:center}
.fmc-btn:focus-visible{outline:3px solid #E0A800;outline-offset:3px}
.fmc{--b:#FFFFFF;--i:#14213D;--m:#5B6780;--l:#CBD3DF;--s:#EEF1F5;--g:#E0A800;--ok:#0F8B6C;--h:#14213D;--hi:#F3F5F8;
  position:fixed;z-index:9999;right:max(14px,env(safe-area-inset-right,0px));bottom:max(76px,calc(env(safe-area-inset-bottom,0px) + 76px));
  width:min(400px,calc(100vw - 28px));max-height:min(78vh,700px);display:flex;flex-direction:column;background:var(--b);color:var(--i);
  border:1px solid var(--l);border-radius:18px;box-shadow:0 18px 48px rgba(0,0,0,.3);font:16px "Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif;overflow:hidden}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .fmc{--b:#16203A;--i:#E8EDF5;--m:#93A0B8;--l:#2A3A5E;--s:#0D1424;--g:#F5C542;--ok:#3CCB9F;--h:#101A30}}
:root[data-theme="dark"] .fmc{--b:#16203A;--i:#E8EDF5;--m:#93A0B8;--l:#2A3A5E;--s:#0D1424;--g:#F5C542;--ok:#3CCB9F;--h:#101A30}
.fmc[hidden]{display:none!important}
.fmc *{box-sizing:border-box}
.fmc-hd{background:var(--h);color:var(--hi);padding:10px 12px 0;display:grid;gap:8px}
.fmc-top{display:flex;justify-content:space-between;align-items:center;gap:8px}
.fmc-top b{font:800 19px "Bricolage Grotesque","Arial Black",system-ui,sans-serif}
.fmc-x{font:inherit;font-size:22px;line-height:1;background:none;border:0;color:var(--hi);cursor:pointer;padding:4px 8px;border-radius:8px}
.fmc-tabs{display:flex;gap:4px}
.fmc-tab{font:inherit;font-weight:700;font-size:15px;padding:8px 14px;border:0;border-radius:10px 10px 0 0;background:transparent;color:var(--hi);opacity:.75;cursor:pointer}
.fmc-tab[aria-selected="true"]{background:var(--b);color:var(--i);opacity:1}
.fmc-body{padding:12px;overflow:auto;display:grid;gap:10px}
.fmc-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fmc label{display:grid;gap:3px;font-weight:700;font-size:14px}
.fmc input,.fmc select{font:600 17px "IBM Plex Mono",ui-monospace,Menlo,monospace;padding:8px 10px;border-radius:10px;border:2px solid var(--l);background:var(--s);color:var(--i);width:100%}
.fmc input:focus-visible,.fmc select:focus-visible,.fmc button:focus-visible{outline:3px solid var(--g);outline-offset:2px}
.fmc-res{background:var(--s);border-radius:12px;padding:10px 12px;display:grid;gap:4px}
.fmc-row{display:flex;justify-content:space-between;gap:10px;font-size:15px}
.fmc-row b{font:600 16px "IBM Plex Mono",ui-monospace,Menlo,monospace;font-variant-numeric:tabular-nums}
.fmc-row.fmc-big b{font-size:21px;color:var(--ok)}
.fmc-note{font-size:13px;color:var(--m);line-height:1.4;margin:0}
.fmc details summary{cursor:pointer;font-weight:700;font-size:14px}
.fmc table{width:100%;border-collapse:collapse;font:500 13px "IBM Plex Mono",ui-monospace,Menlo,monospace;margin-top:6px}
.fmc td,.fmc th{padding:3px 6px;border-bottom:1px solid var(--l);text-align:right}
.fmc th:first-child,.fmc td:first-child{text-align:left}
.fmc-disp{font:600 26px "IBM Plex Mono",ui-monospace,Menlo,monospace;text-align:right;background:var(--s);border-radius:12px;padding:10px 12px;min-height:56px;overflow-wrap:anywhere}
.fmc-disp small{display:block;font-size:13px;color:var(--m);min-height:16px}
.fmc-keys{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.fmc-k{font:700 20px "IBM Plex Mono",ui-monospace,Menlo,monospace;padding:12px 0;border-radius:12px;border:1px solid var(--l);background:var(--s);color:var(--i);cursor:pointer}
.fmc-k.op{background:var(--h);color:var(--hi)}
.fmc-k.eq{background:var(--g);color:#14213D;border-color:var(--g)}
.fmc-ft{padding:8px 12px 12px;border-top:1px solid var(--l);font-size:13px;color:var(--m)}
.fmc-ft a{color:inherit;font-weight:700}
body.fmc-pad{padding-bottom:84px}
`;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var money = function (n) { return (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var r2 = function (n) { return Math.round((n + Number.EPSILON) * 100) / 100; };
  var num = function (s) { var v = parseFloat(String(s).replace(/[$,%\s]/g, '')); return isNaN(v) ? 0 : v; };

  var btn = document.createElement('button');
  btn.className = 'fmc-btn'; btn.type = 'button'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'fmc');
  btn.innerHTML = '<span aria-hidden="true">🧮</span> Calculator';
  var p = document.createElement('div');
  p.className = 'fmc'; p.id = 'fmc'; p.hidden = true; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Calculator');
  p.innerHTML = `
<div class="fmc-hd"><div class="fmc-top"><b>Calculator</b><button class="fmc-x" type="button" aria-label="Close calculator">×</button></div>
 <div class="fmc-tabs" role="tablist"><button class="fmc-tab" role="tab" aria-selected="true" data-t="c">Compound interest</button><button class="fmc-tab" role="tab" aria-selected="false" data-t="b">Basic</button></div></div>
<div class="fmc-body" data-p="c">
 <div class="fmc-grid">
  <label>Starting amount ($)<input id="fmc-P" inputmode="decimal" value="1000" autocomplete="off"></label>
  <label>Interest rate (% a year)<input id="fmc-r" inputmode="decimal" value="8" autocomplete="off"></label>
  <label>Years<input id="fmc-t" inputmode="decimal" value="10" autocomplete="off"></label>
  <label>Compounded<select id="fmc-n"><option value="1">Once a year</option><option value="12">Monthly</option></select></label>
  <label style="grid-column:1/-1">Add each month ($, optional)<input id="fmc-d" inputmode="decimal" value="0" autocomplete="off"></label>
 </div>
 <div class="fmc-res" aria-live="polite" id="fmc-out"></div>
 <details><summary>Show each year</summary><div id="fmc-tbl"></div></details>
 <p class="fmc-note">Owe money? Use the APR as the rate to see debt grow. Rule of 72 questions: estimate first, then check here.</p>
</div>
<div class="fmc-body" data-p="b" hidden>
 <div class="fmc-disp" id="fmc-disp" aria-live="polite"><small id="fmc-exp"></small><span id="fmc-val">0</span></div>
 <div class="fmc-keys" id="fmc-keys"></div>
</div>
<div class="fmc-ft">Check your work with the official SEC calculator: <a href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" target="_blank" rel="noopener">investor.gov ↗</a></div>`;
  document.body.appendChild(btn); document.body.appendChild(p); document.body.classList.add('fmc-pad');
  var q = function (s) { return p.querySelector(s); };

  function open(on) {
    p.hidden = !on; btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    btn.innerHTML = on ? '<span aria-hidden="true">✕</span> Close' : '<span aria-hidden="true">🧮</span> Calculator';
    if (on) { var f = p.querySelector('.fmc-body:not([hidden]) input, .fmc-body:not([hidden]) .fmc-k'); f && f.focus(); } else btn.focus();
  }
  btn.onclick = function () { open(p.hidden); };
  q('.fmc-x').onclick = function () { open(false); };
  p.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Escape') open(false); });
  p.addEventListener('keyup', function (e) { e.stopPropagation(); });
  p.addEventListener('keypress', function (e) { e.stopPropagation(); });
  p.querySelectorAll('.fmc-tab').forEach(function (t) {
    t.onclick = function () {
      p.querySelectorAll('.fmc-tab').forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
      p.querySelectorAll('.fmc-body').forEach(function (b) { b.hidden = b.dataset.p !== t.dataset.t; });
    };
  });

  /* Compound interest */
  function calc() {
    var P = num(q('#fmc-P').value), r = num(q('#fmc-r').value) / 100, t = Math.max(0, Math.min(100, num(q('#fmc-t').value))),
        n = +q('#fmc-n').value, d = num(q('#fmc-d').value);
    var yrs = Math.floor(t), rows = [], B = P, put = P;
    if (n === 1) {
      /* Class method: find each year's interest on the new balance, round to the cent; deposits added at the end of each year. */
      for (var y = 1; y <= yrs; y++) { var I = r2(B * r); B = r2(B + I + 12 * d); put += 12 * d; rows.push([y, I, B]); }
      if (t > yrs) { var part = t - yrs, I2 = r2(B * r * part); B = r2(B + I2 + 12 * d * part); put += 12 * d * part; rows.push([t, I2, B]); }
      var Bround = B;
      /* Formula answer, A = P(1 + r)^t, rounded only at the end. */
      if (d === 0) B = r2(P * Math.pow(1 + r, t));
      var roundNote = (d === 0 && Bround !== B) ? Bround : null;
    } else {
      var i = r / 12, m = Math.round(t * 12), prev = P;
      for (var k = 1; k <= m; k++) { B = B * (1 + i) + d; put += d; if (k % 12 === 0 || k === m) { rows.push([+(k / 12).toFixed(2), B - prev - (k % 12 === 0 ? 12 : k % 12) * d, B]); prev = B; } }
      B = r2(B);
    }
    var grow = B - put, simple = P * (1 + r * t);
    var h = '<div class="fmc-row fmc-big"><span>Ending balance</span><b>' + money(B) + '</b></div>' +
      '<div class="fmc-row"><span>You put in</span><b>' + money(r2(put)) + '</b></div>' +
      '<div class="fmc-row"><span>Interest (growth)</span><b>' + money(r2(grow)) + '</b></div>';
    if (n === 1 && roundNote !== null) h += '<p class="fmc-note">Rounding to the cent each year (like the table below) gives ' + money(roundNote) + '. Use that one when a question says to round each year.</p>';
    if (d === 0) h += '<div class="fmc-row"><span>Simple interest instead</span><b>' + money(r2(simple)) + '</b></div>';
    if (r > 0) h += '<div class="fmc-row"><span>Rule of 72: doubles about every</span><b>' + +(72 / (r * 100)).toFixed(1) + ' yrs</b></div>';
    if (put > 0 && d > 0) h += '<p class="fmc-note">' + Math.round(put / B * 100) + '% of the ending balance came from your deposits; ' + (100 - Math.round(put / B * 100)) + '% is growth.</p>';
    q('#fmc-out').innerHTML = h;
    q('#fmc-tbl').innerHTML = rows.length ? '<table><thead><tr><th>Year</th><th>Interest</th><th>Balance</th></tr></thead><tbody>' +
      rows.slice(0, 100).map(function (x) { return '<tr><td>' + x[0] + '</td><td>' + money(r2(x[1])) + '</td><td>' + money(r2(x[2])) + '</td></tr>'; }).join('') + '</tbody></table>' : '';
  }
  ['#fmc-P', '#fmc-r', '#fmc-t', '#fmc-n', '#fmc-d'].forEach(function (s) { q(s).addEventListener('input', calc); q(s).addEventListener('change', calc); });
  calc();

  /* Basic calculator (no eval) */
  var expr = '', just = false;
  var KEYS = [['C', 'fn'], ['⌫', 'fn'], ['%', 'fn'], ['÷', 'op'], ['7'], ['8'], ['9'], ['×', 'op'], ['4'], ['5'], ['6'], ['−', 'op'], ['1'], ['2'], ['3'], ['+', 'op'], ['0'], ['.'], ['( )', 'fn'], ['=', 'eq']];
  q('#fmc-keys').innerHTML = KEYS.map(function (k) { return '<button type="button" class="fmc-k ' + (k[1] || '') + '" data-k="' + k[0] + '">' + k[0] + '</button>'; }).join('');
  function evaluate(s) {
    var toks = s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').match(/\d*\.?\d+%?|[-+*/()]/g) || [], pos = 0;
    function peek() { return toks[pos]; } function next() { return toks[pos++]; }
    function factor() { var t = next(); if (t === '-') return -factor(); if (t === '+') return factor();
      if (t === '(') { var v = expr0(); if (peek() === ')') next(); return v; }
      if (t === undefined) throw 0; return t.slice(-1) === '%' ? parseFloat(t) / 100 : parseFloat(t); }
    function term() { var v = factor(); while (peek() === '*' || peek() === '/') { var o = next(), w = factor(); v = o === '*' ? v * w : v / w; } return v; }
    function expr0() { var v = term(); while (peek() === '+' || peek() === '-') { var o = next(), w = term(); v = o === '+' ? v + w : v - w; } return v; }
    var v = expr0(); if (pos < toks.length || !isFinite(v)) throw 0; return v;
  }
  function show(val, sub) { q('#fmc-val').textContent = val || '0'; q('#fmc-exp').textContent = sub || ''; }
  function press(k) {
    if (k === 'C') { expr = ''; just = false; return show('0', ''); }
    if (k === '⌫') { expr = expr.slice(0, -1); return show(expr, ''); }
    if (k === '=') {
      try { var v = evaluate(expr); var out = String(+v.toFixed(10)); show(Number(out).toLocaleString('en-US', { maximumFractionDigits: 10 }), expr + ' ='); expr = out; just = true; }
      catch (e) { show('Check your math', expr); }
      return;
    }
    if (k === '( )') { var o = (expr.match(/\(/g) || []).length, c = (expr.match(/\)/g) || []).length; k = (o > c && /[\d)%]$/.test(expr)) ? ')' : '('; }
    if (just && /[\d.(]/.test(k)) expr = '';
    just = false; expr += k; show(expr, '');
  }
  q('#fmc-keys').addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); b && press(b.dataset.k); });
  p.addEventListener('keydown', function (e) {
    if (q('[data-p="b"]').hidden || /INPUT|SELECT/.test(e.target.tagName)) return;
    var map = { '*': '×', '/': '÷', '-': '−', 'Enter': '=', 'Backspace': '⌫', 'Escape': null, 'Delete': 'C' }, k = e.key in map ? map[e.key] : e.key;
    if (k && /^[\d.+%()×÷−=⌫C]$/.test(k)) { e.preventDefault(); press(k); }
  });
})();
