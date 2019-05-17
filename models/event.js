var mongoose = require('mongoose');


var Schema = mongoose.Schema;

//Define event schema
var Event = new Schema(
    {
        event_name: {type: String, required: true, max: 100},
        description: {type: String, required: true, max: 100},
        address_1: {type: String, required: true},
        address_2: {type: String},
        postcode: {type: String, required: true}, //Validate?
        city: {type: String},
        date: {type: Date, required: true},
        photo: {type: String}
    }
);

Event.set('toObject', {getters: true, virtuals: true});

var eventModel = mongoose.model('Event', Event);

module.exports = eventModel;