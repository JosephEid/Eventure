var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Weather Forecast' });
});

/* GET event new page. */
router.get('/event_new', function(req, res, next) {
  res.render('event_new', { title: 'New event' });
});

/* GET new story page. */
router.get('/story_new', function(req, res, next) {
  res.render('story_new', { title: 'New story'});
});

/* GET event nearby page. */
router.get('/event_nearby', function(req, res, next) {
  res.render('event_nearby', { title: 'Event nearby' });
});

/* GET event page. */
router.get('/event_view/:id/:name', function(req, res, next) {
  res.render('event_view', { title: req.params.name });
});

/**
 *  POST the data about the weather.
 *  parameters in body:
 *    location: a City Id
 *    date: a date
 */
router.post('/weather_data', function(req, res, next) {
  // get random weather for a location
  const forecast= getWeatherForecast(req.body.location, req.body.date);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(forecast));

});


const CLOUDY= 0;
const CLEAR=1;
const RAINY=2;
const OVERCAST=3;
const SNOWY=4;

/**
 *
 * @param location
 * @param forecast (cloudy, etc.)
 * @param temperature
 * @param wind
 * @param precipitation
 * @param humidity
 * @constructor
 */
class WeatherForecast{
  constructor (location, date, forecast, temperature, wind, precipitations, humidity) {
    this.location= location;
    this.date= date,
        this.forecast=forecast;
    this.temperature= temperature;
    this.wind= wind;
    this.precipitations= precipitations;
    this.humidity= humidity;
  }
}

/**
 * given a city and a date, it generates random values for the forecast
 * @param location
 * @param date
 * @returns {WeatherForecast}
 */
function getWeatherForecast(location, date) {
  return new WeatherForecast(
      location,
      // date
      date,
      // forecast
      randomIntFromInterval(0, 4),
      // temp
      randomIntFromInterval(-10, 25),
      //wind
      randomIntFromInterval(0, 25),
      // precipitation
      randomIntFromInterval(0, 100),
      randomIntFromInterval(0, 100));
}


function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}


module.exports = router;
