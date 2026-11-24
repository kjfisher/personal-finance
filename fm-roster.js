/* Future Millionaires Arcade: class roster for scenario names (first name + last initial only).
   Games call fmNames(n) to get n different random names. To change the roster each semester,
   replace the list below. Nothing is saved or sent anywhere. */
window.FM_ROSTER = [
 /* Block 1 */ "Jennifer B","Maria C","Bri C","Datkaiym E","Edwin E","Jasmine F","Michelle G","Alejandro G","Skylar L","Andy M","Ellie M","Tola M","Brandon N","Abi R","Valentina R","Angelleana S","Mason S","Sofia S","Ari V","Vivianne W","Nick W",
 /* Block 3 */ "Arsen B","Alanis B","Jimena C","Chris C","Georgi D","Erika E","Billy H","Nery H","Zach H","Russell H","Ole H","Rodrigo H","Magda K","Angel L","Nick M","Oscar M","Angelina M","Tatiana N","Kenia N","Alan O","Filip O","Lax P","Anna P","Dridri R","Jose R","Adrian S","Melissa S","Bella S","Alexis T",
 /* Block 5 */ "Nicole A","Aliyah A","Julia A","Angel C","Jayden C","Judi E","Daniel F","Abby G","Joshua H","Kaylee H","Ethan K","Ben L","Pierre M","Keisha M","Alex M","Uriel M","Bart M","Dean N","JP P","Jacqueline R","Axel R","Emily S","Deisy S","Marcello S","Alan S","Brianna S","Sihareach T","Sydney T","Abigail V",
 /* Block 7 */ "Nick C","Jodi E","Yolanda E","Angel F","Ciara G","Omar G","Axel G","Yarely G","Noah J","Nicole K","Anette K","Sawyer L","Luisa L","Erik L","Arthur M","David M","Luz P","Alex P","Sam P","Giana R","Nestor R","Max R","Kayne T","Ava T","Haile T","Anthony V","Eli W","Stepan Z","Joey E"
];
window.fmNames = function (n, fallback) {
  var r = (window.FM_ROSTER || []).slice(), out = [];
  for (var i = r.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; }
  for (var k = 0; k < n; k++) out.push(r[k] ? r[k] + '.' : (fallback && fallback[k]) || 'Student');
  return out;
};
/* fmSwapData(data, ["Jordan","Maya"]): replaces each made-up name inside every string of an object/array
   (in place) with a different random roster name. Returns the {old: new} map. */
/* Names used with he/she wording get a student with a typically matching first name (FM_F / FM_M).
   Edit these two lists if a student's name is in the wrong one. */
window.FM_F = ["Jennifer","Maria","Bri","Jasmine","Michelle","Ellie","Valentina","Angelleana","Sofia","Vivianne","Alanis","Jimena","Erika","Magda","Angelina","Tatiana","Kenia","Anna","Melissa","Bella","Nicole","Aliyah","Julia","Judi","Abby","Kaylee","Keisha","Jacqueline","Emily","Deisy","Brianna","Abigail","Jodi","Yolanda","Ciara","Yarely","Anette","Luisa","Luz","Giana","Ava"];
window.FM_M = ["Edwin","Alejandro","Andy","Brandon","Mason","Nick","Arsen","Georgi","Billy","Zach","Russell","Ole","Rodrigo","Oscar","Alan","Filip","Jose","Adrian","Daniel","Joshua","Ethan","Ben","Pierre","Uriel","Bart","Dean","Axel","Marcello","Omar","Noah","Erik","Arthur","David","Nestor","Max","Kayne","Anthony","Eli","Stepan"];
window.__fmMap = window.__fmMap || {}; window.__fmUsed = window.__fmUsed || {};
function fmTake(g) {
  var r = (window.FM_ROSTER || []).filter(function (n) { if (window.__fmUsed[n]) return false; if (!g) return true; var f = n.split(' ')[0]; return (g === 'f' ? window.FM_F : window.FM_M).indexOf(f) >= 0; });
  if (!r.length) return null;
  var n = r[Math.floor(Math.random() * r.length)]; window.__fmUsed[n] = 1; return n + '.';
}
/* fmSwapData(data, ["Jordan","Maya:f","Theo:m"]): replaces each made-up name inside every string of an
   object/array (in place) with a roster name. The same made-up name always gets the same student on a page.
   ":f" / ":m" = the text uses she/he for that person. Returns the {old: new} map. */
window.fmSwapData = function (data, olds) {
  var names = [];
  olds.forEach(function (o) { var p = o.split(':'), n = p[0], g = p[1];
    if (!window.__fmMap[n]) window.__fmMap[n] = fmTake(g) || fmTake() || n; names.push(n); });
  var map = window.__fmMap;
  var re = new RegExp('\\b(' + names.join('|') + ')\\b(?: [A-Z]\\.)?', 'g');
  function fix(s) { return s.replace(re, function (m, o) { return map[o]; }); }
  (function walk(x) {
    if (Array.isArray(x)) { for (var i = 0; i < x.length; i++) { if (typeof x[i] === 'string') x[i] = fix(x[i]); else if (x[i] && typeof x[i] === 'object') walk(x[i]); } }
    else if (x && typeof x === 'object') { for (var k in x) { if (typeof x[k] === 'string') x[k] = fix(x[k]); else if (x[k] && typeof x[k] === 'object') walk(x[k]); } }
  })(data);
  return map;
};
/* fmName("Theo") = the student standing in for "Theo" on this page (for names written in code). */
window.fmName = function (n) { return (window.__fmMap && window.__fmMap[n]) || n; };
/* fmSwapDOM(["Jada:f"]): swap made-up names in text already on the page (intro text written in the HTML). */
window.fmSwapDOM = function (olds) {
  var holder = {t: ''}, names = olds.map(function (o) { return o.split(':')[0]; });
  window.fmSwapData([], olds);
  var map = window.__fmMap, re = new RegExp('\\b(' + names.join('|') + ')\\b(?: [A-Z]\\.)?', 'g');
  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return /SCRIPT|STYLE/.test(n.parentNode.nodeName) ? 2 : 1; } }), n;
  while ((n = w.nextNode())) if (re.test(n.nodeValue)) { re.lastIndex = 0; n.nodeValue = n.nodeValue.replace(re, function (m, o) { return map[o]; }); }
};
