var Event = require('../../models/event');

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
            date: eventData.eventDate,
            photo: eventData.eventPhoto
        });
        console.log('received: ' + event);

        event.save(function (err, results) {
            //console.log(results._id);
            if (err) {
                console.log("error THROWN" + err)
                res.status(500).send('Invalid data!' + err);

            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(eventData));
        });
    } catch (e) {
        // return res.status(500).send('error ' + e);
    }
}