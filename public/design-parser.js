// Read Synchrously
 var fs = require("fs");
 var filename = process.argv[2];
 if (!filename) {
 	console.log('Plase give the design json file.');
 	process.exit();
 	return;
 }
 var content = fs.readFileSync(filename);
 console.log("Output Content : \n"+ content);
 console.log("\n *EXIT* \n");