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
router.post('/new_user', function(req, res, next) {
  const user = getUser(req.body.name);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(user));
});

/* GET user page. */
router.get('/view_user/:id/:name', function(req, res, next) {
  res.render('view_user', { title: req.params.name });
});

module.exports = router;
