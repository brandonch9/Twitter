var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/users/:id', function(req, res) {
// 	// res.render('index', {
// 	// 	title: 'Draymond Green',
// 	// 	height: "6' 7.5\"",
// 	// 	weight: '236',
// 	// 	wingspan: "7' 1.25\""
// 	// });
// 	console.log(req.params);
// 	res.send(req.params, 200);
// });

module.exports = router;
