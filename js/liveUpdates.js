clientID = "clientID - " + parseInt(Math.random() * 100);
host = "mqtt.eclipseprojects.io/mqtt";
port = 443;
topic = "meteocentrocadore/loop";

client = new Paho.MQTT.Client(host, Number(port), clientID);
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({
  onSuccess: onConnect,
  useSSL: true
});

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

indicator = document.getElementById("indicator");
indicator1 = document.getElementById("indicator-1");

document.getElementById("mqttStatus").innerHTML =
  "Connessione alla stazione meteo in corso...";
indicator.style.backgroundColor = "#eab208";
indicator1.style.backgroundColor = "#eab208";
client.connect({ onSuccess: onConnect });

// called when the client connects
function onConnect() {
  document.getElementById("mqttStatus").innerHTML =
    "Connesso alla stazione meteo, in attesa di dati...";
  document.getElementById("indicator").style.backgroundColor = "#eab208";
  document.getElementById("indicator-1").style.backgroundColor = "#eab208";
  client.subscribe(topic);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  document.getElementById("indicator").style.backgroundColor = "#22c55e";
  document.getElementById("indicator-1").style.backgroundColor = "#22c55e";
  console.log("onMessageArrived:" + message.payloadString);
  animateLight();
  data = JSON.parse(message.payloadString);
  for (let chiave in data) {
    data[chiave] = Math.round(data[chiave] * 100) / 100;
  }
  lastUpdate = new Date(data["dateTime"] * 1000);
  document.getElementById(
    "mqttStatus"
  ).innerHTML = `Ultimo aggiornamento live ${lastUpdate.toLocaleTimeString(
    "it-IT"
  )}`;

  updateData(data);
}

function animateLight() {
  var indicator = document.getElementById("indicator");
  indicator.classList.add("animate");
  setTimeout(() => {
    indicator.classList.remove("animate");
  }, 1000);
}

function updateData(data) {
  if ("outTemp_C" in data) {
    document.getElementById("outTemp").innerHTML = data["outTemp_C"] + "°C";
    document.getElementById("outHum").innerHTML = data["outHumidity"] + "%";
    document.getElementById("pressure").innerHTML =
       data["barometer_mbar"] + "mbar";
    document.getElementById("dewPoint").innerHTML = data["dewpoint_C"] + "°C";
    document.getElementById("windChill").innerHTML = data["windchill_C"] + "°C";
    document.getElementById("heatIndex").innerHTML = data["heatindex_C"] + "°C";
  }
  if ("dayRain_mm" in data) {
    document.getElementById("rain").innerHTML = data["dayRain_mm"] + "mm";
  }
  document.getElementById("rainRate").innerHTML =
    data["rainRate_mm_per_hour"] + "mm/h";
  document.getElementById("windSpeed").innerHTML =
    data["windSpeed_kph"] + "km/h";
}
