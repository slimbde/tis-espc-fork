import Highcharts from "highcharts"
import moment from "moment"


export type ChartItem = {
  x: number
  x2: number,
  y: number
  heat: string
  agregate: string
}



export const populateChart = (data: ChartItem[], categories: string[], date: string) => {
  const dt = new Date(date)
  dt.setHours(dt.getHours() - 4)
  const rangeFrom1 = dt.setMinutes(dt.getMinutes() - 30)
  const rangeTo1 = dt.setHours(dt.getHours() + 12)
  const rangeTo2 = dt.setHours(dt.getHours() + 12)

  Highcharts.chart('chart', {
    chart: {
      type: 'xrange',
      marginTop: 60,
    },
    title: { text: '' },
    xAxis: {
      type: 'datetime',
      gridLineWidth: 1,
      tickInterval: 3600 * 1000,
      labels: {
        formatter: function () {
          return Highcharts.dateFormat('%H', +this.value);
        }
      },
      min: Date.parse(date) - 4.5 * 3600 * 1000,
      max: Date.parse(date) + 19.5 * 3600 * 1000,
      plotBands: [
        {
          color: '#edf4fb',
          from: rangeFrom1,
          to: rangeTo1,
        },
        {
          color: '#fffce6',
          from: rangeTo1,
          to: rangeTo2,
        }
      ],
    },
    yAxis: {
      title: { text: '' },
      categories,
      reversed: true,
    },
    series: [{
      name: "Агрегат",
      type: "xrange",
      borderColor: 'gray',
      pointWidth: 30,
      data,
      dataLabels: {
        enabled: true,
        formatter: function () { return `<span class="chart-heat">${(this.point as any).heat}</span>` },
        align: "left",
        verticalAlign: "top",
        padding: -15,
        x: 15,
        style: {
          textOutline: "none",
          color: "gray",
        }
      }
    }],
    tooltip: {
      animation: false,
      xDateFormat: "%H:%M:%S",
      formatter: function () {
        return `Плавка:<b> ${(this.point as any).heat}</b><br/>Время: ${moment(this.point.x).utc().format("HH:mm:ss")}...${moment(this.point.x2!).utc().format("HH:mm:ss")}<br/>${(this.point as any).agregate}`;
      },
    },
    plotOptions: {
      series: {
        //cursor: 'pointer',
        animation: false,
        //marker: { lineWidth: 1 }
      }
    },
    legend: { enabled: false },
    credits: { enabled: false }
  })
} 