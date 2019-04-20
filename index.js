const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const dotenv = require('dotenv').config();
const key = process.env.key;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('index');
  });

  app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`
    let encodedurl = encodeURI(url);
    request(encodedurl, function (err, response, body) {
      if(err){
        res.render('index', {weather: null, statusMessage: 'An Error has ocurred, please try again later'});
      } else {
        let weather = JSON.parse(body);
        if(weather.main == undefined){
          res.render('index', {weather: null, statusMessage: "I'm sorry but the city you entered doesn't appear to exist in the database, please enter other city"});
        } else {
          let statusMessage = '';
          let iconClass = '';
          let temp = weather.main.temp;
          let tmin = weather.main.temp_min;
          let tmax = weather.main.temp_max;
          let humidity = weather.main.humidity;
          let windSpeed = weather.wind.speed;
          let conditions = weather.weather[0].main;
          let iconCode = weather.weather[0].id;
          switch(iconCode){
            case 800:
            iconClass = 'sunny';
            break;
            case 701:
					  case 721:
					  case 741:
            case 771:
            case 801:
            case 802:
            case 803:
            case 804:
            iconClass = 'cloudy';
            break;
            case 300:
				  	case 301:
					  case 302:
					  case 310:
					  case 311:
				  	case 312:
					  case 313:
					  case 314:
					  case 321:
					  case 500:
					  case 501:
					  case 502:
					  case 503:
					  case 504:
					  case 511:
				  	case 520:
					  case 521:
            case 522:
            case 531:
            iconClass = 'rainy';
            break;
            case 711:
					  case 731:
					  case 751:
            case 761:
            case 762:
            iconClass = 'smoke';
            break;
            case 200:
					  case 201:
					  case 202:
					  case 210:
					  case 211:
					  case 212:
				   	case 221:
					  case 230:
					  case 231:
            case 232:
            case 781:
            iconClass = 'stormy';
            break;
            case 600:
					  case 601:
					  case 602:
					  case 611:
					  case 612:
				    case 615:
					  case 616:
					  case 620:
            case 621:
            case 622:
            iconClass = 'snowy';
          }
          let description = weather.weather[0].description;
          res.render('index',{temp:temp, windSpeed:windSpeed, city:city, description:description, iconClass:iconClass, tmin:tmin, tmax:tmax, humidity:humidity, conditions:conditions, statusMessage:statusMessage });
        }
      }
    });
  })

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
  });


  