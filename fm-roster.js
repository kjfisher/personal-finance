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
