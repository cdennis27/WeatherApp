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
const searchBtn = document.querySelector('#search-btn');
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

// Functions on load:
showInit();

initUnit();

// Event Listeners

$('#date').text(today.format('hh : mm a. MMM D, YYYY.'));

addUnit.addEventListener("click", addedUnit);

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
                $('#search-btn').text(locationNow.city);

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
            //$('#exampleModal1').foundation('open');
            return;
        });

}

//Fetch weather info and display it

function showWeather() {
    weatherLink = (`https://api.openweathermap.org/data/2.5/forecast?lat=${latitudeAsked}&lon=${longitudeAsked}&appid=4dd7b444d35c5781eda9fee4131ca26d&units=${unit}`);
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
            if (weatherNow.cod === "200") {
                console.log(weatherNow);
                if (unit == "metric") {
                    $('#temp-now').text(weatherNow.list[0].main.temp.toFixed(0)
                        + "°C");
                }
                else if (unit == "imperial") {
                    $('#temp-now').text(weatherNow.list[0].main.temp.toFixed(0)
                        + "°F");
                };
                if (unit == "metric") {
                    $('#wind-now').text("Wind speed: " + (weatherNow.list[0].wind.speed.toFixed(4) * 3.6).toFixed(2)
                        + " KM/H");
                }
                else if (unit == "imperial") {
                    $('#wind-now').text("Wind speed: " + weatherNow.list[0].wind.speed.toFixed(2)
                        + " MP/H");
                };

                $('#humidity-now').text("Humidity: " + weatherNow.list[0].main.humidity.toFixed(0)
                    + "%");

                if (unit == "metric") {
                    $('#visibility-now').text("Visibility: " + weatherNow.list[0].visibility.toFixed(0)
                        + " Meters");
                }
                else if (unit == "imperial") {
                    $('#visibility-now').text("Visibility: " + (weatherNow.list[0].visibility.toFixed(0) * 3.28084).toFixed(0)
                        + " Feet");
                };

                if (unit == "metric") {
                    $('#precipitation-now').text("Precipitation: " + weatherNow.list[0].pop.toFixed(0)
                        + " mm");
                }
                else if (unit == "imperial") {
                    $('#precipitation-now').text("Precipitation: " + (weatherNow.list[0].pop.toFixed(0) * 0.0393701).toFixed(2)
                        + " inches");
                };

                $('#iconNow').html(`<img src="assets/icons/${weatherNow.list[0].weather[0].icon}.png" alt="Weather icon">`);
                console.log(weatherNow.list[0].weather[0].icon);


                const myJSON = JSON.stringify(weatherNow);
                console.log('Weather first function: ' + weatherNow.list[0].main.temp);
                console.log('Weather first function: ' + weatherNow.list[1].main.temp);
                console.log('Weather first function: ' + weatherNow.list[2].main.temp);
                console.log('Weather first function: ' + weatherNow.list[3].main.temp);
                console.log('Weather first function: ' + weatherNow.list[4].main.temp);
                console.log('Weather first function: ' + weatherNow.list[5].main.temp);
                console.log('Weather first function: ' + weatherNow.list[6].main.temp);
                console.log('Weather first function: ' + weatherNow.list[7].main.temp);



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
        /*btnUnit.setAttribute("class", "slider btn-metric");*/
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
        // Change the case of letters to 'Abc' mode
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
    // Visual structure

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

    //capitalize above
    code = (codes[countryNow]);
    citiesList = [];
    citiesList = (countries[countryNow]);
    console.log(citiesList);
    console.log("Code is:" + code + "Country is: " + countryNow);
    /*
        for (let i = 0; i < countries[country].length; i++) {
            let city = countries[country][i];
            $("#cities-list").append(`<li id="cities_${i}">${city}</li>`);
            //$("#my-input").val(country);
            $("#cities_" + i).on('click', () => {
                $('#search-btn').text(city);
                console.log(city);
            });
        }*/
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

        ///
        $("#cities-list").html("");
        $('#search-btn').text("Choose a city");
        for (let i = 0; i < matched_cities.length; i++) {
            let city = matched_cities[i];
            $("#cities-list").append(`<li id="cities_${i}">${city}</li>`);
            //$("#my-input").val(country);
            $("#cities_" + i).on('click', () => {
                $('#search-btn').text(city);
                console.log(city);
                ///// add function to fetch in here!!!!!!!
                $('#city-now').text(city + ", " + countryNow + ", ");
                $('#state-now').text("");
                $('#search-btn').text(city);
                $("#cities-list").text("");
                $("#match-list").text("");
                $(search).text("");
                $(searchCity).text("");
                x = -1;
                cityAsked = (city);
                //cityAsked = cityAsked.split(" ").join("&nbsp");

                console.log(`cityAsked: ${cityAsked}`);


                //cityAsked = city;


                header.setAttribute('class', 'opacityLoading header flex-horizontal');
                main.setAttribute('class', 'opacityLoading mainbody');
                loader.setAttribute('class', "show");
                getLongitudeLatitude();
                //showWeather();
            });
        }

        //showAutocomplete(matched_items);
    }
}


function getLongitudeLatitude() {


    latLongLink = (`https://api.openweathermap.org/geo/1.0/direct?q=${cityAsked},${code}&limit=1&appid=4dd7b444d35c5781eda9fee4131ca26d`);
    console.log(`Testing latLongLink: ${latLongLink}`);


    //weatherLink = (`https://api.openweathermap.org/data/2.5/forecast?q=${cityAsked}&mode=json&units=metric&appid=4dd7b444d35c5781eda9fee4131ca26d`);
    //console.log("weatherLink here: " + weatherLink);
    console.log("z:" + z);

    if (z <= -7) {
        alert(`Unable to find your city, please choose another city!`);
        header.setAttribute('class', 'header flex-horizontal');
        main.setAttribute('class', 'mainbody');
        loader.setAttribute('class', "hidden");
        z = -1;

        return;
    }

    fetch(latLongLink)


        .then(response => response.json())

        .then((coordinates) => {
            console.log(`coordinates: ${coordinates}`);
            //debugger;
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

















