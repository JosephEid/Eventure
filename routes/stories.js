var express = require('express');
var router = express.Router();

var story = require('../public/databases/mongostory');

/* GET stories listing. */
router.post('/list_stories', story.getAllMongoStories);

router.get('/new_story/:id', function(req, res, next) {
  //var username = window.username;
  //console.log(window.username);
  res.render('new_story', {id: req.params.id/*, username: username*/});
});

/**
 *  POST the data about the story.
 *  Story data is received from and ajax request and passed straight back as a response.
 */
router.post('/post_story', story.insert);

/* GET story page. */
router.get('/view_story/:id', function(req, res, next) {
  res.render('view_story', { title: req.params.name });
});

module.exports = router;