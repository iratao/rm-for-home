from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import codecs
import json
import sys
import pdb
import os
import numpy
import logging

import tensorflow as tf

reload(sys) 
sys.setdefaultencoding('utf-8')

sess = tf.InteractiveSession()

with codecs.open('metadata.json', encoding='UTF-8') as data_file:    
    jsondata = json.load(data_file)

contenttypes = jsondata["contenttypes"];
contentTypeNum = len(contenttypes);
roomtypes = jsondata["roomtypes"];
roomTypeNum = len(roomtypes);
trainingDataDir = '../designjsons'
trainingDataFiles = [item for item in os.listdir(trainingDataDir) if os.path.isfile(os.path.join(trainingDataDir, item))]
trainingDataCount = len(trainingDataFiles);
logger = logging.getLogger()
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
testDataDir = '../validators'

def read_test_sets(contentTypeNum, roomTypeNum):
	trainingdata = numpy.zeros((0, contentTypeNum))
	labels = numpy.zeros((0, roomTypeNum))

	with codecs.open(os.path.join(testDataDir, 'olddesign5.json'), encoding='UTF-8') as designfile:
		designjson = json.load(designfile)

	countIndex = 0
	if countIndex == (len(labels)):
		logging.debug('extend labels and trainingdata')
		rownum = len(designjson)
		row = numpy.zeros((rownum, roomTypeNum))
		labels = numpy.vstack((labels, row))
		row = numpy.zeros((rownum, contentTypeNum))
		trainingdata = numpy.vstack((trainingdata, row))

	for roomid in designjson:
		room = designjson[roomid]
		category = room['category']
		characters = room['characters']

		# init labels
		for idx, val in enumerate(roomtypes):
			if val['name'] == category:
				logging.debug('idx = %d, countIndex = %d', idx, countIndex)
				labels[countIndex][idx] = 1
				break
		# init trainingdata
		for character in characters:
			for idx, contenttype in enumerate(contenttypes):
				if character['contenttype'] == contenttype['name']:
					logging.debug('characters: idx = %d, countIndex = %d', idx, countIndex)
					trainingdata[countIndex][idx] = 1
					break
		countIndex += 1

	return trainingdata, labels


def read_training_sets(contentTypeNum, roomTypeNum):
	trainingdata = numpy.zeros((0, contentTypeNum))
	labels = numpy.zeros((0, roomTypeNum))
	countIndex = 0
	for filename in trainingDataFiles:
		if filename == '.DS_Store':
			continue


		with codecs.open(os.path.join(trainingDataDir, filename), encoding='UTF-8') as designfile:
			designjson = json.load(designfile)

		if countIndex == (len(labels)):
			logging.debug('extend labels and trainingdata')
			rownum = len(designjson)
			row = numpy.zeros((rownum, roomTypeNum))
			labels = numpy.vstack((labels, row))
			row = numpy.zeros((rownum, contentTypeNum))
			trainingdata = numpy.vstack((trainingdata, row))
		
		for roomid in designjson:
			room = designjson[roomid]
			category = room['category']
			characters = room['characters']
			# init labels
			for idx, val in enumerate(roomtypes):
				if val['name'] == category:
					logging.debug('idx = %d, countIndex = %d', idx, countIndex)
					labels[countIndex][idx] = 1
					break
			# init trainingdata
			for character in characters:
				for idx, contenttype in enumerate(contenttypes):
					if character['contenttype'] == contenttype['name']:
						logging.debug('contenttype idx = %d, countIndex = %d', idx, countIndex)
						trainingdata[countIndex][idx] = 1
						break
			countIndex += 1
	return trainingdata, labels

# batch_xs: n by m matrix, with n(row) = the number of training exmaples and m = the number of content types
# batch_ys: n by m matrix, with n(row) = the number of training examples and m = the number of classifications (the number of room types)
batch_xs, batch_ys = read_training_sets(contentTypeNum, roomTypeNum)
pdb.set_trace()

x = tf.placeholder(tf.float32, [None, contentTypeNum])
pdb.set_trace()
W = tf.Variable(tf.zeros([contentTypeNum, roomTypeNum]))
b = tf.Variable(tf.zeros([roomTypeNum]))
y = tf.nn.softmax(tf.matmul(x, W) + b)

# Define loss and optimizer
y_ = tf.placeholder(tf.float32, [None, roomTypeNum])
cross_entropy = -tf.reduce_sum(y_ * tf.log(y))
train_step = tf.train.GradientDescentOptimizer(0.01).minimize(cross_entropy)

tf.initialize_all_variables().run()
for i in range(1000):
	# batch_xs, batch_ys = dataset.train
	train_step.run({x: batch_xs, y_: batch_ys})

correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(y_, 1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
testdata, testlabel = read_test_sets(contentTypeNum, roomTypeNum)
print('accuracy: ')
print(sess.run(accuracy, feed_dict={x: testdata, y_: testlabel}))
# print(accuracy.eval({x: testdata, y_: testlabel}))
