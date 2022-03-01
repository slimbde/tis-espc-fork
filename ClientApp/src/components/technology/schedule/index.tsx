import "./schedule.scss"
import moment from "moment"
import Highcharts from "highcharts"
import xrange from "highcharts/modules/xrange"
import { useEffect, useRef, useState } from "react"
import { Alert } from "reactstrap"
import { Loading } from "components/extra/Loading"
import { ScheduleAgregateDecoder, ScheduleHeatInfo } from "models/types/Technology/Schedule/ScheduleHeatInfo"
import pHandler from "models/handlers/DbHandlers/ProductionDbHandler"
import Controls from "./Controls"
import { blinkAlert } from "components/extra/Alert"
import { ChartItem, populateChart } from "./PopulateChart"
import { MetallurgicalDate } from "components/extra/MetallurgicalDate"

xrange(Highcharts)


type State = {
  loading: boolean
  date: string
  metallurgicalDate: string
}






export const Schedule: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState<State>({
    loading: true,
    date: moment().isAfter(moment().format("YYYY-MM-DD") + " 19:30:00") ? moment().startOf("day").add(1, "day").format("YYYY-MM-DD") : moment().startOf("day").format("YYYY-MM-DD"),
    metallurgicalDate: moment().isAfter(moment().format("YYYY-MM-DD") + " 19:30:00") ? moment().startOf("day").add(1, "day").format("YYYY-MM-DD") : moment().startOf("day").format("YYYY-MM-DD"),
  })



  useEffect(() => {
    const interval = setInterval(update, 5 * 60 * 1000)
    document.title = "График работы"
    return () => clearInterval(interval)
    //eslint-disable-next-line
  }, [])


  useEffect(() => {
    console.log(state.date)
    update(false)
    //eslint-disable-next-line
  }, [state.date])


  const update = (interval: Boolean = true) => {
    if (state.date !== MetallurgicalDate() && interval) return

    setState(state => ({ ...state, loading: true }))
    chartRef.current!.classList.add("blur")
    controlsRef.current?.classList.add("disabled")

    pHandler.GetScheduleHeatInfoAsync(state.date)
      .then(response => {
        if (response.length === 0) throw new Error("Нет данных")

        // when highcharts draws the chart there must be at least one point to draw the device to make it visible
        // so we add the placeholder to keep the idle device visible
        const fillerTime = state.date + " 00:00:00"
        const fillerAKOC = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "AKOC" }]
        const fillerAKOC2 = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "AKOC2" }]
        const fillerDSP = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "DSP" }]
        const fillerVOD = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "VOD" }]
        const fillerCCM1 = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "CCM1" }]
        const fillerCCM2 = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "CCM2" }]

        const lookup = response.reduce((acc: any, curr: ScheduleHeatInfo) => {
          acc[curr.AGREGATE].push(curr)
          return acc
        }, { AKOC: fillerAKOC, AKOC2: fillerAKOC2, DSP: fillerDSP, VOD: fillerVOD, CCM1: fillerCCM1, CCM2: fillerCCM2 })

        const data: ChartItem[] = []
        Object.keys(lookup).forEach((agregate, idx) => {
          lookup[agregate].forEach((heat: any) => {
            const offset = 5 * 3600 * 1000

            data.push({
              y: idx,
              x: Date.parse(heat["START_POINT"].substr(0, 19)) + offset,
              x2: heat["END_POINT"]
                ? Date.parse(heat["END_POINT"].substr(0, 19)) + offset
                : new Date().getTime() + offset,
              heat: heat["HEAT_ID"],
              agregate: ScheduleAgregateDecoder[agregate]
            })
          })
        })
        const categories = Object.keys(lookup).map(key => ScheduleAgregateDecoder[key])

        populateChart(data, categories, state.date)
        chartRef.current!.classList.remove("blur");
        controlsRef.current?.classList.remove("disabled")
        setState(state => ({ ...state, loading: false, }))
      })
      .catch(error => {
        blinkAlert(error, false)
        console.log(error)
        chartRef.current!.classList.remove("blur")
        controlsRef.current?.classList.remove("disabled")
        setState(state => ({ ...state, loading: false, }))
      })
  }



  const dateChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, date: moment(e.target.value).format("YYYY-MM-DD") })
  const back = () => setState(state => ({ ...state, date: moment(state.date).subtract(1, "day").format("YYYY-MM-DD") }))
  const forth = () => setState(state => ({ ...state, date: state.date !== moment(state.metallurgicalDate).format("YYYY-MM-DD") ? moment(state.date).add(1, "day").format("YYYY-MM-DD") : state.date }))
  const reset = () => setState(state => ({ ...state, date: state.metallurgicalDate }))








  return <div className="schedule-wrapper">
    <Alert id="alert">Hello</Alert>
    <div className="title display-5">График работы ЭСПЦ-6</div>

    <Controls
      innerRef={controlsRef}
      dateChange={dateChange}
      back={back}
      forth={forth}
      reset={reset}
      date={state.date}
    />

    {state.loading && <Loading />}
    <div id="chart" className="main" ref={chartRef}></div>
  </div>
}