var CLEAR_DAY = 0;
var CLEAR_NIGHT = 1;
var WINDY = 2;
var COLD = 3;
var PARTLY_CLOUDY_DAY = 4;
var PARTLY_CLOUDY_NIGHT = 5;
var HAZE = 6;
var CLOUD = 7;
var RAIN = 8;
var SNOW = 9;
var HAIL = 10;
var CLOUDY = 11;
var STORM = 12;
var NA = 13;

/*var imageId = {
  0 : STORM, //tornado
  1 : STORM, //tropical storm
  2 : STORM, //hurricane
  3 : STORM, //severe thunderstorms
  4 : STORM, //thunderstorms
  5 : HAIL, //mixed rain and snow
  6 : HAIL, //mixed rain and sleet
  7 : HAIL, //mixed snow and sleet
  8 : HAIL, //freezing drizzle
  9 : RAIN, //drizzle
  10 : HAIL, //freezing rain
  11 : RAIN, //showers
  12 : RAIN, //showers
  13 : SNOW, //snow flurries
  14 : SNOW, //light snow showers
  15 : SNOW, //blowing snow
  16 : SNOW, //snow
  17 : HAIL, //hail
  18 : HAIL, //sleet
  19 : HAZE, //dust
  20 : HAZE, //foggy
  21 : HAZE, //haze
  22 : HAZE, //smoky
  23 : WINDY, //blustery
  24 : WINDY, //windy
  25 : COLD, //cold
  26 : CLOUDY, //cloudy
  27 : CLOUDY, //mostly cloudy (night)
  28 : CLOUDY, //mostly cloudy (day)
  29 : PARTLY_CLOUDY_NIGHT, //partly cloudy (night)
  30 : PARTLY_CLOUDY_DAY, //partly cloudy (day)
  31 : CLEAR_NIGHT, //clear (night)
  32 : CLEAR_DAY, //sunny
  33 : CLEAR_NIGHT, //fair (night)
  34 : CLEAR_DAY, //fair (day)
  35 : HAIL, //mixed rain and hail
  36 : CLEAR_DAY, //hot
  37 : STORM, //isolated thunderstorms
  38 : STORM, //scattered thunderstorms
  39 : STORM, //scattered thunderstorms
  40 : STORM, //scattered showers
  41 : SNOW, //heavy snow
  42 : SNOW, //scattered snow showers
  43 : SNOW, //heavy snow
  44 : CLOUD, //partly cloudy
  45 : STORM, //thundershowers
  46 : SNOW, //snow showers
  47 : STORM, //isolated thundershowers
  3200 : NA, //not available
};
*/
var imageId = {
  'clear': CLEAR_DAY,
  'nt_clear': CLEAR_NIGHT,
  'rain': RAIN,
  'nt_rain': RAIN,
  'snow': SNOW,
  'nt_snow': SNOW
  'sleet': HAIL,
  'wind': WINDY,
  'fog': HAZE,
  'cloudy': CLOUDY,
  'partlycloudy': PARTLY_CLOUDY_DAY,
  'nt_partlycloudy': PARTLY_CLOUDY_NIGHT,
  'chancetstorms': STORM,
  'rain_snow': SNOW,
  'snow_sleet': SNOW,
  'cold': COLD,
  'hot': CLEAR_DAY,
};

var options = JSON.parse(localStorage.getItem('options'));
console.log('read options: ' + JSON.stringify(options));
if (options === null) options = { "use_gps" : "true", "location" : "", "units" : "fahrenheit"};

function getWeatherFromLatLong(latitude, longitude) {
  var response;
  var key = "b73f0bdb0c4a6c69";
  var req = new XMLHttpRequest();
  var url = "http://api.wunderground.com/api/"+key+"/forecast/geolookup/conditions/astronomy/q/"+latitude+","+longitude+".json"
  //var url = "http://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=" + key + "&lat=" + latitude + "&lon=" + longitude + "&accuracy=16&format=json&nojsoncallback=1";
  req.open('GET', url, true);
  req.onload = function(e) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        console.log(req.responseText);
        response = JSON.parse(req.responseText);
        if (response) {
          temperature = (celsius ? response.current_observation.temp_c : response.current_observation.temp_c) + (celsius ? "\u00B0C" : "\u00B0F");
          //icon = imageId[condition.code];
          icon = imageId[response.current_observation.icon]
          console.log("temp " + temperature);
          console.log("icon " + icon);
          console.log("condition " + response.current_observation.weather);
          Pebble.sendAppMessage({
            "icon":icon,
            "temperature":temperature,
          });
        }
      } else {
        console.log("Error");
      }
    }
  }
  req.send(null);
}

function getWeatherFromLocation(location_name) {
  var response;
  var key = "b73f0bdb0c4a6c69";
  var req = new XMLHttpRequest();
  var url = "http://api.wunderground.com/api/"+key+"/forecast/geolookup/conditions/astronomy/q/"+location_name+".json"
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onload = function(e) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        console.log(req.responseText);
        response = JSON.parse(req.responseText);
        if (response) {
          //var condition = response.query.results.channel.item.condition;
          //var condition = response.
          //temperature = condition.temp + (celsius ? "\u00B0C" : "\u00B0F");
          temperature = (celsius ? response.current_observation.temp_c : response.current_observation.temp_c) + (celsius ? "\u00B0C" : "\u00B0F");
          //icon = imageId[condition.code];
          icon = imageId[response.current_observation.icon]
          console.log("temp " + temperature);
          console.log("icon " + icon);
          console.log("condition " + response.current_observation.weather);
          Pebble.sendAppMessage({
            "icon":icon,
            "temperature":temperature,
          });
        }
      } else {
        console.log("Error");
      }
    }
  }
  req.send(null);
}


function updateWeather() {
  if (options['use_gps'] == "true") {
    window.navigator.geolocation.getCurrentPosition(locationSuccess,
                                                    locationError,
                                                    locationOptions);
  } else {
    getWeatherFromLocation(options["location"]);
  }
}

var locationOptions = { "timeout": 15000, "maximumAge": 60000 };

function locationSuccess(pos) {
  var coordinates = pos.coords;
  getWeatherFromLatLong(coordinates.latitude, coordinates.longitude);
}

function locationError(err) {
  console.warn('location error (' + err.code + '): ' + err.message);
  Pebble.sendAppMessage({
    "icon":11,
    "temperature":""
  });
}

Pebble.addEventListener('showConfiguration', function(e) {
  var uri = 'http://tallerthenyou.github.io/simplicity-with-day/configuration.html?' +
    'use_gps=' + encodeURIComponent(options['use_gps']) +
    '&location=' + encodeURIComponent(options['location']) +
    '&units=' + encodeURIComponent(options['units']);
  console.log('showing configuration at uri: ' + uri);

  Pebble.openURL(uri);
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (e.response) {
    options = JSON.parse(decodeURIComponent(e.response));
    localStorage.setItem('options', JSON.stringify(options));
    console.log('storing options: ' + JSON.stringify(options));
    updateWeather();
  } else {
    console.log('no options received');
  }
});

Pebble.addEventListener("ready", function(e) {
  console.log("connect!" + e.ready);
  updateWeather();
  setInterval(function() {
    console.log("timer fired");
    updateWeather();
  }, 1800000);
  console.log(e.type);
});
