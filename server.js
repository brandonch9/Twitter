var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tweets');

var Schema = mongoose.Schema;

var TweetSchema = new Schema({
	author: String,
	status: String
});

mongoose.model('Tweet', TweetSchema);

var Tweet = mongoose.model('Tweet');

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// ROUTES

app.get('/tweets', function(req, res) {
	Tweet.find(function(err, docs) {
		docs.forEach(function(item) {
			console.log("Received a GET request for _id: " + item._id);
		})
		res.send(docs);
	});
});

app.post('/tweets', function(req, res){
	console.log('Received a POST request:')
	for (var key in req.body){
		console.log(key + ': ' + req.body[key]);
	}
	var tweet = new Tweet(req.body);
	tweet.save(function(err, doc){
		res.send(doc);
	});	
});

app.delete('/tweets/:id', function(req, res){
	console.log('Received a DELETE request for _id: ' + req.params.id);
	Tweet.remove({_id: req.params.id}, function(err, doc){
		res.send({_id: req.params.id});
	});
});

app.put('/tweets/:id', function(req, res){
	console.log('Received an UPDATE requests for _id: ' + req.params.id);
	Tweet.update({_id: req.params.id}, req.body, function(err){
		res.send({_id: req.params.id});
	});
});

var port = 3000;
app.listen(port);
console.log('server on ' + port);