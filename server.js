const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const key = '';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//Routes

app.get('/', function (req, res) {
  res.render('index')
});

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`
    let encodedurl = encodeURI(url);
    console.log(encodedurl);

    request(encodedurl, function (err, response, body) {
        if(err){
          res.render('index', {weather: null, error: 'An Error has ocurred, please try again later'});
        } else {
          let weather = JSON.parse(body)
          if(weather.main == undefined){
            res.render('index', {weather: null, error: "I'm sorry but the city you entered don't appear to exist in the database, please enter other city"});
          } else {
            let lon = weather.coord.lon;  
            let lat = weather.coord.lat;
            let temp = weather.main.temp;
            let windSpeed = weather.wind.speed;
            let sunrise = weather.sys.sunrise;
            let sunset = weather.sys.sunset;

            let sunrisetime = new Date(0);
            let sunsettime = new Date(0);

            sunrisetime.setUTCSeconds(sunrise);
            sunsettime.setUTCSeconds(sunset);

           
            res.render('index',{lon:lon, lat:lat, temp:temp, windSpeed:windSpeed, sunrisetime:sunrisetime, sunsettime:sunsettime, city:city, error:null });

            //let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
            //res.render('index', {weather: weatherText, error: null});
          }
        }

      });
  })

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
});