var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Eventure' });
});

/* GET maps page. */
router.get('/map', function(req, res, next) {
  res.render('map', { title: 'Eventure'});
});

module.exports = router;
