const form = document.querySelector("form");
const myLocation = document.querySelector(".my-find-location button");
let locationName = document.querySelector('.location-name h3')

const url = "https://api.weatherapi.com/v1";
const fileForecastFormat = "/forecast.json";
const fileCurrentFormat = "/current.json";
const fileTimeZoneFormat = "/timezone.json";
const fileSearchFormat = "/search.json";
const apiKey = "1de06f08943d497b85720411231201";

function sendHttpRequest(weatherUrl, fileformat, weatherApiKey, requestCity) {
    const responseData = `${weatherUrl + fileformat
        }?key=${weatherApiKey}&q=${requestCity}&days=14&aqi=no&alerts=no&lang=tr`;

    return fetch(responseData)
        .then((response) => {
            if (response.status >= 200 && response.status <= 300) {
                return response.json();
            } else {
                return response.json().then((errData) => {
                    console.log(errData);
                    throw new Error("Something went wrong - server-side.");
                });
            }
        })
        .catch((error) => {
            console.log(errData);
            throw new Error("Something went wrong!");
        });
}

async function fetchWeather(fileformat, userEnteredCity) {
    try {
        const weatherResponseData = await sendHttpRequest(
            url,
            fileformat,
            apiKey,
            userEnteredCity
        );
        tableInvisible();
        console.log(weatherResponseData);
        return fileformat == fileForecastFormat ? weatherForecastScreen(weatherResponseData) : weatherTimeZoneScreen(weatherResponseData);
    } catch (error) {
        alert(error.message);
    }
}

const weatherTimeZoneScreen = (weatherData) => {
    console.log(weatherData);

}

const weatherForecastScreen = (weatherData) => {
    const listInWeather = weatherData.forecast.forecastday;
    document.querySelector("tbody").innerHTML = "";
    let weatherOtherDay = document.querySelector(".other-days tbody");
    let weatherToday = document.querySelector(".today tbody");
    locationName.innerHTML = (weatherData.location.name + " " + weatherData.location.country);
    for (const weather in listInWeather) {

        const weekday = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
        let date = weatherData.forecast.forecastday[weather].date
        let day = weekday[new Date(`${weatherData.forecast.forecastday[weather].date}`).getDay()];

        let icon = listInWeather[weather].day.condition.icon;



        let weatherElOtherDay = `<tr>
        <th scope="row"> ${date} ${day}</th>
        <td>${listInWeather[weather].day.condition.text}</td>
        <td><img src="${'assets/images/weather-img' + icon.substring(icon.indexOf("/64x64"))}"></td>
        <td>${listInWeather[weather].day.avgtemp_c}<sup>o</sup>C</td>
            </tr>`
        // console.log(listInWeather.forecast.forecastday[weather + 1].day.avgtemp_c);
        weatherOtherDay.insertAdjacentHTML("beforebegin", weatherElOtherDay);

    }
    let icon = weatherData.current.condition.icon;
    let weatherElToday = `<tr>
    <th scope="row">Şimdi</th>
    <td>${weatherData.current.condition.text}</td>
    <td><img src="${'assets/images/weather-img' + icon.substring(icon.indexOf("/64x64"))}"></td>
    <td>${weatherData.current.feelslike_c}<sup>o</sup>C</td>
    </tr>`
    weatherToday.insertAdjacentHTML("beforebegin", weatherElToday);

    for (const weatherHours in listInWeather[0].hour) {
        let weatherHour = document.querySelector(".hours tbody");
        let hour = weatherData.forecast.forecastday[0].hour[weatherHours].time;
        let icon = listInWeather[0].hour[weatherHours].condition.icon;
        let text = listInWeather[0].hour[weatherHours].condition.text
        let degree = listInWeather[0].hour[weatherHours].temp_c;

        let weatherElHours = `<tr>
        <th scope="row"> ${hour}</th>
        <td>${text}</td>
        <td><img src="${'assets/images/weather-img' + icon.substring(icon.indexOf("/64x64"))}"></td>
        <td>${degree}<sup>o</sup>C</td>
            </tr>`

        weatherHour.insertAdjacentHTML("beforebegin", weatherElHours);
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const enteredCity = event.currentTarget.querySelector("#tags").value;
    //   console.log(enteredCity);
    fetchWeather(fileForecastFormat, enteredCity);
});

const getPosition = (opts) => {
    const promise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (success) => {
                resolve(success);
            },
            (error) => {
                reject(error);
            },
            opts
        );
    });
    return promise;
};

async function trackUserHandler() {
    let posData;
    try {
        posData = await getPosition();
    } catch (error) {
        console.log(error);
    }
    fetchWeather(
        fileForecastFormat,
        posData.coords.latitude + "," + posData.coords.longitude
    );

    //   console.log(posData.coords.latitude + "," + posData.coords.longitude);
}

const tableInvisible = () => {
    document.querySelector('.weather-table').classList.remove('invisible')
};

myLocation.addEventListener("click", trackUserHandler);

$(function () {
    var availableTags = [
        "ADANA",
        "ADIYAMAN",
        "AFYONKARAHİSAR",
        "AĞRI",
        "AMASYA",
        "ANKARA",
        "ANTALYA",
        "ARTVİN",
        "AYDIN",
        "BALIKESİR",
        "BİLECİKK",
        "BİNGÖL",
        "BİTLİS",
        "BOLU",
        "BURDUR",
        "BURSA",
        "ÇANAKKALE",
        "ÇANKIRI",
        "ÇORUM",
        "DENİZLİ",
        "DİYARBAKIR",
        "EDİRNE",
        "ELAZIĞ",
        "ERZİNCAN",
        "ERZURUM",
        "ESKİŞEHİR",
        "GAZİANTEP",
        "GİRESUN",
        "GÜMÜŞHANE",
        "HAKKARİ",
        "HATAY",
        "ISPARTA",
        "MERSİN",
        "İSTANBUL",
        "İZMİR",
        "KARS",
        "KASTAMONU",
        "KAYSERİ",
        "KIRKLARELİ",
        "KIRŞEHİR",
        "KOCAELİ",
        "KONYA",
        "KÜTAHYA",
        "MALATYA",
        "MANİSA",
        "KAHRAMANMARAŞ",
        "MARDİN",
        "MUĞLA",
        "MUŞ",
        "NEVŞEHİR",
        "NİĞDE",
        "ORDU",
        "RİZE",
        "SAKARYA",
        "SAMSUN",
        "SİİRT",
        "SİNOP",
        "SİVAS",
        "TEKİRDAĞ",
        "TOKAT",
        "TRABZON",
        "TUNCELİ",
        "ŞANLIURFA",
        "UŞAK",
        "VAN",
        "YOZGAT",
        "ZONGULDAK",
        "AKSARAY",
        "BAYBURT",
        "KARAMAN",
        "KIRIKKALE",
        "BATMAN",
        "ŞIRNAK",
        "BARTIN",
        "ARDAHAN",
        "IĞDIR",
        "YALOVA",
        "KARABüK",
        "KİLİS",
        "OSMANİYE",
        "DÜZCE"
    ];
    $("#tags").autocomplete({
        source: availableTags,
    });
});
