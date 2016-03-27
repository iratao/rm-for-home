// Read Synchrously
var fs = require("fs");
var filename = process.argv[2];
if (!filename) {
	console.log('Plase give the design json file.');
 	process.exit();
}
var design = JSON.parse(fs.readFileSync(filename));
if (!design.hasOwnProperty('data')) {
	console.log('File format is not correct.')
	process.exit();
}

const ROOM = 'hsw.model.Room';

var designData = design.data;
var output = {};
var rooms = {}; // {type:id}

// for (var i = 0; i < var item = designData.length; i++) {;
// 	var item = designData[i];
// 	if (item.Class === ROOM) {
// 		rooms[item.]
// 	}
// }
console.log("Output Content : \n"+ content);
console.log("\n *EXIT* \n");