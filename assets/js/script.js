// Introduce the variables
var addUnit = document.querySelector('#unit');
var unit = localStorage.getItem("unit");
var btnUnit = document.querySelector('.slider');
var today = dayjs();
var locationNow;
var weatherNow;
var cityAsked;
var weatherLink;
var x = -1;
const header = document.querySelector('.header');
const main = document.querySelector('.mainbody');
const loader = document.querySelector('#loader');
const search = document.querySelector('#search-box');
const matchList = document.querySelector('#match-list');
const clearMatchListBtn = document.querySelector('#clear-match-list');
let all_countries = [];
const countries_json = [];
var storedCities = localStorage.getItem("storedCities");
var citiesList = [];
var countryNow;
var code;
const searchCity = document.querySelector('#search-cities');
var longitudeAsked;
var latitudeAsked;
var latLongLink;
var z = -1;
var coordinatesNow = [];
var y = -1;
var timeWhere = [];
var portionDay = [];
var savedTowns = localStorage.getItem("savedTowns");

// Functions on load:
showInit();

initUnit();

renderHistory();

// Event Listeners

$('#date').text(today.format('hh : mm a. MMM D, YYYY.'));

addUnit.addEventListener("click", addedUnit);

clearMatchListBtn.addEventListener("click", clearHistory);

$(searchCity).on('input', function (element) {
    filterCityNames(element.target.value);
});

$(document).ready(function () {
    console.log($(countries));
    console.log(codes);
    collectCountries();
    $(search).on('input', function (element) {
        filterCountriesNames(element.target.value);
    });
});

// First Information fetch

async function showInit() {

    await showCity();
    await sleep(2000);
    showWeather();

}

function showLoader() {
    header.setAttribute('class', 'header flex-horizontal');
    main.setAttribute('class', 'mainbody');
    loader.setAttribute('class', "hidden");
};

function hideLoader() {
    header.setAttribute('class', 'header flex-horizontal');
    main.setAttribute('class', 'mainbody');
    loader.setAttribute('class', "hidden");
};

// Fetch user's location and display it
function showCity() {

    fetch("https://geolocation-db.com/json/")
        .then(response => response.json())
        .then((locationNow) => {

            console.log(locationNow);
            console.log('City is: ' + locationNow.city);




            if (locationNow != undefined) {

                console.log('This is your city: ' + locationNow.city);
                $('#city-now').text(locationNow.city + ", ");
                $('#state-now').text(locationNow.state + ", ");

                cityAsked = (locationNow.city);
                cityAsked = cityAsked.split(" ").join("&nbsp");
                longitudeAsked = (locationNow.longitude);
                latitudeAsked = (locationNow.latitude);
                console.log(`Longitude is: ${longitudeAsked} Latitude is: ${latitudeAsked}`);
                return;
            }
            else if (locationNow.city == undefined) {
                $('#city-now').text("Toronto, ");
                $('#state-now').text("Ontario, ");
                console.log("Didn't find your city" + locationNow.city);
            }


        })
        .catch((error) => {

            console.log("Didn't find your city");
            $('#city-now').text("Toronto, ");
            $('#state-now').text("Ontario, ");
            return;
        });

}

//Fetch weather info and display it

