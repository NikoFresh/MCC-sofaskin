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
  grid: { containLabel: true, left: 10, right: 10, top: 30, bottom: 30 }
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
    const labels = data.outTemp.map(entry => new Date(entry[0] * 1000));

    // Funzione per estrarre e formattare i dati
    const extractData = key => data[key].map((entry, index) => [labels[index], entry[1]]);

    const [outTemp, outHumidity, dewpoint, windChill, heatIndex, windSpeed, gustSpeed, windDir, barometer, rainRate] = 
      ['outTemp', 'outHumidity', 'dewpoint', 'windchill', 'heatindex', 'windSpeed', 'gustSpeed', 'windDir', 'barometer', 'rainrate']
        .map(extractData);

    // Calcolo pioggia oraria
    const hourlyRain = data.rain.reduce((acc, [time, value], index, arr) => {
      if (index % 12 === 0) {
        const hourlyTotal = arr.slice(index, index + 12).reduce((sum, [_, val]) => sum + val, 0);
        acc.push([new Date(time * 1000), hourlyTotal]);
      }
      return acc;
    }, []);

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

    initChart("windDirChart", {
      ...createBaseChartOption(["Direzione"], "{value} °"),
      yAxis: { ...createBaseChartOption(["Direzione"], "{value} °").yAxis, max: 360 },
      series: [createSeries("Direzione", windDir, "rgb(192, 75, 192)", "scatter")]
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
  });