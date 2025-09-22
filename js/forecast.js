const iconsName = {
  0: ["qi-sunny", "Sereno"],
  1: ["qi-few-clouds", "Quasi sereno"],
  2: ["qi-cloudy", "Poco nuvoloso"],
  3: ["qi-overcast", "Nuvoloso"],
  45: ["qi-heavy-fog-warning", "Nebbia"],
  48: ["qi-frost", "Nebbia ghiacciata"],
  51: ["qi-drizzle-rain", "Debole pioviggine"],
  53: ["qi-drizzle-rain", "Pioviggine"],
  55: ["qi-drizzle-rain", "Pioviggine intensa"],
  56: ["qi-drizzle-rain", "Pioviggine ghiacciata"],
  57: ["qi-drizzle-rain", "Pioviggine ghiacciata"],
  61: ["qi-light-rain", "Pioggia debole"],
  63: ["qi-moderate-rain", "Pioggia"],
  65: ["qi-heavy-rain", "Pioggia intensa"],
  66: ["qi-freezing-rain", "Pioggia ghiacciata"],
  67: ["qi-freezing-rain", "Pioggia ghiacciata"],
  71: ["qi-light-snow", "Neve debole"],
  73: ["qi-moderate-snow", "Neve"],
  75: ["qi-heavy-snow", "Neve intensa"],
  77: ["qi-snow-flurry", "Nevischio"],
  80: ["qi-shower-rain", "Deboli rovesci di pioggia"],
  81: ["qi-shower-rain", "Rovesci di pioggia"],
  82: ["qi-heavy-shower-rain", "Rovesci di pioggia"],
  85: ["qi-snow-flurry", "Neve"],
  86: ["qi-snow-flurry", "Neve intensa"],
  95: ["qi-heavy-thunderstorm", "Temporale"],
  96: ["qi-thundershower-with-hail", "Temporale e grandine"],
  99: ["qi-thundershower-with-hail", "Temporale e grandine"],
};

window.addEventListener("load", () => {
  const base = `https://api.open-meteo.com/v1/forecast?`;
  let api =
    base +
    // `latitude=46.45&longitude=12.38&minutely_15=precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum,windspeed_10m_max,windgusts_10m_max&timezone=Europe%2FBerlin
    //`;
    `latitude=46.45&longitude=12.38&current=precipitation&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum,wind_speed_10m_max,wind_gusts_10m_max&timezone=Europe%2FBerlin`;
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showWeather(data);
    });
});

function showWeather(data) {
  console.log(data);
  data.daily.time.forEach((day, i) => {
    if (i < 5) {
      const giorno = new Date(day).toLocaleDateString("it-IT", {
        weekday: "long",
      });
      const giornoMaiusc = giorno.charAt(0).toUpperCase() + giorno.slice(1);

      let tableDay = document.getElementById("table-days");
      let tableForecast = document.getElementById("table-forecast");
      let tableTemp = document.getElementById("table-temp");
      let tableWind = document.getElementById("table-wind");
      let tablePrec = document.getElementById("table-prec");

      tableDay.innerHTML += `<div class="table-cell p-2">${giornoMaiusc}</div>`;
      tableForecast.innerHTML += `<div class="table-cell p-2"><i class="${
        iconsName[data.daily.weather_code[i]][0]
      } text-lg"></i><br>${iconsName[data.daily.weather_code[i]][1]}</div>`;
      tableTemp.innerHTML += `<div class="table-cell p-2">${data.daily.temperature_2m_max[i]}${data.daily_units.temperature_2m_max} <br> ${data.daily.temperature_2m_min[i]}${data.daily_units.temperature_2m_min}</div>`;
      tableWind.innerHTML += `<div class="table-cell p-2">${data.daily.wind_speed_10m_max[i]}${data.daily_units.wind_speed_10m_max} <br> (${data.daily.wind_gusts_10m_max[i]}${data.daily_units.wind_gusts_10m_max})</div>`;
      if ([71, 73, 75].includes(data.daily.weather_code[i])) {
        tablePrec.innerHTML += `<div class="table-cell p-2">${data.daily.snowfall_sum[i]}${data.daily_units.snowfall_sum}</div>`;
      } else {
        tablePrec.innerHTML += `<div class="table-cell p-2">${data.daily.precipitation_sum[i]}${data.daily_units.precipitation_sum}</div>`;
      }
    }
  });

  /*
  let skip = false;
  data.current.time.forEach((time, i) => {
    if (skip) {
      return;
    }

    const htmlMinutely = document.getElementById("minutely");
    const forecastTime = new Date(time);
    const timeToRain = Math.floor((forecastTime - new Date()) / 1000 / 60);

    if (
      data.minutely_15.precipitation[i] != 0 &&
      timeToRain > 0 &&
      timeToRain <= 15
    ) {
      skip = true;
      htmlMinutely.innerHTML = `Pioggia prevista ora`;
    }

    if (
      data.minutely_15.precipitation[i] != 0 &&
      timeToRain > 15 &&
      timeToRain < 180
    ) {
      skip = true;
      htmlMinutely.innerHTML = `Precipitazioni previste intorno alle <span class="underline">${forecastTime.toLocaleTimeString(
        "it-IT",
        { hour: "2-digit", minute: "2-digit" }
      )}</span>`;
    }
  });*/
  if (data.current.precipitation > 0) {
    htmlMinutely.innerHTML = `Pioggia prevista ora`;
  }
}