function showWeather() {
    weatherLink = (`https://api.openweathermap.org/data/2.5/weather?lat=${latitudeAsked}&lon=${longitudeAsked}&appid=4dd7b444d35c5781eda9fee4131ca26d&units=${unit}`);
    console.log(`Testing weatherLink: ${weatherLink}`);

    //weatherLink = (`https://api.openweathermap.org/data/2.5/forecast?q=${cityAsked}&mode=json&units=metric&appid=4dd7b444d35c5781eda9fee4131ca26d`);
    //console.log("weatherLink here: " + weatherLink);
    console.log("x:" + x);

    if (x <= -7) {
        alert(`Unable to find your city, please choose your city!`);
        header.setAttribute('class', 'header flex-horizontal');
        main.setAttribute('class', 'mainbody');
        loader.setAttribute('class', "hidden");
        return;
    }

    fetch(weatherLink)

        .then(response => response.json())

        .then((weatherNow) => {
            console.log(weatherNow.cod);
            //debugger;
            if (weatherNow.cod === 200) {
                console.log(weatherNow);
                // Now
                if (unit == "metric") {
                    $('#temp-now').text(weatherNow.main.temp.toFixed(0)
                        + "°C");
                }
                else if (unit == "imperial") {
                    $('#temp-now').text(weatherNow.main.temp.toFixed(0)
                        + "°F");
                };
                if (unit == "metric") {
                    $('#wind-now').text("Wind speed: " + (weatherNow.wind.speed.toFixed(4) * 3.6).toFixed(2)
                        + " KM/H");
                }
                else if (unit == "imperial") {
                    $('#wind-now').text("Wind speed: " + weatherNow.wind.speed.toFixed(2)
                        + " MP/H");
                };

                $('#humidity-now').text("Humidity: " + weatherNow.main.humidity.toFixed(0)
                    + "%");

                if (unit == "metric") {
                    $('#visibility-now').text("Visibility: " + weatherNow.visibility.toFixed(0)
                        + " Meters");
                }
                else if (unit == "imperial") {
                    $('#visibility-now').text("Visibility: " + (weatherNow.visibility.toFixed(0) * 3.28084).toFixed(0)
                        + " Feet");
                };

                if (unit == "metric") {
                    $('#precipitation-now').text("Condition: " + weatherNow.weather[0].description
                        + "");//mm
                }
                else if (unit == "imperial") {
                    $('#precipitation-now').text("Condition: " + weatherNow.weather[0].description //(weatherNow.pop.toFixed(0) * 0.0393701).toFixed(2)
                        + "");//inches
                };

                $('#iconNow').html(`<img src="assets/icons/${weatherNow.weather[0].icon}.png" alt="Weather icon">`);




                console.log(weatherNow.weather[0].icon);


                const myJSON = JSON.stringify(weatherNow);

                console.log("Weather JSON:" + myJSON);
                //hideLoader();
                header.setAttribute('class', 'header flex-horizontal');
                main.setAttribute('class', 'mainbody');
                loader.setAttribute('class', "hidden");
                return;
            } else {
                console.log(`Unable to display weather`);

                $('#temp-now').text("Error to get weather");

                x--;
                showWeather();
            }
        })

        .catch((error) => {
            console.log(`Unable to display weather`);
            console.log("Didn't find your weather");
            $('#temp-now').text("Select a city!");

            x--;
            showInit();

        });
    console.log(weatherLink);

    showLongWeather();

}
// Fetch 5 day forecast

