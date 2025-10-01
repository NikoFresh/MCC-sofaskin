// Configurazioni globali
const globalConfig = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "cross" }
  },
  dataZoom: [
    { type: "inside", start: 0, end: 100 },
    { type: "slider", start: 0, end: 100, height: 20 }
  ],
  grid: { containLabel: true, left: 10, right: 10, top: 50, bottom: 50 }
};

// Funzione per creare opzioni di base per i grafici
function createBaseChartOption(legendData, yAxisFormatter) {
  return {
    ...globalConfig,
    legend: { data: legendData },
    xAxis: {
      type: "time",
      axisLabel: { formatter: "{HH}:{mm}" }
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLabel: { formatter: yAxisFormatter, margin: 12 }
    }
  };
}

// Funzione per creare una serie di dati
function createSeries(name, data, color, type = "line") {
  return {
    name,
    type,
    data,
    lineStyle: { color, width: 3 },
    itemStyle: { color },
    showSymbol: false,
    ...(type === "scatter" && { symbolSize: 5 })
  };
}

// Funzione per inizializzare un grafico
function initChart(elementId, option) {
  const chart = echarts.init(document.getElementById(elementId));
  chart.setOption(option);
}

fetch("json/day.json")
  .then(response => response.json())
  .then(data => {
    // Funzione semplificata per estrarre e formattare i dati
    const extractData = key => {
      const [timestamps, values] = data[key];
      return timestamps.map((timestamp, index) => [
        new Date(timestamp * 1000),
        values[index]
      ]);
    };

    function processWindData(windDirData, windSpeedData) {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const speedRanges = [[0, 5], [5, 10], [10, 15], [15, 20], [20, Infinity]];
      const counts = Array(16).fill().map(() => Array(5).fill(0));
      
      const [dirTimestamps, dirValues] = windDirData;
      const [speedTimestamps, speedValues] = windSpeedData;
      
      // Crea una mappa per velocità del vento basata su timestamp
      const speedMap = new Map();
      speedTimestamps.forEach((timestamp, index) => {
        speedMap.set(timestamp, speedValues[index]);
      });
      
      // Processa i dati di direzione del vento
      dirTimestamps.forEach((timestamp, index) => {
        const dir = dirValues[index];
        const speed = speedMap.get(timestamp);
        
        if (dir !== undefined && speed !== undefined && !isNaN(dir) && !isNaN(speed)) {
          const dirIndex = Math.round(dir / 22.5) % 16;
          const speedIndex = speedRanges.findIndex(range => speed >= range[0] && speed < range[1]);
          
          if (dirIndex >= 0 && dirIndex < 16 && speedIndex >= 0 && speedIndex < 5) {
            counts[dirIndex][speedIndex]++;
          }
        }
      });

      return directions.map((dir, i) => ({
        name: dir,
        data: speedRanges.map((_, j) => counts[i][j])
      }));
    }

    // Estrai i dati
    const outTemp = extractData('outTemp');
    const dewpoint = extractData('dewpoint');
    const windChill = extractData('windchill');
    const heatIndex = extractData('heatindex');
    const windSpeed = extractData('windSpeed');
    const gustSpeed = extractData('gustSpeed');
    const barometer = extractData('barometer');
    const rainRate = extractData('rainrate');

    // Calcolo pioggia oraria
    const [rainTimestamps, rainValues] = data.rain;
    const hourlyRain = [];
    for (let i = 0; i < rainTimestamps.length; i += 12) {
      const hourlyTotal = rainValues.slice(i, i + 12).reduce((sum, val) => sum + val, 0);
      hourlyRain.push([new Date(rainTimestamps[i] * 1000), hourlyTotal]);
    }

    // Inizializzazione dei grafici
    initChart("outTempChart", {
      ...createBaseChartOption(["Temperatura", "Dew point"], "{value} °C"),
      series: [
        createSeries("Temperatura", outTemp, "rgb(75, 192, 192)"),
        createSeries("Dew point", dewpoint, "rgb(192, 75, 192)")
      ]
    });

    initChart("rainChart", {
      ...createBaseChartOption(["Pioggia", "Rain rate"], "{value} mm"),
      yAxis: [
        { type: "value", position: "left", axisLabel: { formatter: "{value} mm" } },
        { type: "value", position: "right", axisLabel: { formatter: "{value} mm/h" } }
      ],
      series: [
        {
          name: "Pioggia",
          type: "bar",
          yAxisIndex: 0,
          data: hourlyRain,
          itemStyle: { color: "rgb(75, 192, 192)" },
          barWidth: "95%"
        },
        createSeries("Rain rate", rainRate, "rgb(192, 75, 192)")
      ]
    });

    initChart("windChart", {
      ...createBaseChartOption(["Vento", "Raffica di vento"], "{value} km/h"),
      series: [
        createSeries("Vento", windSpeed, "rgb(75, 192, 192)"),
        createSeries("Raffica di vento", gustSpeed, "rgb(192, 75, 192)", "scatter")
      ]
    });

    initChart("heatIndexChart", {
      ...createBaseChartOption(["Heat index", "Wind chill"], "{value} °C"),
      series: [
        createSeries("Heat index", heatIndex, "rgb(75, 192, 192)"),
        createSeries("Wind chill", windChill, "rgb(192, 75, 192)")
      ]
    });

    initChart("barometerChart", {
      ...createBaseChartOption(["Pressione"], "{value} mbar"),
      series: [createSeries("Pressione", barometer, "rgb(75, 192, 192)")]
    });

    const windRoseData = processWindData(data.windDir, data.windSpeed);
    initChart("windDirChart", {
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          const speedRanges = ['0-5', '5-10', '10-15', '15-20', '20+'];
          const speedIndex = params.componentIndex;
          return `${params.name}<br/>${speedRanges[speedIndex]} km/h`;
        }
      },
      legend: {
        data: ['0-5 km/h', '5-10 km/h', '10-15 km/h', '15-20 km/h', '20+ km/h']
      },
      polar: {
        center: ['50%', '55%'],
        radius: '70%'
      },
      angleAxis: {
        type: 'category',
        data: windRoseData.map(item => item.name),
        startAngle: 101,
        clockwise: true
      },
      radiusAxis: {
        show: false
      },
      series: [0, 1, 2, 3, 4].map(i => ({
        type: 'bar',
        data: windRoseData.map(item => item.data[i]),
        coordinateSystem: 'polar',
        name: ['0-5 km/h', '5-10 km/h', '10-15 km/h', '15-20 km/h', '20+ km/h'][i],
        stack: 'stack'
      }))
    });
  });