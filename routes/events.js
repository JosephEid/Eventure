var express = require('express');
var router = express.Router();

/* GET events listing. */
router.get('/list_events', function(req, res, next) {
    res.render('list_events', { title: 'Events' });
    //res.send('respond with a resource');
});

/**
 *  POST the data about the event.
 */
router.post('/new_event', function(req, res, next) {
    const event = getEvent(req.body.name);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(event));

});

/* GET events nearby page. */
router.get('/list_nearby_events', function(req, res, next) {
    res.render('list_nearby_events', { title: 'Events nearby' });
});

/* GET event page. */
router.get('/view_event/:id/:name', function(req, res, next) {
    res.render('view_event', { title: req.params.name });
});

module.exports = router;