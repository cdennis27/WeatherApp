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
            alert(`Unable to find your city, please choose your city!`);
            console.log("Didn't find your city");
            $('#city-now').text("Toronto, ");
            $('#state-now').text("Ontario, ");
            //$('#exampleModal1').foundation('open');
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

//Search cities.json
const searchStates = async searchText => {
    const response = await fetch('./assets/js/cities.json');
    const states = await response.json();

    console.log(states);
}

search.addEventListener('input', () => searchStates(search.value));



