/* checkdiff.js
Update version to work with Weewx 5 */

function checkDiff(datestr) {
    // Parse the input date string
    var parts = datestr.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+) (am|pm) \((\w+)\)/);
    if (!parts) {
        console.error("Invalid date format");
        return;
    }

    // Extract date components
    var month = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);
    var year = parseInt(parts[3], 10);
    var hour = parseInt(parts[4], 10);
    var minute = parseInt(parts[5], 10);
    var second = parseInt(parts[6], 10);
    var period = parts[7];
    var timezone = parts[8];

    // Adjust hour if in PM
    if (period === "pm" && hour < 12) {
        hour += 12;
    }

    // Create Date object
    var refreshed = new Date(year, month - 1, day, hour, minute, second);

    // Adjust for timezone if needed
    if (timezone !== "UTC") {
        var dtz = new Date().getTimezoneOffset() / 60;
        var sdtz = timezone === "MDT" ? 6 : 7; // Example for MDT and MST, adjust accordingly
        var adjustedTime = refreshed.getTime() + (sdtz - dtz) * 60 * 60 * 1000;
        refreshed.setTime(adjustedTime);
    }

    var diff = 30 * 60 * 1000; /* 30 min diff is OK without a warning*/
    var text = document.createElement('div');

    // Fixme: Add "icon"
    if (Date.now() - refreshed > diff) {
        text.innerHTML = `<div role="alert" class="tw:border-s-4 tw:border-red-700 tw:bg-red-50 tw:p-4 tw:m-4">
                            <div class="tw:flex tw:items-center tw:gap-2 tw:text-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="tw:size-5">
                                <path
                                    fill-rule="evenodd"
                                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                    clip-rule="evenodd"
                                />
                                </svg>

                                <strong class="tw:text-lg"> Dati non aggiornati </strong>
                                <br />
                                <a href="https://meteocentrocadore.cronitorstatus.com" class="tw:underline tw:mt-2">Controlla lo stato dei servizi</p>
                            </div>
                        </div>`;
    }

    //Inset alery in the freshwater element
    var freshWeatherElement = document.getElementById('freshweather');
    if (freshWeatherElement) {
        freshWeatherElement.appendChild(text);
    } else {
        console.error("Element with ID 'freshweather' not found.");
    }
}
