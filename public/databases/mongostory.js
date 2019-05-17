var Story = require('../../models/story');

exports.insert = function (req, res) {
    var storyData = req.body;
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var story = new Story({
            username: storyData.username,
            date: storyData.storyDate,
            time: storyData.storyTime,
            eventId: storyData.eventId,
            caption: storyData.caption,
            photo: storyData.storyPhoto
        });
        console.log('received: ' + story);

        story.save(function (err, results) {
            //console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(storyData));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

exports.getAllMongoStories = function (req, res) {
    var eventId = req.body.id;

    try {
        Story.find({eventId: eventId},
            function (err, stories) {
                if (err)
                    res.status(500).send('Invalid data!');
                if (stories.length > 0) {
                    var newArray = {};
                    for (i = 0; i < stories.length; i++)
                        newArray[i] = JSON.stringify({username: stories[i].username, storyDate: stories[i].date, storyTime: stories[i].time,
                            eventId: stories[i].eventId, caption: stories[i].caption, storyPhoto: stories[i].photo});
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(newArray);
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}