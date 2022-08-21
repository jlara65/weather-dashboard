var cityEl = $('#city');
var iconEl = $('#now-icon');
var tempEl = $('#now-temp');
var humidEl = $('#now-humid');
var windEl = $('#now-wind');
var currentDateEl = $('#now-date');
var today = dayjs();
var indexEl = $('#now-uv');
//var searchBtnEl = $('#searchBtn')
var searchCityEl = $('#searchInput');
var searchHistoryEl = $('#searchHistory');
var searchDivEl = $('#searchDiv');
var resultDivEl = $('#resultsDiv');

var maxItems = 10;
let searchHistArray;
let lastCity;

$('#searchBtn').click (() => {
    let cityName = searchCityEl.val();
    
    searchMachine(cityName);
    //getCurrentWeather(cityName);
    //getForecast(cityName);
    searchCityEl.val('');
});

$(document).ready(() => {
    searchHistArray = JSON.parse(localStorage.getItem('searchHistory')) || [];
    lastCity = searchHistArray[0];
    console.log(lastCity);
    updateSearchHist();

    if (lastCity) {
        getCurrentWeather(lastCity);
        getForecast(lastCity);
    } else {
        resultDivEl.addClass('d-none');
        searchDivEl.addClass('col-lg-12');
        
    };
});

function searchMachine(cityName) {
    if (searchHistArray.includes(cityName)) {
        let freqIndex = searchHistArray.indexOf(cityName);

        searchHistArray.splice(freqIndex, 1);
    };

    searchHistArray.unshift(cityName);
    updateSearchHist();

    getCurrentWeather(cityName);
    getForecast(cityName);

    resultDivEl.removeClass('d-none');
    searchDivEl.removeClass('col-lg-12')
};

function updateSearchHist() {
    if (searchHistArray.length > maxItems) {
        searchHistArray.pop();
    };
    localStorage.setItem('searchHistory', JSON.stringify(searchHistArray));

    searchHistoryEl.html('');
    for (var city of searchHistArray) {
        var newItem = $('<button type=button" class="list-item-action btn btn-secondary my-2">');

        newItem.text(city);
        newItem.click((event) => {
            searchMachine(event.target.textContent);
        });
        searchHistoryEl.append(newItem);
    };
}; 

function getCurrentWeather(cityName) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},us&units=imperial&appid=4b0de6a21705d45f39b918e869296285`
    console.log(queryURL);
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
    

        //console.log(city,temp,humidity,windSpeed);

        cityEl.text(city);
        iconEl.html(icon);
        currentDateEl.text(today.format('(MM/DD/YYYY)'));
        tempEl.text(temp);
        humidEl.text(humidity);
        windEl.text(windSpeed);

        console.log(lat,lon);
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
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},us&units=imperial&cnt=5&appid=4b0de6a21705d45f39b918e869296285`;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then((response) => {
        var daysArray = response.list
        console.log(daysArray);
        for (let i = 0; i < daysArray.length; i++) {
            var date = today.add(i + 1, 'day').format('MM/DD/YYYY');
            var fTemp = daysArray[i].main.temp;
            var fHumid = daysArray[i].main.humidity;
            var fWind = daysArray[i].wind.speed;
            
            var fDateEl = $('<h5>').text(date);
            var fIconEl = getIconElement(daysArray[i].weather[0].icon);
            var fTempEl = $('<p>').html(`Temp: ${fTemp}&deg;F`);
            var fHumidEl = $('<p>').html(`Humidity: ${fHumid}%`);
            var fWindEl = $('<p>').html(`Wind: ${fWind} MPH`);

            $(`#day-${i + 1}`).html('');

            $(`#day-${i + 1}`).append(fDateEl).append(fIconEl).append(fTempEl).append(fWindEl).append(fHumidEl)
        };
    });
};

function getIconElement(code) {
    var iconUrl = `http://openweathermap.org/img/wn/${code}@2x.png`
    return `<img src="${iconUrl}">`;
};

function getUVIndex(lat, lon) {
    var queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=4b0de6a21705d45f39b918e869296285`
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then((response) => {
        console.log(response);
        var uvi = response.value;

        console.log(uvi);
        indexEl.text(uvi);
        colorUV(uvi);
        
    });
};

function colorUV(uvi) {
    
    if (uvi < 3) {
        indexEl.attr('class', 'bg-success text-light font-weight-bold border border-dark rounded p-1')
    } else if (uvi < 7) {
        indexEl.attr('class', 'bg-warning text-light font-weight-bold border border-dark rounded p-1')
    } else {
        indexEl.attr('class', 'bg-danger text-light font-weight-bold border border-dark rounded p-1')
    };
};



//getCurrentWeather("San Antonio");
//getForecast("San Antonio");