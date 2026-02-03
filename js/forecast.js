const LAT = 46.4464;
const LON = 12.3818;
const PRECIPITATION_THRESHOLD = 0.1;

async function checkRainForecast() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=precipitation,rain,showers,snowfall,temperature_2m&models=italia_meteo_arpae_icon_2i&forecast_days=4&timezone=auto`;
  console.log(url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    processData(data.hourly);
  } catch (error) {
    console.error("Errore meteo:", error);
  }
}

function processData(hourly) {
  const now = new Date();
  let globalWaterEq = 0;
  let globalRainSum = 0;
  let globalSnowSum = 0;
  let nextEvent = null;
  const dailyGroups = {};

  for (let i = 0; i < hourly.time.length; i++) {
    const time = new Date(hourly.time[i]);
    const precip = hourly.precipitation[i] || 0;
    const snowfall = hourly.snowfall[i] || 0;
    const rainOnly = (hourly.rain[i] || 0) + (hourly.showers[i] || 0);
    const temp = hourly.temperature_2m[i] || 0;

    // Totale giornaliero
    const dateKey = time.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
    });

    if (!dailyGroups[dateKey]) {
      dailyGroups[dateKey] = { rainSum: 0, snowSum: 0, events: [] };
    }

    dailyGroups[dateKey].rainSum += rainOnly;
    dailyGroups[dateKey].snowSum += snowfall;

    // Solo dati futuri
    if (time >= now) {
      if (precip > 0.05 || snowfall > 0.05) {
        globalWaterEq += precip;
        globalRainSum += rainOnly;
        globalSnowSum += snowfall;

        const eventObj = {
          time: time,
          rain: rainOnly > 0.05 ? rainOnly : 0,
          snow: snowfall > 0.05 ? snowfall : 0,
          isShower: (hourly.showers[i] || 0) > 0,
          temp: temp,
        };

        if (!nextEvent) nextEvent = eventObj;
        dailyGroups[dateKey].events.push(eventObj);
      }
    }
  }

  const alertBox = document.getElementById("rain-alert");
  if (globalWaterEq > PRECIPITATION_THRESHOLD) {
    alertBox.classList.remove("hidden");
    document.getElementById("alert-icon").innerHTML =
      (globalRainSum > 0.1 ? '<i class="qi-399-fill text-blue-300"></i>' : "") +
      (globalSnowSum > 0.1 ? '<i class="qi-499-fill text-blue-300"></i>' : "");

    document.getElementById("alert-summary").innerHTML =
      `Previsti <span class="font-bold text-blue-900">${globalRainSum.toFixed(1)} mm</span> di pioggia e <span class="font-bold text-cyan-700">${globalSnowSum.toFixed(1)} cm</span> di neve nei prossimi giorni.`;

    populateModalList(dailyGroups);
  } else {
    alertBox.classList.add("hidden");
  }
}

function populateModalList(dailyGroups) {
  const listContainer = document.getElementById("rain-details-list");
  listContainer.innerHTML = "";

  for (const [dateStr, data] of Object.entries(dailyGroups)) {
    if (data.events.length === 0) continue;

    let totalsHtml = "";
    if (data.rainSum > 0)
      totalsHtml += `<span class="ml-2 text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">💧 ${data.rainSum.toFixed(1)} mm</span>`;
    if (data.snowSum > 0)
      totalsHtml += `<span class="ml-2 text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full whitespace-nowrap">❄️ ${data.snowSum.toFixed(1)} cm</span>`;

    listContainer.innerHTML += `
      <li class="bg-gray-100 py-2 px-3 mt-4 rounded flex justify-between items-center sticky top-0 z-10 border-b border-gray-200">
          <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">${dateStr}</span>
          <div class="text-[10px] font-bold flex gap-1">
              ${totalsHtml}
          </div>
      </li>`;

    data.events.forEach((event) => {
      const timeStr = event.time.toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      });
      let label =
        event.rain > 0 && event.snow > 0
          ? "Pioggia/Neve"
          : event.snow > 0
            ? "Neve"
            : "Pioggia";
      let icons =
        (event.rain > 0 ? '<i class="qi-399-fill text-blue-400"></i>' : "") +
        (event.snow > 0 ? '<i class="qi-499-fill text-cyan-300"></i>' : "");

      listContainer.innerHTML += `
        <li class="py-3 flex justify-between items-center hover:bg-blue-50 transition border-b border-gray-50 last:border-0 px-2">
            <div class="flex items-center gap-3">
                <span class="text-gray-800 font-mono text-sm">${timeStr}</span>
                <div class="flex items-center gap-1.5">
                  <span class="flex gap-0.5">${icons}</span>
                  <span class="text-[10px] uppercase tracking-wider font-semibold text-gray-500">${label}</span>
                </div>
            </div>
            <div class="flex gap-3">
                ${event.rain > 0 ? `<div class="text-blue-700 text-sm font-medium">${event.rain.toFixed(1)} mm</div>` : ""}
                ${event.snow > 0 ? `<div class="text-cyan-700 text-sm font-medium border-l pl-2 border-gray-200">${event.snow.toFixed(1)} cm</div>` : ""}
                <div class="text-gray-700 text-sm font-medium border-l pl-2 border-gray-200">${event.temp.toFixed(1)}°C</div>
            </div>
        </li>`;
    });
  }
}

// Toggle popup
function toggleRainModal(show) {
  const modal = document.getElementById("rain-modal");
  if (show) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  } else {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", checkRainForecast);
