var Story = require('../models/story');

exports.insert = function (req, res) {
    var storyData = req.body;
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var story = new Story({
            date: storyData.storyDate,
            time: storyData.storyTime,
            eventId: storyData.eventId,
            caption: storyData.caption,
            photo: storyData.eventPhoto
        });
        console.log('received: ' + story);

        story.save(function (err, results) {
            console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(storyData));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}