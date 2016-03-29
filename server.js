var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var http        = require('http');
var async       = require('async');
var classifer   = require('./modules/classifier.js');
var fs          = require("fs");


var path = __dirname + '/views/';


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

var port = process.env.PORT || 8888;        // set our port

var router = express.Router();

var shejiji_api_url = '3d.shejijia.com'

// more routes for our API will happen here

router.get('/api', function(req, res){
	res.send(' This is a test ');
});

router.route('/api/product/:seek_id')
	.get(function(req, res){
		var seekid = req.params.seek_id;

		var options = {
			host: '3d.shejijia.com',
			port: 80,
			path: '/api/rest/v2.0/product/' + seekid + '?l=zh_CN&t=ezhome&branch=',
			method: 'GET'
		};

		var mydata = undefined;

	    async.series([ function(callback) {
			http.request(options, function(res) {
			  console.log('STATUS: ' + res.statusCode);
			  console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.setEncoding('utf8');
			  var bmpString = "";
			  res.on('data', function (chunk) {
			    bmpString += chunk;
			  });
			  res.on('end', function() {
			  	console.log("************** want to call callback *************");
			  	callback(false, bmpString);
			  })
			}).end();
	    }],
	    function(err, results) {
	        // correctly gets invoked after async call completes
	        // but res.json isn't sending anything to the client
	        console.log("************** callback called *************");
	        res.send(results).end();
	    }) 
	});

router.route('/api/classify')
    .post(function(req, res) {
    	var data = req.body;
    	console.log(data);
    	var rooms = {}
    	var now = Date.now();
    	rooms[now] = {category: '', id: now, characters: []};
    	var items = data.items;
    	for (var i = 0; i < items.length; i++) {
    		var item = items[i];
    		rooms[now].characters.push({id: item.id, contenttype: item.contentType});
    	}

    	var promise = new Promise(function(resolve, reject) {
			myClassifer.classify(rooms, function(result) {
				if (result) {
					resolve(result);
				} else {
					reject('No result returned.');
				}
			});
		});

		promise.then(function(value) {
			// success
			res.setHeader('Content-Type', 'application/json');
	    	res.send(JSON.stringify(value));
		}).catch(function(error) {
			// error
			console.log(error);
		});

    	
    });


var myClassifer = classifer();
// myClassifer.trainexample();
// myClassifer.classifyexample();

var designdir = './designjsons/';
var trainers = fs.readdirSync(designdir);
for (var i in trainers) {
	if (trainers[i] === '.DS_Store') {continue;}
	var design = JSON.parse(fs.readFileSync(designdir + trainers[i]));
	myClassifer.train(design);
}

// myClassifer.trainresult();



// var tester = JSON.parse(fs.readFileSync('./validators/olddesign5.json'));
// myClassifer.classify(tester);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

app.listen(port);
console.log('Magic happens on port ' + port);