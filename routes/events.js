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
 */
router.post('/post_event', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(eventData));
});

/* GET events nearby page. */
router.get('/list_nearby_events', function(req, res, next) {
  res.render('list_nearby_events', { title: 'Events Nearby' });
});

/* GET event page. */
router.get('/view_event/:id/:name', function(req, res, next) {
  res.render('view_event', { title: req.params.name });
});

module.exports = router;