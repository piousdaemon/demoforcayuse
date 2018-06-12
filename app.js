/*
 *  NOTES: 
 *    Units are a mixture of Metric and Imperial, and should probably be adjusted to the user's locale
 *    Not doing any validation of the zip code (besides validating that it is not empty), if the user provides bad data, 
 *      openweathermap will return not found.
 *    
 */


var Client = require('node-rest-client').Client;
var client = new Client();
var weatherKey = 'f2d81f219d8ce84807f0cc0c23fe5309';
var googleKey = 'AIzaSyBb8Z8dBHe4YNOHgCkv7WVczpQLtTV9HTo';

var zipcode = process.argv[2];
console.log('zip: ' + zipcode);
 if (typeof zipcode === "undefined") {
   throw 'must supply zipcode';
}

client.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&APPID=${weatherKey}`, function (data, response) {
  // console.log('Weather DATA');
  // console.log(data);
  if (data.cod == '404') {
    throw data.message;
  }
  console.log(`City Name: ${data.name}`);
  console.log(`Current Temperature: ${kelvinToFahrenheit(data.main.temp)}`);

});


client.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${googleKey}`, function (data, response) {
 
  // console.log('Location data:');
  // console.log(data);
  if (data.status == 'ZERO_RESULTS') {
    throw 'Cannot find location via geocode (zero results)';
  }
  var myLat = data.results[0].geometry.location.lat;
  var myLong = data.results[0].geometry.location.lng;
  // console.log('lat: ' + myLat + ", long: " + myLong);
  var myNow = Math.floor(Date.now() / 1000);

  var tzquery = `https://maps.googleapis.com/maps/api/timezone/json?location=${myLat},${myLong}&timestamp=${myNow}&key=${googleKey}`;
  // console.log ('timezone query: ' + tzquery);
  client.get(tzquery, function (data, response) {
    console.log('Your current timezone is ' + data.timeZoneName);

  }); 

  var eleQuery = `https://maps.googleapis.com/maps/api/elevation/json?locations=${myLat},${myLong}&key=${googleKey}`;
  // console.log('elevation query: ' + eleQuery);
  client.get(eleQuery, function (data, response) {
    console.log('your current elevation is ' + data.results[0].elevation + ' meters');

  })

});

function kelvinToFahrenheit(temperature) {
  var result = -1;
  if (isNaN(temperature)) {
    return -1;
  } else {
    return ((temperature) * 1.8 ) - 459.67;
  }
}



