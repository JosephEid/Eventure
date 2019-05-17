var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Define story schema
var Story = new Schema(
    {
        username: {type: String, required: true},
        date: {type: String, required: true},
        time: {type: String, required: true},
        eventId: {type: Number, required: true},
        caption: {type: String, max: 100},
        photo: {type: String}
    }
);

Story.set('toObject', {getters: true, virtuals: true});

var storyModel = mongoose.model('Story', Story);

module.exports = storyModel;