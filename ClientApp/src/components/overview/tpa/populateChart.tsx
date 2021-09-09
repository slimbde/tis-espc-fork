import { Idle } from "models/types/Idle"
import Highcharts from "highcharts"
import moment from "moment"


export const populateChart = (data: Idle[]) => {
  if (data.length < 1)
    return

  // existing idles summ
  const summ = data.reduce((acc, r) => {
    if (!(r.IMMName in acc))
      (acc as any)[r.IMMName] = {}

    const immNum = r.StreamName
    if (!(immNum in (acc as any)[r.IMMName]))
      (acc as any)[r.IMMName][immNum] = 0

    const duration = moment(r.EndPoint).diff(moment(r.StartPoint), "minutes");
    if (!isNaN(duration))
      (acc as any)[r.IMMName][immNum] += duration
    return acc
  }, {})


  const categories = [
    "ТПА 1",
    "ТПА 2",
    "ТПА 3а",
    "ТПА 3б",
    "ТПА 4",
    "ТПА 5а",
    "ТПА 5б",
    "ТПА 6",
    "ТПА 7",
  ]

  const streams = [
    "Ручей 1",
    "Ручей 2",
    "Ручей 3",
    "Ручей 4",
    "Ручей 5"
  ]

  const serieColors = (num: number) => {
    switch (num) {
      case 1: return "steelblue"
      case 2: return "darkorange"
      case 3: return "gold"
      case 4: return "green"
      case 5: return "purple"
      default: return "black"
    }
  }

  const series = streams.map((stream, idx) => {
    type serie = {
      name: string
      type: any
      color: string
      data: any[]
    }
    const obj: serie = {
      name: stream,
      type: "column",
      color: serieColors(idx + 1),
      data: []
    }

    categories.forEach((tpa, idx) => {
      if (!(summ as any)[stream] || !(tpa in (summ as any)[stream]))
        (obj.data as any)[idx] = 0
      else
        (obj.data as any)[idx] = (summ as any)[stream][tpa]

      return obj
    })

    return obj
  })

  Highcharts.chart('chart-container', {
    chart: { backgroundColor: "transparent" },
    title: { text: '' },
    subtitle: { text: 'СУММА ПРОСТОЕВ ЗА ИНТЕРВАЛ, мин.' },
    xAxis: {
      categories,
      crosshair: {
        width: 50,
        color: "lightgray"
      },
      gridLineColor: "darkgray",
      gridLineWidth: 1,
    },
    yAxis: {
      min: 0,
      gridLineWidth: 0,
      title: { text: '' }
    },
    tooltip: {
      headerFormat: '<span style="font-size:12px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0;">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} мин</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0
      }
    },
    series,
  });
}