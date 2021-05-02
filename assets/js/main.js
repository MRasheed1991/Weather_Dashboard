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

const onSubmit = async (event) => {
  event.preventDefault();

  const cityName = $("#city-input").val();

  const cities = getFromLocalStorage();

  cities.push(cityName);

  localStorage.setItem("cities", JSON.stringify(cities));

  renderCitiesFromLocalStorage();

  $("#city-input").val();

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
  const data = await fetchData(url);
  console.log(data);
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

  const getDataByCityName = (event) => {
    const target = $(event.target);
    if (target.is("li")) {
      const cityName = target.data("city");
      fetchData(cityName);
    }
  };
  ul.on("click", getDataByCityName);
  $("#searched-cities").append(ul);
};

const onReady = () => {
  renderCitiesFromLocalStorage();
};

$("#city-search-form").on("submit", onSubmit);

$(document).ready(onReady);
