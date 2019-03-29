var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/list_users', function(req, res, next) {
  res.render('list_users', { title: 'Users' });
  //res.send('respond with a resource');
});

router.get('/new_user', function(req, res, next) {
  res.render('new_user', {title: 'New User'});
});

/**
 *  POST the data about the user.
 */
router.post('/post_user', function(req, res, next) {
  var eventData = req.body;
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(eventData));
});

/* GET user page. */
router.get('/view_user/:id/:name', function(req, res, next) {
  res.render('view_user', { title: req.params.name });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Eventure'});
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Eventure'});
});

module.exports = router;
