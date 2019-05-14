var express = require('express');
var router = express.Router();

/* GET events listing. */
router.get('/list_events', function(req, res, next) {
  res.render('list_events', { title: 'Events' });
  //res.send('respond with a resource');
});

router.get('/new_event', function(req, res, next) {
  res.render('new_event', { title: 'New Event' });
});

/**
 *  POST the data about the event.
 *  Event data is received from and ajax request and passed straight back as a response.
 */
router.post('/post_event', function(req, res, next) {
    var eventData = req.body;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(eventData));
});

/* GET events nearby page. */
router.get('/list_nearby_events', function(req, res, next) {
  res.render('list_nearby_events', { title: 'Events Nearby' });
});

/* GET view event page. */
router.get('/view_event/:id', function(req, res, next) {
    console.log("here")
    res.render('view_event', { id: req.params.id});
});

module.exports = router;