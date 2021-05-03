const API_KEY = "1ee85ea8692be659f9b1289df6f6242a";
const getFromLocalStorage = () => {
  const localStorageData = JSON.parse(localStorage.getItem("cities"));
  if (localStorageData === null) {
    return [];
  } else {
    return localStorageData;
  }
};
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const transformData = (data) => {
  return {
    cityName: data.name,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    date: moment.unix(data.dt).format("MM/DD/YYYY"),
    iconURL: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  };
};

const onSubmit = async (event) => {
  event.preventDefault();

  const cityName = $("#city-input").val();

  const cities = getFromLocalStorage();

  cities.push(cityName);

  localStorage.setItem("cities", JSON.stringify(cities));

  renderCitiesFromLocalStorage();

  $("#city-input").val("");

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`;
  const data = await fetchData(url);

  const currentDayData = transformData(data);

  renderCurrentDayCard(currentDayData);

  console.log(data);
  console.log(currentDayData);
};

const renderCitiesFromLocalStorage = () => {
  $("#searched-cities").empty();
  const cities = getFromLocalStorage();

  const ul = $("<ul>").addClass("list-group");

  const appendListItemToUl = (city) => {
    const li = $("<li>")
      .addClass("list-group-item")
      .attr("data-city", city)
      .text(city);

    ul.append(li);
  };
  cities.forEach(appendListItemToUl);

  const getDataByCityName = async (event) => {
    const target = $(event.target);
    if (target.is("li")) {
      const cityName = target.data("city");

      const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imprerial&appid=${API_KEY}`;

      const data = await fetchData(url);

      const currentDayData = transformData(data);

      renderCurrentDayCard(currentDayData);

      console.log(data);
    }
  };
  ul.on("click", getDataByCityName);
  $("#searched-cities").append(ul);
};

const renderCurrentDayCard = (data) => {
  $("#current-day").empty();
  const card = `<div class="card current-day">
      <div class="card-body">
        <h2 class="card-title">
          ${data.cityName}(${data.date})<img src="${data.iconURL}"/>
         
        </h2>
        <div class="py-2">Temperature:${data.temperature}&degF</div>
        <div class="card-text py-2">Humidity: ${data.humidity}%</div>
        <div class="py-2">Wing Speed: ${data.windSpeed} MPH</div>
        <div class="py-2">UV Index:</div>
      </div>
    </div>`;

  $("#current-day").append(card);
};

const onReady = () => {
  renderCitiesFromLocalStorage();
};

$("#city-search-form").on("submit", onSubmit);

$(document).ready(onReady);
