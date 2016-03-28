// Read Synchrously
var fs = require("fs");
var filename = process.argv[2];
console.log(filename);
if (!filename) {
	console.log('Plase give the design json file.');
 	process.exit();
}
var design = JSON.parse(fs.readFileSync(filename));

// for (var i = 0; i < var item = designData.length; i++) {;
// 	var item = designData[i];
// 	if (item.Class === ROOM) {
// 		rooms[item.]
// 	}
// }
/* If the contenttype has secondory type (e.g. xxx/xxx), we leave out the secondary category. */
Object.keys(design).forEach(function(key){
	var characters = design[key].characters;
	for (var i = 0; i < characters.length; i++) {
		design[key].characters[i].contenttype = characters[i].contenttype.split('/')[0];
	}
});
fs.writeFile(filename + '.simp.json', JSON.stringify(design)); 
console.log("\n *EXIT* \n");