function showLongWeather() {
    weatherLink = (`https://api.openweathermap.org/data/2.5/forecast?lat=${latitudeAsked}&lon=${longitudeAsked}&appid=4dd7b444d35c5781eda9fee4131ca26d&units=${unit}`);
    console.log(`Testing weatherLink: ${weatherLink}`);

    console.log("y:" + y);

    if (y <= -7) {
        //alert(`Unable to find your city, please choose your city!`);
        header.setAttribute('class', 'header flex-horizontal');
        main.setAttribute('class', 'mainbody');
        loader.setAttribute('class', "hidden");
        return;
    }

    fetch(weatherLink)

        .then(response => response.json())

        .then((weatherNow) => {
            console.log(weatherNow.cod);
            //debugger;
            if (weatherNow.cod === "200") {
                console.log(weatherNow);
                //time-0
                let portion = weatherNow.list[0].dt_txt.split('');
                portion = portion[11] + portion[12];
                if (portion > 12) {
                    portion = portion - 12;
                    $('#time-0').text(portion
                        + " PM");
                }
                else if (portion == 00) {
                    $('#time-0').text("Midnight");

                }
                else if (portion < 12) {
                    $('#time-0').text(portion[1]
                        + " AM");
                }
                else if (portion == 12) {
                    $('#time-0').text("Noon");
                }
                ;

                if (unit == "metric") {
                    $('#temp-0').text(weatherNow.list[0].main.temp.toFixed(0)
                        + "°C");
                }
                else if (unit == "imperial") {
                    $('#temp-0').text(weatherNow.list[0].main.temp.toFixed(0)
                        + "°F");
                };

                if (unit == "metric") {
                    $('#precipitation-0').html("Precipitation:<br>" + weatherNow.list[0].pop.toFixed(2)
                        + " mm");
                }
                else if (unit == "imperial") {
                    $('#precipitation-0').html("Precipitation:<br>" + (weatherNow.list[0].pop.toFixed(0) * 0.0393701).toFixed(2)
                        + " inches");
                };

                $('#icon-0').html(`<img src="assets/icons/${weatherNow.list[0].weather[0].icon}.png" alt="Weather icon">`);

                //time-1
                portion = weatherNow.list[1].dt_txt.split('');
                portion = portion[11] + portion[12];
                if (portion > 12) {
                    portion = portion - 12;
                    $('#time-1').text(portion
                        + " PM");
                }
                else if (portion < 12 && portion != 00) {
                    $('#time-1').text(portion[1]
                        + " AM");
                }
                else if (portion == 12) {
                    $('#time-1').text("Noon");
                }
                else if (portion == 00) {
                    $('#time-1').text("Midnight");

                };

                if (unit == "metric") {
                    $('#temp-1').text(weatherNow.list[1].main.temp.toFixed(0)
                        + "°C");
                }
                else if (unit == "imperial") {
                    $('#temp-1').text(weatherNow.list[1].main.temp.toFixed(0)
                        + "°F");
                };

                if (unit == "metric") {
                    $('#precipitation-1').html("Precipitation:<br>" + weatherNow.list[1].pop.toFixed(2)
                        + " mm");
                }
                else if (unit == "imperial") {
                    $('#precipitation-1').html("Precipitation:<br>" + (weatherNow.list[1].pop.toFixed(0) * 0.0393701).toFixed(2)
                        + " inches");
                };

                $('#icon-1').html(`<img src="assets/icons/${weatherNow.list[1].weather[0].icon}.png" alt="Weather icon">`);

                //time-2
                portion = weatherNow.list[2].dt_txt.split('');
                portion = portion[11] + portion[12];

                if (portion > 12) {
                    portion = portion - 12;
                    $('#time-2').text(portion
                        + " PM");
                }
                else if (portion == 00) {
                    $('#time-2').text("Midnight");

                }
                else if (portion < 12 && portion != 0) {

                    $('#time-2').text(portion[1]
                        + " AM");
                }
                else if (portion == 12) {
                    $('#time-2').text("Noon");
                };

                if (unit == "metric") {
                    $('#temp-2').text(weatherNow.list[2].main.temp.toFixed(0)
                        + "°C");
                }
                else if (unit == "imperial") {
                    $('#temp-2').text(weatherNow.list[2].main.temp.toFixed(0)
                        + "°F");
                };

                if (unit == "metric") {
                    $('#precipitation-2').html("Precipitation:<br>" + weatherNow.list[2].pop.toFixed(2)
                        + " mm");
                }
                else if (unit == "imperial") {
                    $('#precipitation-2').html("Precipitation:<br>" + (weatherNow.list[2].pop.toFixed(0) * 0.0393701).toFixed(2)
                        + " inches");
                };

                $('#icon-2').html(`<img src="assets/icons/${weatherNow.list[2].weather[0].icon}.png" alt="Weather icon">`);
                console.log(weatherNow.list[2].weather[0].icon);

                //time-3
                portion = weatherNow.list[3].dt_txt.split('');
                portion = portion[11] + portion[12];
                if (portion > 12) {
                    portion = portion - 12;
                    $('#time-3').text(portion
                        + " PM");
                }
                else if (portion < 12 && portion != 00) {
                    $('#time-3').text(portion[1]
                        + " AM");
                }
                else if (portion == 12) {
                    $('#time-3').text("Noon");
                }
                else if (portion == 00) {
                    $('#time-3').text("Midnight");

                };

                if (unit == "metric") {
                    $('#temp-3').text(weatherNow.list[1].main.temp.toFixed(0)
                        + "°C");
                }
                else if (unit == "imperial") {
                    $('#temp-3').text(weatherNow.list[1].main.temp.toFixed(0)
                        + "°F");
                };

                if (unit == "metric") {
                    $('#precipitation-3').html("Precipitation:<br>" + weatherNow.list[3].pop.toFixed(2)
                        + " mm");
                }
                else if (unit == "imperial") {
                    $('#precipitation-3').html("Precipitation:<br>" + (weatherNow.list[3].pop.toFixed(0) * 0.0393701).toFixed(2)
                        + " inches");
                };

                $('#icon-3').html(`<img src="assets/icons/${weatherNow.list[3].weather[0].icon}.png" alt="Weather icon">`);
                console.log(weatherNow.list[3].weather[0].icon);
                // Day 0 starts

                portion = weatherNow.list[6].dt_txt.split('');
                timeWhere = portion;
                convertTime(timeWhere);

                $('#time-6').text(dateFiveDay);


                if (unit == "metric") {
                    $('#temp-6').text(weatherNow.list[6].main.temp.toFixed(0)
                        + "°C");
                }
                else if (unit == "imperial") {
                    $('#temp-6').text(weatherNow.list[6].main.temp.toFixed(0)
                        + "°F");
                };

                if (unit == "metric") {
                    $('#precipitation-6').html("Precipitation:<br>" + weatherNow.list[6].pop.toFixed(2)
                        + " mm");
                }
                else if (unit == "imperial") {
                    $('#precipitation-6').html("Precipitation:<br>" + (weatherNow.list[6].pop.toFixed(0) * 0.0393701).toFixed(2)
                        + " inches");
                };

                $('#icon-6').html(`<img src="assets/icons/${weatherNow.list[6].weather[0].icon}.png" alt="Weather icon">`);


                if (unit == "metric") {
                    $('#wind-6').text("Wind: " + (weatherNow.list[6].wind.speed.toFixed(4) * 3.6).toFixed(2)
                        + " KM/H");
                }
                else if (unit == "imperial") {
                    $('#wind-6').text("Wind: " + weatherNow.list[6].wind.speed.toFixed(2)
                        + " MP/H");
                };

                $('#humidity-6').text("Humidity: " + weatherNow.list[6].main.humidity.toFixed(0)
                    + "%");
                console.log(weatherNow.list[6]);
                // Day 1 starts

                portion = weatherNow.list[14].dt_txt.split('');
                timeWhere = portion;
                convertTime(timeWhere);

                $('#time-14').text(dateFiveDay);


                if (unit == "metric") {
                    $('#temp-14').text(weatherNow.list[14].main.temp.toFixed(0)
                        + "°C");
                }
                else if (unit == "imperial") {
                    $('#temp-14').text(weatherNow.list[14].main.temp.toFixed(0)
                        + "°F");
                };

                if (unit == "metric") {
                    $('#precipitation-14').html("Precipitation:<br>" + weatherNow.list[14].pop.toFixed(2)
                        + " mm");
                }
                else if (unit == "imperial") {
                    $('#precipitation-14').html("Precipitation:<br>" + (weatherNow.list[14].pop.toFixed(0) * 0.0393701).toFixed(2)
                        + " inches");
                };

                $('#icon-14').html(`<img src="assets/icons/${weatherNow.list[14].weather[0].icon}.png" alt="Weather icon">`);


                if (unit == "metric") {
                    $('#wind-14').text("Wind: " + (weatherNow.list[14].wind.speed.toFixed(4) * 3.6).toFixed(2)
                        + " KM/H");
                }
                else if (unit == "imperial") {
                    $('#wind-14').text("Wind: " + weatherNow.list[14].wind.speed.toFixed(2)
                        + " MP/H");
                };

                $('#humidity-14').text("Humidity: " + weatherNow.list[14].main.humidity.toFixed(0)
                    + "%");
                console.log(weatherNow.list[14]);

                // Day 2 starts

                portion = weatherNow.list[22].dt_txt.split('');
                timeWhere = portion;
                convertTime(timeWhere);

                $('#time-22').text(dateFiveDay);


                if (unit == "metric") {
                    $('#temp-22').text(weatherNow.list[22].main.temp.toFixed(0)
                        + "°C");
                }
                else if (unit == "imperial") {
                    $('#temp-22').text(weatherNow.list[22].main.temp.toFixed(0)
                        + "°F");
                };

                if (unit == "metric") {
                    $('#precipitation-22').html("Precipitation:<br>" + weatherNow.list[22].pop.toFixed(2)
                        + " mm");
                }
                else if (unit == "imperial") {
                    $('#precipitation-22').html("Precipitation:<br>" + (weatherNow.list[22].pop.toFixed(0) * 0.0393701).toFixed(2)
                        + " inches");
                };

                $('#icon-22').html(`<img src="assets/icons/${weatherNow.list[22].weather[0].icon}.png" alt="Weather icon">`);


                if (unit == "metric") {
                    $('#wind-22').text("Wind: " + (weatherNow.list[22].wind.speed.toFixed(4) * 3.6).toFixed(2)
                        + " KM/H");
                }
                else if (unit == "imperial") {
                    $('#wind-22').text("Wind: " + weatherNow.list[22].wind.speed.toFixed(2)
                        + " MP/H");
                };

                $('#humidity-22').text("Humidity: " + weatherNow.list[22].main.humidity.toFixed(0)
                    + "%");
                console.log(weatherNow.list[22]);


                // Day 3 starts

                portion = weatherNow.list[30].dt_txt.split('');
                timeWhere = portion;
                convertTime(timeWhere);

                $('#time-30').text(dateFiveDay);


                if (unit == "metric") {
                    $('#temp-30').text(weatherNow.list[30].main.temp.toFixed(0)
                        + "°C");
                }
                else if (unit == "imperial") {
                    $('#temp-30').text(weatherNow.list[30].main.temp.toFixed(0)
                        + "°F");
                };

                if (unit == "metric") {
                    $('#precipitation-30').html("Precipitation:<br>" + weatherNow.list[30].pop.toFixed(2)
                        + " mm");
                }
                else if (unit == "imperial") {
                    $('#precipitation-30').html("Precipitation:<br>" + (weatherNow.list[30].pop.toFixed(0) * 0.0393701).toFixed(2)
                        + " inches");
                };

                $('#icon-30').html(`<img src="assets/icons/${weatherNow.list[30].weather[0].icon}.png" alt="Weather icon">`);


                if (unit == "metric") {
                    $('#wind-30').text("Wind: " + (weatherNow.list[30].wind.speed.toFixed(4) * 3.6).toFixed(2)
                        + " KM/H");
                }
                else if (unit == "imperial") {
                    $('#wind-30').text("Wind: " + weatherNow.list[30].wind.speed.toFixed(2)
                        + " MP/H");
                };

                $('#humidity-30').text("Humidity: " + weatherNow.list[30].main.humidity.toFixed(0)
                    + "%");
                console.log(weatherNow.list[30]);


                // Day 4 starts

                portion = weatherNow.list[38].dt_txt.split('');
                timeWhere = portion;
                convertTime(timeWhere);

                $('#time-38').text(dateFiveDay);


                if (unit == "metric") {
                    $('#temp-38').text(weatherNow.list[38].main.temp.toFixed(0)
                        + "°C");
                }
                else if (unit == "imperial") {
                    $('#temp-38').text(weatherNow.list[38].main.temp.toFixed(0)
                        + "°F");
                };

                if (unit == "metric") {
                    $('#precipitation-38').html("Precipitation:<br>" + weatherNow.list[38].pop.toFixed(2)
                        + " mm");
                }
                else if (unit == "imperial") {
                    $('#precipitation-38').html("Precipitation:<br>" + (weatherNow.list[38].pop.toFixed(0) * 0.0393701).toFixed(2)
                        + " inches");
                };

                $('#icon-38').html(`<img src="assets/icons/${weatherNow.list[38].weather[0].icon}.png" alt="Weather icon">`);


                if (unit == "metric") {
                    $('#wind-38').text("Wind: " + (weatherNow.list[38].wind.speed.toFixed(4) * 3.6).toFixed(2)
                        + " KM/H");
                }
                else if (unit == "imperial") {
                    $('#wind-38').text("Wind: " + weatherNow.list[38].wind.speed.toFixed(2)
                        + " MP/H");
                };

                $('#humidity-38').text("Humidity: " + weatherNow.list[38].main.humidity.toFixed(0)
                    + "%");
                console.log(weatherNow.list[38]);

                //
                y = -1;


                header.setAttribute('class', 'header flex-horizontal');
                main.setAttribute('class', 'mainbody');
                loader.setAttribute('class', "hidden");
                return;


                //end of rendering
            } else {
                console.log(`Unable to display weather`);

                $('#temp-now').text("Error to get weather");

                y--;
                showLongWeather();
            }
        })

        .catch((error) => {
            console.log(`Unable to display 5 day forecast`);

            $('#temp-now').text("Sorry! Long forecast not available at this moment!");

            y--;
            showLongWeather();

        });
    console.log(weatherLink);
    console.log("WeatherNow end:" + weatherNow);

}


