var express = require('express');
var router = express.Router();

/* GET stories listing. */
router.get('/list_stories', function(req, res, next) {
    res.render('list_stories', { title: 'Stories' });
    //res.send('respond with a resource');
});

/**
 *  POST the data about the story.
 */
router.post('/new_story', function(req, res, next) {
    const story = getStory(req.body.name);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(story));

});

/* GET story page. */
router.get('/view_story/:id/:name', function(req, res, next) {
    res.render('view_story', { title: req.params.name });
});

module.exports = router;