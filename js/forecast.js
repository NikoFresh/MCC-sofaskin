const LAT = 46.4464; 
const LON = 12.3818;
const PRECIPITATION_THRESHOLD = 0.1; 

async function checkRainForecast() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=precipitation,rain,showers,snowfall&models=italia_meteo_arpae_icon_2i&forecast_days=4&timezone=auto`;
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
        if (time < now) continue;

        const precip = hourly.precipitation[i]; 
        const snowfall = hourly.snowfall[i]; 
        const rainOnly = hourly.rain[i] + hourly.showers[i];
        
        if (precip > 0.1 || snowfall > 0) {
            
            globalWaterEq += precip;
            globalRainSum += rainOnly;
            globalSnowSum += snowfall;

            let type = 'Pioggia'; 
            let icon = '💧';
            let unit = 'mm';
            let amount = precip;

            if (snowfall > 0) { 
                type = 'Neve'; icon = '❄️'; unit = 'cm'; amount = snowfall;
            } else if (hourly.showers[i] > 0) { 
                type = 'Rovescio'; icon = '🌦️'; 
            }

            const eventObj = {
                time: time,
                amount: amount,
                type: type,
                icon: icon,
                unit: unit
            };

            if (!nextEvent) nextEvent = eventObj;

            const dateKey = time.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric' });
            
            if (!dailyGroups[dateKey]) {
                dailyGroups[dateKey] = {
                    rainSum: 0,
                    snowSum: 0,
                    events: []
                };
            }

            dailyGroups[dateKey].rainSum += rainOnly;
            dailyGroups[dateKey].snowSum += snowfall;
            dailyGroups[dateKey].events.push(eventObj);
        }
    }

    const alertBox = document.getElementById('rain-alert');
    const summaryText = document.getElementById('alert-summary');
    const alertIcon = document.getElementById('alert-icon')

    if (globalWaterEq > PRECIPITATION_THRESHOLD) {
        alertBox.classList.remove('hidden');
        
        const hoursUntil = Math.round((nextEvent.time - now) / 3600000);
        let timeString = hoursUntil <= 0 ? "Precipitazioni in corso" : `Inizio tra ${hoursUntil} ore.`;

        let totalDisplay, unitDisplay, textType, icon;
        
        if (globalSnowSum > globalRainSum) {
            totalDisplay = globalSnowSum;
            unitDisplay = 'cm';
            textType = 'di neve';
            icon = '❄️'
        } else {
            totalDisplay = globalRainSum;
            unitDisplay = 'mm';
            textType = 'di pioggia';
            icon = '💧'
        }
        alertIcon.innerHTML = icon
        summaryText.innerHTML = `Previsti <span class="font-bold text-blue-900">${totalDisplay.toFixed(1)} ${unitDisplay}</span> ${textType} nei prossimi tre giorni.`;

        populateModalList(dailyGroups);
    } else {
        alertBox.classList.add('hidden');
    }
}

function populateModalList(dailyGroups) {
    const listContainer = document.getElementById('rain-details-list');
    listContainer.innerHTML = ''; 

    for (const [dateStr, data] of Object.entries(dailyGroups)) {
        
        // if mm rain > cm snow, show rain. otherwise show snow
        let dayTotal, dayUnit, dayIcon, styleClass;

        if (data.snowSum > data.rainSum) {
            dayTotal = data.snowSum;
            dayUnit = 'cm';
            dayIcon = '❄️';
            styleClass = 'text-cyan-800 bg-cyan-100'; 
        } else {
            dayTotal = data.rainSum; 
            dayUnit = 'mm';
            dayIcon = '💧';
            styleClass = 'text-blue-800 bg-blue-100';
        }
        listContainer.innerHTML += `
            <li class="bg-blue-100 py-2 px-3 mt-4 rounded flex justify-between items-center sticky top-0 z-10 border-b border-gray-200">
                <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">${dateStr}</span>
                <span class="text-xs font-bold px-2 py-1 rounded-full ${styleClass}">
                    Tot: ${dayTotal.toFixed(1)} ${dayUnit} ${dayIcon}
                </span>
            </li>`;

        data.events.forEach(event => {
            const timeStr = event.time.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
            
            let intensityClass = 'text-gray-600';
            const limit = event.unit === 'cm' ? 2 : 3; 
            if (event.amount > limit) intensityClass = 'text-blue-700 font-bold'; 

            listContainer.innerHTML += `
                <li class="py-3 flex justify-between items-center hover:bg-blue-50 transition border-b border-gray-50 last:border-0 px-2">
                    <div class="flex items-center gap-3">
                        <span class="text-gray-800 font-mono text-sm">${timeStr}</span>
                        <span class="text-lg">${event.icon}</span>
                        <span class="text-sm text-gray-700">${event.type}</span>
                    </div>
                    <div class="${intensityClass} text-sm">
                        ${event.amount.toFixed(1)} ${event.unit}
                    </div>
                </li>
            `;
        });
    }
}

// Toggle popup 
function toggleRainModal(show) {
    const modal = document.getElementById('rain-modal');
    if (show) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
    } else {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', checkRainForecast);