// Delay function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Change Unit of measurement
function addedUnit() {

    if (unit == "metric") {
        unit = "imperial";
        btnUnit.classList.remove('btn-metric');
        btnUnit.classList.add('btn-imperial');
        localStorage.setItem("unit", unit);
    } else if (unit == "imperial") {
        unit = "metric";
        btnUnit.classList.add('btn-metric');
        btnUnit.classList.remove('btn-imperial');
        localStorage.setItem("unit", unit);
    } else {
        initUnit();
    }

    console.log(`Unit: ${unit}`);
    showWeather();
};

function initUnit() {
    if (unit == undefined) {
        unit = "metric";
        localStorage.setItem("unit", unit);
        btnUnit.classList.add('btn-metric');
    } else if (unit == "metric") {
        btnUnit.classList.add('btn-metric');

    } else {
        btnUnit.classList.add('btn-imperial');

    }
    console.log(`Unit: ${unit}`);
}

function collectCountries() {

    for (const country in countries) {
        all_countries.push(country.toUpperCase());
    }

    console.log(all_countries);
}

function filterCountriesNames(input) {

    let input_uc = input.toUpperCase();
    let matched_items = [];
    if (input) {
        matched_items = all_countries.filter((item) => {
            return item.startsWith(input_uc);
        });
        showAutocomplete(matched_items);
    }
}

