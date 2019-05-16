var Event = require('../models/event');


exports.insert = function (req, res) {
    var eventData = req.body;
    if (eventData == null) {
        // return res.status(403).send('No data sent!');
    }
    try {
        var event = new Event({
            event_name: eventData.eventName,
            description: eventData.eventDescription,
            address_1: eventData.line1,
            address_2: eventData.line2,
            postcode: eventData.postalCode,
            city: eventData.city,
            town: eventData.town,
            country: eventData.country,
            date: eventData.eventDate,
            photo: eventData.eventPhoto
        });
        console.log('received: ' + event);

        event.save(function (err, results) {
            if (err) {
                // return res.status(500).send('Invalid data!');

            }
            res.setHeader('Content-Type', 'application/json');
            return res.send(JSON.stringify(eventData));
        });
    } catch (e) {
        // return res.status(500).send('error ' + e);
    }
}