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
const searchCity = document.querySelector('#search-cities');
$(searchCity).on('input', function (element) {
    filterCityNames(element.target.value);
});




showInit();

async function showInit() {

    //arrow function for demonstration purposes of other method for function

    await showCity();
    await sleep(2000);
    showWeather();

}
//showWeather();

$('#date').text(today.format('hh : mm a. MMM D, YYYY.'));

addUnit.addEventListener("click", addedUnit);

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

function showWeather() {
    //showLoader();
    weatherLink = (`https://api.openweathermap.org/data/2.5/forecast?q=${cityAsked}&mode=json&units=metric&appid=4dd7b444d35c5781eda9fee4131ca26d`);
    console.log("weatherLink here: " + weatherLink);
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
                $('#temp-now').text(weatherNow.list[0].main.temp.toFixed(0)
                    + "°C");
                $('#wind-now').text("Wind speed: " + weatherNow.list[0].wind.speed.toFixed(0)
                    + "m/s");
                $('#humidity-now').text("Humidity: " + weatherNow.list[0].main.humidity.toFixed(0)
                    + "%");
                $('#visibility-now').text("Visibility: " + weatherNow.list[0].visibility.toFixed(0)
                    + "m");
                $('#precipitation-now').text("Precipitation: " + weatherNow.list[0].pop.toFixed(0)
                    + "mm");
                const myJSON = JSON.stringify(weatherNow);
                console.log('Weather first function: ' + weatherNow.list[0].main.temp);
                console.log("Weather JSON:" + myJSON);
                //hideLoader();


                header.setAttribute('class', 'header flex-horizontal');
                main.setAttribute('class', 'mainbody');
                loader.setAttribute('class', "hidden");
                return;
            }
        })

        .catch((error) => {
            console.log(`Unable to display weather`);
            console.log("Didn't find your weather");
            $('#temp-now').text("Select a city!");
            //$('#stateNow').text("Ontario, ");
            //$('#exampleModal1').foundation('open');
            x--;
            showInit();

        });
    console.log(weatherLink);
    console.log("WeatherNow end:" + weatherNow);

}

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

// Delay function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
    console.log(unit);
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
    console.log(unit);
}

console.log(weatherLink);
console.log("WeatherNow end:" + weatherNow);
initUnit();

//Search cities.js


$(document).ready(function () {
    console.log($(countries));
    collectCountries();
    $(search).on('input', function (element) {
        filterCountriesNames(element.target.value);
    });
});


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
        height: '300px'
    }, "fast");
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

    $(matchList).html(`<div>${country}:</div><button id="search-btn" placeholder="Choose city">Search</button><ul class="cities-list" id="cities-list"></ul>`);

    // Load list

    citiesList = [];
    citiesList = (countries[country]);
    console.log(citiesList);
    countryNow = country;

    console.log("Country is:" + country);

    for (let i = 0; i < countries[country].length; i++) {
        let city = countries[country][i];
        $("#cities-list").append(`<li id="cities_${i}">${city}</li>`);
        //$("#my-input").val(country);
        $("#cities_" + i).on('click', () => {
            $('#search-btn').text(city);
            console.log(city);
        });
    }
    searchCity.classList.remove('hidden');
}



function filterCityNames(inputc) {

    //let inputc = searchCity.value;

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
                //$("#cities-list").html("");
                x = -1;
                cityAsked = (city);
                cityAsked = cityAsked.split(" ").join("&nbsp");


                cityAsked = city;

                
                header.setAttribute('class', 'opacityLoading header flex-horizontal');
                main.setAttribute('class', 'opacityLoading mainbody');
                loader.setAttribute('class', "show");
                showWeather();
            });
        }

        //showAutocomplete(matched_items);
    }
}

















