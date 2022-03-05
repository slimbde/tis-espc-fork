import "./schedule.scss"
import moment from "moment"
import Highcharts from "highcharts"
import xrange from "highcharts/modules/xrange"
import { useEffect, useRef, useState } from "react"
import { Alert } from "reactstrap"
import { Loading } from "components/extra/Loading"
import { ScheduleAgregateDecoder, ScheduleColorDecoder, ScheduleHeatInfo } from "models/types/Technology/Schedule/ScheduleHeatInfo"
import pHandler from "models/handlers/DbHandlers/ProductionDbHandler"
import Controls from "./Controls"
import { blinkAlert } from "components/extra/Alert"
import { ChartItem, populateChart } from "./PopulateChart"
import { MetallurgicalDate } from "components/extra/MetallurgicalDate"
import { setFluid } from "components/extra/SetFluid"

xrange(Highcharts)


type State = {
  loading: boolean
  date: string
  metallurgicalDate: string
  scheduleInfo: any
  lastUpdate: string
  timeout: NodeJS.Timeout | undefined
  token: AbortController
}






export const Schedule: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState<State>({
    loading: true,
    date: moment().isAfter(moment().format("YYYY-MM-DD") + " 19:30:00") ? moment().startOf("day").add(1, "day").format("YYYY-MM-DD") : moment().startOf("day").format("YYYY-MM-DD"),
    metallurgicalDate: MetallurgicalDate(),
    scheduleInfo: [],
    lastUpdate: "",
    timeout: undefined,
    token: new AbortController(),   // this is necessary to disable any hxr when you leave the page
  })



  useEffect(() => {
    setFluid(true)
    document.title = "График работы"
    return () => {
      setFluid()
      clearTimeout(state.timeout!)  // this is necessary to disable any timeout when you leave the page
      state.token.abort()           // this is necessary to disable any hxr when you leave the page
    }
    //eslint-disable-next-line
  }, [])


  useEffect(() => {
    update()
    //eslint-disable-next-line
  }, [state.date])


  const update = () => {
    if (state.token.signal.aborted) return // this is necessary to disable any hxr when you leave the page
    const timeout = state.date === state.metallurgicalDate
      ? setTimeout(update, 5 * 60 * 1000)
      : undefined

    !timeout && clearTimeout(state.timeout!)
    setState(state => ({ ...state, timeout, loading: true }))

    infoRef?.current?.classList.add("blur")
    chartRef?.current!.classList.add("blur")
    controlsRef?.current?.classList.add("disabled")

    pHandler.GetScheduleHeatInfoAsync(state.date)
      .then(response => {
        if (state.token.signal.aborted) return  // this is necessary to disable any hxr when you leave the page
        if (response.length === 0) throw new Error("Нет данных")

        // when highcharts draws the chart there must be at least one point to draw the device to make it visible
        // so we add the placeholder to keep the idle device visible
        const fillerTime = state.date + " 00:00:00"
        const fillerAKOS = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "AKOS" }]
        const fillerAKP21 = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "AKP21" }]
        const fillerAKP22 = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "AKP22" }]
        const fillerDSP = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "DSP" }]
        const fillerVOD1 = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "VOD1" }]
        const fillerVOD2 = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "VOD2" }]
        const fillerCCM1 = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "MNLS1" }]
        const fillerCCM2 = [{ START_POINT: fillerTime, END_POINT: fillerTime, HEAT_ID: "", AGREGATE: "MNLS2" }]

        const lookup = response.reduce((acc: any, curr: ScheduleHeatInfo) => {
          !(curr.AGREGATE.toUpperCase() in acc) && (acc[curr.AGREGATE.toUpperCase()] = [])
          acc[curr.AGREGATE.toUpperCase()].push(curr)
          return acc
        }, {
          DSP: fillerDSP,
          AKOS: fillerAKOS,
          AKP21: fillerAKP21,
          AKP22: fillerAKP22,
          VOD1: fillerVOD1,
          VOD2: fillerVOD2,
          MNLS1: fillerCCM1,
          MNLS2: fillerCCM2,
        })

        const data: ChartItem[] = []
        Object.keys(lookup).forEach((agregate, idx) => {
          lookup[agregate].forEach((heat: any) => {
            const offset = 5 * 3600 * 1000

            data.push({
              y: idx,
              x: Date.parse(heat["START_POINT"].substr(0, 19)) + offset,
              x2: !!heat["END_POINT"]
                ? Date.parse(heat["END_POINT"].substr(0, 19)) + offset
                : new Date().getTime() + offset,
              heat: heat["HEAT_ID"],
              agregate: ScheduleAgregateDecoder[agregate],
              isInProcess: !heat["END_POINT"],
              color: heat["END_POINT"] ? ScheduleColorDecoder[agregate] : "lightcoral",
            })
          })
        })
        const categories = Object.keys(lookup).map(key => ScheduleAgregateDecoder[key])

        populateChart(data, categories, state.date)
        infoRef.current?.classList.remove("blur")
        chartRef.current!.classList.remove("blur");
        controlsRef.current?.classList.remove("disabled")
        setState(state => ({
          ...state,
          lastUpdate: state.date === state.metallurgicalDate ? moment().format("HH:mm:ss") : "",
          scheduleInfo: lookup,
          loading: false,
        }))
      })
      .catch(error => {
        blinkAlert(error, false)
        console.log(error)
        infoRef.current?.classList.remove("blur")
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
    <div className="update-time">{state.lastUpdate}</div>

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

    {!!state.scheduleInfo &&
      <div className="info" ref={infoRef}>
        {Object.keys(state.scheduleInfo).map(agregate => {
          if (state.scheduleInfo[agregate].length < 2) return <span key={agregate}></span>

          return <div className="agregate" key={agregate}>
            <div className="a-title">{ScheduleAgregateDecoder[agregate]}</div>
            {state.scheduleInfo[agregate].map((item: ScheduleHeatInfo, idx: number) => {
              const time = `${moment(item.START_POINT).format("HH:mm")} ... ${item.END_POINT ? moment(item.END_POINT).format("HH:mm") : "текущ"}`
              const date = moment(item.START_POINT)

              if (!item.HEAT_ID) return <span key={idx}></span>

              return <div className={`heat ${item.AGREGATE} ${date > moment(state.date).subtract(9, "hours") ? "current" : ""}`} key={idx} title={date.format("DD.MM.YYYY")}>
                <div className="hid">{!isNaN(+item.HEAT_ID) ? item.HEAT_ID : ""}</div>
                <div className="time">{time}</div>
              </div>
            })}
          </div>
        })}
      </div>}
  </div>
}