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



showInit();

async function showInit() {

    //arrow function for demonstration purposes of other method for function

    await showDate();
    await sleep(2000);
    showWeather();

}
//showWeather();

$('#date').text(today.format('hh : mm a. MMM D, YYYY.'));

addUnit.addEventListener("click", addedUnit);

function showLoader() {
    header.classList.add('hidden');
    //loader.classList.remove('hidden');
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

            if (weatherNow.cod === "200") {
                console.log(weatherNow);
                $('#tempNow').text("Now: " + weatherNow.list[0].main.temp.toFixed(0)
                    + "°C");
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
            $('#tempNow').text("Select a city!");
            //$('#stateNow').text("Ontario, ");
            //$('#exampleModal1').foundation('open');
            x--;
            showInit();

        });
    console.log(weatherLink);
    console.log("WeatherNow end:" + weatherNow);

}

function showDate() {
    //showLoader();
    fetch("https://geolocation-db.com/json/")
        .then(response => response.json())
        .then((locationNow) => {

            console.log(locationNow);
            console.log('City is: ' + locationNow.city);

            if (locationNow != undefined) {

                console.log('This is your city: ' + locationNow.city);
                $('#cityNow').text(locationNow.city + ", ");
                $('#stateNow').text(locationNow.state + ", ");

                cityAsked = (locationNow.city);
                //cityAsked = cityAsked.split(" ").join("&nbsp");
                return;
            }
            else if (locationNow.city == undefined) {
                $('#cityNow').text("Toronto, ");
                $('#stateNow').text("Ontario, ");
                console.log("Didn't find your city" + locationNow.city);
            }


        })
        .catch((error) => {
            alert(`Unable to find your city, please choose your city!`);
            console.log("Didn't find your city");
            $('#cityNow').text("Toronto, ");
            $('#stateNow').text("Ontario, ");
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
        btnUnit.classList.remove('btnMetric');
        btnUnit.classList.add('btnImperial');
        localStorage.setItem("unit", unit);
    } else if (unit == "imperial") {
        unit = "metric";
        btnUnit.classList.add('btnMetric');
        btnUnit.classList.remove('btnImperial');
        /*btnUnit.setAttribute("class", "slider btnMetric");*/
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
        btnUnit.classList.add('btnMetric');
    } else if (unit == "metric") {
        btnUnit.classList.add('btnMetric');

    } else {
        btnUnit.classList.add('btnImperial');

    }
    console.log(unit);
}

console.log(weatherLink);
console.log("WeatherNow end:" + weatherNow);
initUnit();