function showAutocomplete(countriesList) {
    // Clean old values
    $(matchList).html("");
    // Animation
    $(matchList).animate({
        height: 'auto'
    }, "slow");
    // Load new values
    for (let i = 0; i < countriesList.length; i++) {
        // Capitalize
        let country = countriesList[i].charAt(0).toUpperCase() + countriesList[i].toLowerCase().slice(1);
        $(matchList).append(`<div id="country_${i}">${country}</div>`);
        $("#country_" + i).on('click', () => {
            showCitiesList(country);
            console.log(country);
        });
    }
}

function showCitiesList(country) {
    // Clean values
    $(matchList).html("");
    $(matchList).html("");
    // append match list

    $(matchList).html(`<div>${country}:</div><p id="search-btn" placeholder="Choose city"></p><ul class="cities-list" id="cities-list"></ul>`);

    // Load list
    countryNow = country;
    console.log("Before anything countryNow: " + countryNow);
    //capitalize

    let words = countryNow.split(" ");
    console.log("words:" + words);

    for (let i = 0; i < words.length; i++) {
        if (words[i] != "") {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }

    }

    words.join(" ");
    console.log(words);
    countryNow = words.join(" ");
    console.log(`countryNow just before code: ${countryNow}`);
    code = (codes[countryNow]);
    citiesList = [];
    citiesList = (countries[countryNow]);
    console.log(citiesList);
    console.log("Code is:" + code + "Country is: " + countryNow);
    searchCity.classList.remove('hidden');
}

