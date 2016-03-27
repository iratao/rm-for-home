var dclassify = require('dclassify');

module.exports = function() {
	var Classifier = dclassify.Classifier;
    var DataSet    = dclassify.DataSet;
    var Document   = dclassify.Document;
	
	var options = {
        applyInverse: true
    };

    // create a classifier
    var classifier = new Classifier(options);

    /* datas format:
    {
	    {
	        category: 'livingroom',
	        id: 'xxx', // some unique identifier
	        characters: ['c1', 'c2', 'c3', ...]
	    }
    }
    */
    var train = function(datas) {
    	var dataset = new DataSet();
    	for (var i = 0; i < datas.length; i++) {
    		var data = datas[i];
    		var item = new Document(data.id, data.characters);
	    	dataset.add(data.category, data.characters);
    	}
    	classifier.train(data);
    };

    /* data format:
    {
        id: 'xxx', // some unique identifier
        characters: ['c1', 'c2', 'c3', ...]
    }
    */
    var classify = function(data) {
    	var item = new Document(data.id, data.characters);
    	var result = classifier.classify(item);
    	console.log(result);
    }

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
	    data.add('bedroom', [item4, item5, item6]);
	    data.add('diningroom', [item7, item8, item9 ]);

	    // train the classifier
	    classifier.train(data);
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
	}
}