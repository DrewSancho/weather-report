var data = require('./data');

function fahrenheit (temp) {
    return Math.floor((temp - 273.15) * 1.8000 + 32.00);
};

function windDirection (input) {
    var cardinalDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    var output = cardinalDirections[0];
    var range = 360 / cardinalDirections.length;

    for (var i = cardinalDirections.length, j = 360; input > 0 && j > input - 22.5; (i--, j -= range)) {
        output = cardinalDirections[i];
    }

    return output;
}

var tilde = '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~';

var temperature = data.list.reduce(function (a, b) {
    return a + b.main.temp;
}, 0);

var avgTemp = temperature / data.list.length;

var humid = data.list.reduce(function (a, b) {
    return a + b.main.humidity;
}, 0);

var avgHum = Math.floor(humid / data.list.length);

var minTemp = data.list.reduce(function (a, b) {
    return a + b.main.temp_min;
}, 0);

var avgLoTemp = minTemp / data.list.length;

var hiTemp = data.list.reduce(function (a, b) {
    return a + b.main.temp_max;
}, 0);

var avgHiTemp = hiTemp / data.list.length;

var weatherDescrip = function () {
    var modeValue;
    var modeCount = 0;

    data.list.forEach(function (x) {
        var total = 0;

        data.list.forEach(function (y) {
            if (x.weather[0].description === y.weather[0].description) {
                total++;
            }
        });

        if (total > modeCount) {
            modeCount = total;
            modeValue = x.weather[0].description;
        }
    });

    return modeValue;
};

var avgWeath = weatherDescrip();

var windSpeed = data.list.reduce(function (a, b) {
    return a + b.wind.speed;
}, 0);

var avgWind = Math.ceil(windSpeed / data.list.length);

var averages = {};

averages.main = {"temp": avgTemp, "humidity": avgHum, "temp_min": avgLoTemp, "temp_max": avgHiTemp};

averages.weather = [{"description": avgWeath}];

averages.wind = {"speed": avgWind};

averages.name = "Averages";

function weatherGraph (item) {
    console.log(item.name + ' ' + tilde.substring(item.name.length + 1));
    console.log(item.weather[0].description + '.');
    console.log('Lo: ' + fahrenheit(item.main.temp_min) + ', ' + 'Hi: ' + fahrenheit(item.main.temp_max));
    console.log('Humidity: ' + item.main.humidity + '%');
    console.log('Wind: ' + item.wind.speed + ' MPH  ' + windDirection(item.wind.deg));
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
};

data.list.sort(function (a, b) {
    if (a.name > b.name) {
        return 1;
    }
    if (a.name < b.name) {
        return -1;
    }
    return 0;
});

data.list.forEach(weatherGraph);

weatherGraph(averages);