function filterCityNames(inputc) {

    let words = inputc.split(" ");
    console.log(words);

    for (let i = 0; i < words.length; i++) {
        if (words[i] != "") {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }

    }

    words.join(" ");
    console.log(words);
    let input_uc = words.join(" ");
    console.log(input_uc);

    let matched_cities = [];
    if (inputc) {
        matched_cities = citiesList.filter((item) => {
            return item.startsWith(input_uc);
        });
        console.log("matched cities: " + matched_cities);
        searchCity.setAttribute('class', "show");

        $("#cities-list").html("");
        for (let i = 0; i < matched_cities.length; i++) {
            let city = matched_cities[i];
            $("#cities-list").append(`<li id="cities_${i}">${city}</li>`);
            // set event listener when click in the city to change weather location displayed
            $("#cities_" + i).on('click', () => {
                console.log(city);
                // render now weather
                $('#city-now').html(city + ", " + countryNow + ". ");
                $('#state-now').text("");
                $("#cities-list").text("");
                $("#match-list").text("");
                search.value = "";
                searchCity.value = "";
                searchCity.setAttribute('class', 'hidden');
                console.log(code);



                x = -1;
                cityAsked = (city);
                //cityAsked = cityAsked.split(" ").join("&nbsp");//might be necessary if API changes
                console.log(`cityAsked: ${cityAsked}`);
                createHistory();
                header.setAttribute('class', 'opacityLoading header flex-horizontal');
                main.setAttribute('class', 'opacityLoading mainbody');
                loader.setAttribute('class', "show");
                getLongitudeLatitude();

            });
        }
    }
}


