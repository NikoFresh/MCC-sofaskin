const globalTooltip = {
  trigger: "axis",
  axisPointer: {
    type: "cross",
  },
};

// Global DataZoom Configuration
const globalDataZoom = [
  {
    type: "inside", // Enable inside zoom
    start: 0, // Zoom start percentage
    end: 100, // Zoom end percentage
  },
  {
    type: "slider", // Enable slider zoom
    start: 0, // Slider start percentage
    end: 100, // Slider end percentage
    height: 20, // Slider height
  },
];

fetch("json/day.json")
  .then((response) => response.json())
  .then((data) => {
    const labels = data.outTemp.map((entry) => new Date(entry[0] * 1000));

    const outTemp = data.outTemp.map((entry) => entry[1]);
    const outHumidity = data.outHumidity.map((entry) => entry[1]);
    const dewpoint = data.dewpoint.map((entry) => entry[1]);
    const windChill = data.windchill.map((entry) => entry[1]);
    const heatIndex = data.heatindex.map((entry) => entry[1]);
    const windSpeed = data.windSpeed.map((entry) => entry[1]);
    const gustSpeed = data.gustSpeed.map((entry) => entry[1]);
    const windDir = data.windDir.map((entry) => entry[1]);
    const barometer = data.barometer.map((entry) => entry[1]);
    const rainRate = data.rainrate.map((entry) => entry[1]);

    const rain = data.rain;
    const hourlyRain = [];
    for (let i = 0; i < rain.length; i += 12) {
      // Somma i dati ogni 12 punti (ogni ora)
      const hourStart = rain[i][0];
      let hourlyTotal = 0;
      for (let j = i; j < i + 12 && j < rain.length; j++) {
        hourlyTotal += rain[j][1];
      }
      hourlyRain.push([hourStart, hourlyTotal]);
    }
    console.log(hourlyRain);

    // outtemp windchill
    const outTempChart = echarts.init(document.getElementById("outTempChart"));
    const outTempOption = {
      legend: {
        data: ["Temperatura", "Dew point"],
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: "{HH}:{mm}",
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        axisLabel: {
          formatter: "{value} °C", // Format the y-axis label as needed
          margin: 12, // Adjust the margin as needed
        },
      },
      tooltip: globalTooltip,
      dataZoom: globalDataZoom,
      connectNulls: false,
      series: [
        {
          name: "Temperatura",
          type: "line",
          data: outTemp.map((temp, i) => [labels[i], temp]),
          lineStyle: {
            color: "rgb(75, 192, 192)",
            width: 3,
          },
          itemStyle: {
            color: "rgb(75, 192, 192)",
          },
          showSymbol: false,
        },
        {
          name: "Dew point",
          type: "line",
          data: dewpoint.map((temp, i) => [labels[i], temp]),
          lineStyle: {
            color: "rgb(192, 75, 192)",
            width: 3,
          },
          itemStyle: {
            color: "rgb(192, 75, 192)",
          },
          showSymbol: false,
        },
        // Repeat for other datasets...
      ],
    };
    outTempChart.setOption(outTempOption);

    // rain rainrate
    const rainChart = echarts.init(document.getElementById("rainChart"));
    const rainOption = {
      legend: {
        data: ["Pioggia", "Rain rate"],
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
        axisLabel: {
          formatter: "{HH}:{mm}",
        },
      },
      yAxis: [
        {
          type: "value", // Configurazione primo asse Y
          position: "left", // Posizionamento a sinistra
          axisLabel: {
            formatter: "{value} mm", // Format the y-axis label as needed
            margin: 12, // Adjust the margin as needed
          },
        },
        {
          type: "value", // Configurazione secondo asse Y
          position: "right", // Posizionamento a destra
          axisLabel: {
            formatter: "{value} mm/h", // Format the y-axis label as needed
            margin: 12, // Adjust the margin as needed
          },
        },
      ],
      tooltip: globalTooltip,
      dataZoom: globalDataZoom,
      series: [
        {
          name: "Pioggia",
          type: "bar",
          yAxisIndex: 0,
          data: hourlyRain.map((entry) => [
            new Date(entry[0] * 1000),
            entry[1],
          ]),
          itemStyle: {
            color: "rgb(75, 192, 192)",
          },
          barWidth: "95%",
        },
        {
          name: "Rain rate",
          type: "line",
          yAxisIndex: 1,
          data: rainRate.map((temp, i) => [labels[i], temp]),
          lineStyle: {
            color: "rgb(192, 75, 192)",
            width: 3,
          },
          itemStyle: {
            color: "rgb(192, 75, 192)",
          },
          showSymbol: false,
        },
      ],
    };
    rainChart.setOption(rainOption);

    // wind windgust
    const windChart = echarts.init(document.getElementById("windChart"));
    const windOption = {
      legend: {
        data: ["Vento", "Raffica di vento"],
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: "{HH}:{mm}",
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        axisLabel: {
          formatter: "{value} km/h", // Format the y-axis label as needed
          margin: 12, // Adjust the margin as needed
        },
      },
      tooltip: globalTooltip,
      dataZoom: globalDataZoom,
      series: [
        {
          name: "Vento",
          type: "line",
          data: windSpeed.map((temp, i) => [labels[i], temp]),
          lineStyle: {
            color: "rgb(75, 192, 192)",
            width: 3,
          },
          itemStyle: {
            color: "rgb(75, 192, 192)",
          },
          showSymbol: false,
        },
        {
          name: "Raffica di vento",
          type: "scatter",
          symbolSize: 5,
          data: gustSpeed.map((temp, i) => [labels[i], temp]),
          lineStyle: {
            color: "rgb(192, 75, 192)",
            width: 3,
          },
          itemStyle: {
            color: "rgb(192, 75, 192)",
          },
          showSymbol: false,
        },
      ],
    };
    windChart.setOption(windOption);

    // wind dir
    const windDirChart = echarts.init(document.getElementById("windDirChart"));
    const windDirOption = {
      legend: {
        data: ["Direzione"],
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: "{HH}:{mm}",
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        max: 360,
        axisLabel: {
          formatter: "{value} °", // Format the y-axis label as needed
          margin: 12, // Adjust the margin as needed
        },
      },
      tooltip: globalTooltip,
      dataZoom: globalDataZoom,
      series: [
        {
          name: "Direzione",
          type: "scatter",
          symbolSize: 5,
          data: windDir.map((temp, i) => [labels[i], temp]),
          lineStyle: {
            color: "rgb(192, 75, 192)",
            width: 3,
          },
          itemStyle: {
            color: "rgb(192, 75, 192)",
          },
          showSymbol: false,
        },
      ],
    };
    windDirChart.setOption(windDirOption);

    // heat index wind chill
    const heatIndexChart = echarts.init(
      document.getElementById("heatIndexChart")
    );
    const heatIndexOption = {
      legend: {
        data: ["Heat index", "Wind chill"],
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: "{HH}:{mm}",
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        axisLabel: {
          formatter: "{value} °C", // Format the y-axis label as needed
          margin: 12, // Adjust the margin as needed
        },
      },
      tooltip: globalTooltip,
      dataZoom: globalDataZoom,
      series: [
        {
          name: "Heat index",
          type: "line",
          data: heatIndex.map((temp, i) => [labels[i], temp]),
          lineStyle: {
            color: "rgb(75, 192, 192)",
            width: 3,
          },
          itemStyle: {
            color: "rgb(75, 192, 192)",
          },
          showSymbol: false,
        },
        {
          name: "Wind chill",
          type: "line",
          data: windChill.map((temp, i) => [labels[i], temp]),
          lineStyle: {
            color: "rgb(192, 75, 192)",
            width: 3,
          },
          itemStyle: {
            color: "rgb(192, 75, 192)",
          },
          showSymbol: false,
        },
        // Repeat for other datasets...
      ],
    };
    heatIndexChart.setOption(heatIndexOption);

    // barometer
    const barometerChart = echarts.init(
      document.getElementById("barometerChart")
    );
    const barometerOption = {
      legend: {
        data: ["Pressione"],
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: "{HH}:{mm}",
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        axisLabel: {
          formatter: "{value} mbar", // Format the y-axis label as needed
          margin: 12, // Adjust the margin as needed
        },
      },
      tooltip: globalTooltip,
      dataZoom: globalDataZoom,
      series: [
        {
          name: "Pressione",
          type: "line",
          data: barometer.map((temp, i) => [labels[i], temp]),
          lineStyle: {
            color: "rgb(75, 192, 192)",
            width: 3,
          },
          itemStyle: {
            color: "rgb(75, 192, 192)",
          },
          showSymbol: false,
        },
      ],
    };
    barometerChart.setOption(barometerOption);
  });

