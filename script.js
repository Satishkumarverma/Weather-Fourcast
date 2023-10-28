const inputText = document.querySelector(".input_box");
const submitButton = document.querySelector(".submit_button");
const locationButton = document.querySelector(".current_button");
const weatherCarddiv = document.querySelector(".list-group");
const currentWeatherdiv = document.querySelector(".col-8");
const API_key = "----"; //Get your API key from "https://openweathermap.org/" and enter here.

const createweathercard = (cityName, weatherItem, index) => {
	const weatherDate = new Date(`${weatherItem.dt_txt.split(" ")[0]}`);
	const day = weatherDate.getDay();
	const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	dates = dayNames[day]
	if (index === 0) {
		return `<div class="row container bg-primary text-light rounded mt-3 mb-3 mx-1 p-3" style="cursor: pointer">
	    <div class="col-8">
	    <h2 class="my-2"><i class="fa-solid fa-location-dot fa-sm me-1"></i>${cityName}</h2>
		<h6>${dates} (${weatherItem.dt_txt.split(" ")[0]})</h6>
	    <h5 class="my-2"><i class="fa-solid fa-temperature-half fa-sm me-1"></i>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h5>
	    <h5 class="my-2"><i class="fa-solid fa-wind fa-xs me-1"></i>Wind Speed: ${weatherItem.wind.speed} M/S</h5>
	    <h5 class="my-2"><i class="fa-solid fa-droplet fa-xs me-1"></i>Humidity: ${weatherItem.main.humidity}%</h5>
     </div>
     <div class="col-4 text-center">
        <img  src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" style="width: 180px; height: 160px; margin-top: -20px;" alt="weather icon">
        <h6 style="margin-top: -30px;">${weatherItem.weather[0].description}</h6>
     </div>
     </div>`;
	} else {
		return `<li class="list-group-item mx-1 rounded bg-dark-subtle text-dark text-center">
		<h6>${dates}</h6>
		<h6>${weatherItem.dt_txt.split(" ")[0]}</h6>
		<img class="pt-3" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" style="width: 65px; height: 75px; margin-top: -18px;" alt="weather icon">
		<h6 style="font-size: xx-small; margin-top: -12px;">${weatherItem.weather[0].description}</h6>
		<h6><i class="fa-solid fa-temperature-half fa-sm me-1"></i>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h6>
		<h6><i class="fa-solid fa-wind fa-xs me-1"></i>Wind: ${weatherItem.wind.speed} M/S</h6>
		<h6><i class="fa-solid fa-droplet fa-xs me-1"></i>Humidity: ${weatherItem.main.humidity}%</h6>
	  </li>`;
	}
}

const getweatherDetails = (cityName, lat, lon) => {
	const weather_API = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
	fetch(weather_API).then(response => response.json()).then(value => {

		const uniqueForcastday = [];
		const fiveDayforcast = value.list.filter(forcast => {
			const forcastDate = new Date(forcast.dt_txt).getDate();
			if (!uniqueForcastday.includes(forcastDate)) {
				return uniqueForcastday.push(forcastDate)
			}
		})
		inputText.value = "";
		weatherCarddiv.innerHTML = "";
		currentWeatherdiv.innerHTML = "";
		console.log(fiveDayforcast)
		fiveDayforcast.forEach((weatherItem, index) => {
			if (index === 0) {
				currentWeatherdiv.insertAdjacentHTML("beforeend", createweathercard(cityName, weatherItem, index));
			} else {
				weatherCarddiv.insertAdjacentHTML("beforeend", createweathercard(cityName, weatherItem, index));
			}
		});
	}).catch(() => {
		alert("error while fetching an location");
	})
}
const getlocation = () => {
	let cityName = inputText.value.trim();
	if (!cityName) return;
	console.log(cityName)
	const Geocoding_API = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;
	fetch(Geocoding_API).then(response => response.json()).then(value => {
		if (!value.length) return alert(`No data found for ${cityName}`)
		console.log(value)
		const { name, lat, lon } = value[0]
		getweatherDetails(name, lat, lon);
	}).catch(() => {
		alert("error while fetching an location");
	})
}

const getuselocation = () => {
	navigator.geolocation.getCurrentPosition(
		position => {
			const { latitude, longitude } = position.coords;
			const REVERSE_Geocoding_API = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;
			fetch(REVERSE_Geocoding_API).then(response => response.json()).then(value => {
				const { name } = value[0]
				getweatherDetails(name, latitude, longitude);
			}).catch(() => {
				alert("error while fetching an user location");
			})
		}, error => {
			if (error.code === error.PERMISSION_DENIED)
				alert("Geolocation request denide")
		}
	);
}
submitButton.addEventListener("click", getlocation);
locationButton.addEventListener("click", getuselocation);

