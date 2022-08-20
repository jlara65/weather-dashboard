var cityEl = $('#city');
var iconEl = $('#now-icon');
var tempEl = $('#now-temp');
var humidEl = $('#now-humid');
var windEl = $('#now-wind');
var currentDateEl = $('#now-date');
var today = moment();
var indexEl = $('#now-uv');
var searchCityEl = $('#searchInput');

$('#searchBtn').click(function() {
    let cityName = searchCityEl.val();
    getCurrentWeather(cityName);
    getForecast(cityName);
});

function getCurrentWeather(cityName) {
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',us&units=imperial&appid=4b0de6a21705d45f39b918e869296285'
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then((response) => {
        console.log(response);
        var city = response.name;
        var icon = getIconElement(response.weather[0].icon);
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
    

        console.log(city,temp,humidity,windSpeed);

        cityEl.text(city);
        iconEl.html(icon);
        currentDateEl.text(today.format('(MM/DD/YYYY)'));
        tempEl.text(temp);
        humidEl.text(humidity);
        windEl.text(windSpeed);

        getUVIndex(lat,lon);

        /*
        var listCity = document.createElement('span');
        var listIcon = document.createElement('span');
        var listTemp = document.createElement('p');
        var listHumid = document.createElement('p');
        var listWind = document.createElement('p');
        
        
        listCity.innerText = city;
        listIcon.innerText = icon;
        listTemp.innerText = temp;
        currentDateEl.text(today.format('MM/DD/YYYY'));
        listHumid.innerText = humidity;
        listWind.innerText = windSpeed;
        
        cityEl.appendChild(listCity);
        tempEl.appendChild(listTemp);
        humidEl.appendChild(listHumid);

        windEl.appendChild(listWind); */

    });
};

function getForecast(cityName) {
    var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + ',us&units=imperial&cnt=5&appid=4b0de6a21705d45f39b918e869296285';
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then((response) => {
        var daysArray = response.list
        console.log(daysArray);
        for (var j = 0; j < daysArray.length; j++) {
            var date = today.add(j + 1, 'day').format('MM/DD/YYYY');
            var fTemp = daysArray[j].main.temp;
            var fHumid = daysArray[j].main.humidity;
            var fWind = daysArray[j].wind.speed;
            
            var fDateEl = $('<h5>').text(date);
            var fIconEl = getIconElement(daysArray[j].weather[0].icon);
            var fTempEl = $('<p>').html(`Temp: ${fTemp}&deg;F`);
            var fHumidEl = $('<p>').html(`Humidity: ${fHumid}%`);
            var fWindEl = $('<p>').html(`Wind: ${fWind} MPH`);

            $(`#day-${j + 1}`).html('');

            $(`#day-${j + 1}`).append(fDateEl).append(fIconEl).append(fTempEl).append(fWindEl).append(fHumidEl)
        };
    });
};

function getUVIndex(lat, lon) {
    var queryURL = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=4b0de6a21705d45f39b918e869296285'
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then((response) => {
        var uvi = response.value;

        console.log(uvi);
        indexEl.text(uvi);
        colorUV(uvi);
        
    });
};

function colorUV(value) {
    
    if (value < 3) {
        indexEl.attr('class', 'bg-success text-light font-weight-bold border border-dark rounded p-1')
    } else if (value < 7) {
        indexEl.attr('class', 'bg-warning text-light font-weight-bold border border-dark rounded p-1')
    } else {
        indexEl.attr('class', 'bg-danger text-light font-weight-bold border border-dark rounded p-1')
    };
};

function getIconElement(code) {
    var iconUrl = 'http://openweathermap.org/img/wn/' + code + '@2x.png'
    return `<img src="${iconUrl}">`;

    //return document.getElementById("now-icon").innerHTML="<img src='" + iconUrl + "'>";
};

//getCurrentWeather("San Antonio");
//getForecast("San Antonio");