function getLongitudeLatitude() {

    latLongLink = (`https://api.openweathermap.org/geo/1.0/direct?q=${cityAsked},${code}&limit=1&appid=4dd7b444d35c5781eda9fee4131ca26d`);
    console.log(`Testing latLongLink: ${latLongLink}`);

    console.log("z:" + z);

    if (z <= -7) {
        //alert(`Unable to find your city, please choose another city!`);
        header.setAttribute('class', 'header flex-horizontal');
        main.setAttribute('class', 'mainbody');
        loader.setAttribute('class', "hidden");
        z = -1;

        return;
    }

    fetch(latLongLink)


        .then(response => response.json())

        .then((coordinates) => {


            coordinatesNow = coordinates[0];
            if (coordinatesNow.country === code) {
                console.log(coordinatesNow);
                latitudeAsked = coordinatesNow.lat;
                longitudeAsked = coordinatesNow.lon;

                const myJSON = JSON.stringify(coordinates);

                console.log("Coordinates JSON:" + myJSON);

                z = -1;
                header.setAttribute('class', 'header flex-horizontal');
                main.setAttribute('class', 'mainbody');
                loader.setAttribute('class', "hidden");
                getTime();
                showWeather();
                return;
            } else {
                console.log(`Unable to display coordinates`);
                $('#temp-now').text("Error to get coordinates!");
                z--;
                getLongitudeLatitude();
            }
        })

        .catch((error) => {
            console.log(`Unable to display coordinates`);
            console.log("Didn't find your coordinates");
            $('#temp-now').text("Error to get coordinates!");

            z--;
            getLongitudeLatitude();

        });


}

// get time from choosen city
var q = -1;
var timeLink;
function getTime() {
    //timeLink = (`http://api.geonames.org/timezoneJSON?lat=${latitudeAsked}&lng=${longitudeAsked}&username=cdennis27`);
    //console.log(`Testing timeLink: ${timeLink}`);

    timeLink = (`https://api.timezonedb.com/v2.1/get-time-zone?key=2562DLSB4X6P&format=json&by=position&lat=${latitudeAsked}&lng=${longitudeAsked}`);
    console.log(`Testing timeLink: ${timeLink}`);

    console.log("q:" + q);

    if (q <= -7) {
        //alert(`Unable to find your city, please choose another city!`);
        header.setAttribute('class', 'header flex-horizontal');
        main.setAttribute('class', 'mainbody');
        loader.setAttribute('class', "hidden");
        q = -1;
        $('#date').text(`Unable to get the local time!`);
        return;
    }

    fetch(timeLink)


        .then(response => response.json())

        .then((timeHere) => {



            if (timeHere.countryCode === code) {

                timeWhere = timeHere.formatted;
                console.log(`Time in this city: ${timeWhere}`);

                q = -1;
                header.setAttribute('class', 'header flex-horizontal');
                main.setAttribute('class', 'mainbody');
                loader.setAttribute('class', "hidden");
                convertTime();

                $('#date').text(`${timeWhere}`);

                timeWhere = timeWhere.split('');

                console.log(`Time splitted: ${timeWhere}`);

                console.log(timeWhere);
                const myJSON = JSON.stringify(timeWhere);
                console.log("Time JSON:" + myJSON);
                return;
            } else {
                console.log(`Unable to display this city time and date`);
                $('#temp-now').text("Error to get time and date in this city!");
                q--;
                getTime();
            }
        })

        .catch((error) => {
            console.log(`Unable to display time in this city`);
            $('#temp-now').text("Error to get coordinates!");
            q--;
            getTime();

        });

}
var dateFiveDay;
const convertTime = () => {

    let time = timeWhere;

    var year = time[0] + time[1] + time[2] + time[3];
    var month = time[5] + time[6];
    var day = time[8] + time[9];
    var hour = time[11] + time[12];
    var minute = time[14] + time[15];

    if (month == 1) {
        month = "Jan";
    } else if (month == 2) {
        month = "Feb";
    } else if (month == 3) {
        month = "Mar";
    } else if (month == 4) {
        month = "Apr";
    } else if (month == 5) {
        month = "May";
    } else if (month == 6) {
        month = "Jun";
    } else if (month == 7) {
        month = "Jul";
    } else if (month == 8) {
        month = "Aug";
    } else if (month == 9) {
        month = "Sep";
    } else if (month == 10) {
        month = "Oct";
    } else if (month == 11) {
        month = "Nov";
    } else if (month == 12) {
        month = "Dec";
    };
    console.log(month);

    time = (month + " " + day + ", " + year + " " + hour + ":" + minute);
    dateFiveDay = (month + " " + day + ", " + year);
    timeWhere = time;
    return;
};

