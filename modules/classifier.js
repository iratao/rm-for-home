var dclassify = require('./dclassify');

module.exports = function() {
	var Classifier = dclassify.Classifier;
    var DataSet    = dclassify.DataSet;
    var Document   = dclassify.Document;
	
	var options = {
        applyInverse: false
    };

    // create a classifier
    var classifier = new Classifier(options);

    /* datas format:
    {
	    id: {
	        category: 'livingroom',
	        id: 'xxx', // some unique identifier
	        characters: [{id: seekid, contenttype: 'c1'}, {id: seekid, contenttype: 'c2'}, {id: seekid, contenttype: 'c3'}, ...]
	    }
    }
    */
    var train = function(datas) {
    	var dataset = new DataSet();
    	Object.keys(datas).forEach(function(key) {
    		var data = datas[key];
    		var characters = [];
    		for (var i = 0; i < data.characters.length; i++) {
    			// if (characters.indexOf(data.characters[i].contenttype) === -1) {
    				characters.push(data.characters[i].contenttype);
    			// }
    		}
    		var item = new Document(data.id, characters);
    		if (data.category === 'MasterBedroom' || data.category === 'SecondBedroom') {
    			data.category = 'Bedroom';
    		}
    		dataset.add(data.category, item);
    		
    	});
    	console.log('before train');
    	classifier.train(dataset);
    	console.log('after train');
    };

    var trainresult = function() {
    	console.log(JSON.stringify(classifier.probabilities, null, 4));
    };

    /* data format:
    {
        {
	        id: 'xxx', // some unique identifier
	        characters: [{id: seekid, contenttype: 'c1'}, {id: seekid, contenttype: 'c2'}, {id: seekid, contenttype: 'c3'}, ...]
        }
    }
    */
    var classify = function(datas) {
    	console.log('in classify');
    	Object.keys(datas).forEach(function(key) {
    		var data = datas[key];
    		var characters = [];
    		for (var i = 0; i < data.characters.length; i++) {
    			// if (characters.indexOf(data.characters[i].contenttype) === -1) {
    				characters.push(data.characters[i].contenttype);
    			// }
    		}
    		var item = new Document(data.id, characters);
	    	var result = classifier.classify(item);
	    	console.log('expected result: ' + data.category);
	    	console.log(result);
    	});
    };

	var trainexample = function() {
		console.log('training now');
	    // living room
	    var item1 = new Document('item1', ['sofa','tv','plant']);
	    var item2 = new Document('item2', ['tv','chair','tvbench']);
	    var item3 = new Document('item3', ['sofa','teapoy','capet']);

	    // bedroom
	    var item4 = new Document('item4', ['sofa','tv','bed']);
	    var item5 = new Document('item5', ['tv','chair','bed', 'wardrobe']);
	    var item6 = new Document('item6', ['bed','wardrobe','desk']);

	    // dining room
	    var item7 = new Document('item7', ['diningtable','tv','chair', 'fridge']);
	    var item8 = new Document('item8', ['tv','chair','diningtable', 'wardrobe']);
	    var item9 = new Document('item9', ['buffet','diningtable','chair', 'sofa']);

	    var data = new DataSet();
	    data.add('livingroom',  [item1, item2, item3]);   
	    // classifier.train(data);
	    
	    // data = new DataSet();
	    data.add('bedroom', [item4, item5, item6]);
	    // classifier.train(data);
	    
	    // data = new DataSet();
	    data.add('diningroom', [item7, item8, item9 ]);
	    classifier.train(data);

	    // train the classifier
	    
	    console.log('Classifier trained.');
	    console.log(JSON.stringify(classifier.probabilities, null, 4));
	};

	var classifyexample = function() {
		console.log('classifying now');
		// test the classifier on a new test item
	    var testDoc = new Document('testDoc', ['sofa','tv', 'chair']);    
	    var result1 = classifier.classify(testDoc);
	    console.log(result1);
	};

	return {
		train,
		classify,
		trainresult,
		trainexample,
		classifyexample,
	}
}