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

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Eventure'});
});

/* GET view event page. */
router.get('/view_event', function(req, res, next) {
  res.render('view_event', { title: 'Eventure'});
});

module.exports = router;