// create local data for shortcut buttons
var repeatCity;
var repeatCode;
function createHistory() {
    let length;
    savedTowns = JSON.parse(localStorage.getItem("savedTowns"));
    repeatCity = undefined;
    repeatCode = undefined;
    //debugger;
    if (savedTowns == null || savedTowns == undefined) {
        savedTowns = { "city": [cityAsked], "code": [code] };
        length = 0;
        localStorage.setItem("savedTowns", JSON.stringify(savedTowns));

        console.log(savedTowns);
        renderHistory();
        return;
    } else {
        length = savedTowns.city.length;

        console.log(`city: ${cityAsked} code: ${code}`);
        //possible bug will be fixed soon adding for loop to fix
        repeatCity = savedTowns.city.filter(item => item == cityAsked);

        repeatCode = savedTowns.code.filter(item => item == code);


        console.log(repeatCity);
        if (repeatCity[0] == cityAsked && repeatCode[0] == code) {
            return;
        }
    };

    if (length < 20 && length > 0) {
        let i = (length);
        //savedTowns.city[i] = cityAsked;
        //savedTowns.code[i] = code;

        //savedTowns.city.splice(i, 1);
        savedTowns.city.unshift(cityAsked);
        savedTowns.code.unshift(code);

        //savedTowns[i] = {"city":[cityAsked], "code":[code]};

        localStorage.setItem("savedTowns", JSON.stringify(savedTowns));

        console.log(savedTowns);
        renderHistory();

    } else if (length >= 20) {
        savedTowns.city.pop();
        savedTowns.code.pop();
        savedTowns.city.unshift(cityAsked);
        savedTowns.code.unshift(code);
        localStorage.setItem("savedTowns", JSON.stringify(savedTowns));

        console.log(savedTowns);
        renderHistory();
    };


};

function renderHistory() {
    //savedTowns.push({city:[city], code:[code]});
    //savedTowns = JSON.parse(localStorage.getItem("savedTowns"));
    let length = 0;

    savedTowns = JSON.parse(localStorage.getItem("savedTowns"));
    $(".historic-buttons").html("");
    if (savedTowns != null || savedTowns != undefined) {
        length = savedTowns.city.length;

        console.log(savedTowns);
        console.log(savedTowns.city[0]);
        console.log(savedTowns.code[0]);
    };

    if (savedTowns == null || savedTowns == undefined) {
        return;
    }
    if (length > 0) {
        for (let i = 0; i < savedTowns.city.length; i++) {

            let city = savedTowns.city[i];
            let codeTemp = savedTowns.code[i];

            $(".historic-buttons").append(`<li id="short_${i}">${city},${codeTemp}</li>`);

            $("#short_" + i).on('click', () => {


                cityAsked = savedTowns.city[i];

                code = savedTowns.code[i];
                console.log(`city: ${city}, code: ${code}`);

                // render now weather
                $('#city-now').text(city + ", " + code + ". ");
                $('#state-now').text("");

                $("#cities-list").text("");
                $("#match-list").text("");
                search.value = "";
                searchCity.value = "";
                searchCity.setAttribute('class', 'hidden');
                //debugger;
                x = -1;
                cityAsked = (city);
                //cityAsked = cityAsked.split(" ").join("&nbsp");//might be necessary if API changes
                console.log(`cityAsked: ${cityAsked}`);

                header.setAttribute('class', 'opacityLoading header flex-horizontal');
                main.setAttribute('class', 'opacityLoading mainbody');
                loader.setAttribute('class', "show");
                getLongitudeLatitude();

            });
        }
    }
};

function clearHistory() {

    search.value = "";
    searchCity.value = "";
    searchCity.setAttribute('class', 'hidden');
    localStorage.removeItem("savedTowns");
    renderHistory();
};













