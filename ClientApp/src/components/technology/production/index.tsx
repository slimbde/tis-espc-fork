import "./production.scss"
import moment from "moment"
import NoData from "../../extra/NoData"
import React, { useEffect, useState } from "react"
import pHandler from "models/handlers/DbHandlers/ProductionDbHandler"
import Controls from "./Controls"
import { LFTable } from "./LFTable"
import { LFHeat } from "models/types/Technology/Production/LFHeat"
import { Loading } from "components/extra/Loading"
import { AreaId, getAreaName } from "models/types/Technology/Production/AreaId"
import { setFluid } from "components/extra/SetFluid"
import { Alert, blinkAlert } from "components/extra/Alert"
import { ProductionFilter } from "models/types/Technology/Production/ProductionFilter"
import { VODHeat } from "models/types/Technology/Production/VODHeat"
import { CCM2Heat } from "models/types/Technology/Production/CCM2Heat"
import { VODTable } from "./VODTable"
import { CCM2Table } from "./CCM2Table"
import { CCM1Heat } from "models/types/Technology/Production/CCM1Heat"
import { CCM1Table } from "./CCM1Table"
import { MetallurgicalRange } from "components/extra/MetallurgicalDate"
import { AKOSHeat } from "models/types/Technology/Production/AKOSHeat"
import { AKOSTable } from "./AKOSTable"
import { DSPHeat } from "models/types/Technology/Production/DSPHeat"
import { DSPTable } from "./DSPTable"


type State = {
  areaId: AreaId
  heats: LFHeat[] | VODHeat[] | CCM2Heat[] | CCM1Heat[] | AKOSHeat[] | DSPHeat[] | undefined
  shift: number
  datePoint: string
  title: string
  loading: boolean
  token: AbortController
}


export const Production: React.FC = () => {

  const calculateShift = (): number => {
    const hour = new Date().getHours()
    const minutes = new Date().getMinutes()

    return (hour === 7 && minutes > 30) || (hour === 19 && minutes < 30) || (hour > 7 && hour < 19) ? 2 : 1
  }

  const calculateDate = (): string => {
    const hour = moment().hour()

    return calculateShift() === 2
      ? moment().format("YYYY-MM-DD")
      : hour <= 23 && hour >= 19
        ? moment().add(1, "day").format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD")
  }

  const fetchState = (filter: ProductionFilter, shift = state.shift, datePoint = state.datePoint,) => {
    setState(state => ({ ...state, loading: true }))

    pHandler.GetListForAsync(filter, state.token)
      .then(heats => {
        const { middle } = MetallurgicalRange(datePoint)
        const shiftFilteredHeats: any = []

        if ([1, 73, 80].some(area => area === state.areaId)) {
          heats && heats.forEach(h => {
            const heatShift = moment(h.START_POINT).isAfter(middle) ? 2 : 1;
            heatShift === state.shift && shiftFilteredHeats.push(h)
          })
        }
        else shiftFilteredHeats.push(...heats)

        setState(state => ({
          ...state,
          shift,
          datePoint,
          heats: shiftFilteredHeats,
          title: `${moment(filter.bDate).format("DD.MM.YYYY HH:mm")} ... ${moment(filter.eDate).format("DD.MM.YYYY HH:mm")}`,
          loading: false,
        }))
      })
      .catch(error => {
        if (error.message.indexOf("abort") > -1) return
        blinkAlert((error as any).message, false)
        console.log(error)
        setState({ ...state, loading: false })
      })
  }


  const [state, setState] = useState<State>({
    areaId: AreaId.LF_DIAG,
    heats: [],
    shift: calculateShift(),
    datePoint: calculateDate(),
    title: "",
    loading: false,
    token: new AbortController()
  })

  useEffect(() => {
    document.title = "Производство"
    setFluid(true)
    return () => {
      state.token.abort()
      setFluid()
    }
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    const [bDate, eDate] = calculatePoints(state.shift, state.datePoint)

    fetchState({ bDate, eDate, areaId: state.areaId })
    // eslint-disable-next-line
  }, [state.shift, state.datePoint, state.areaId])

  const calculatePoints = (shift: number, datePoint: string) => {
    const { start, middle, end } = MetallurgicalRange(datePoint)
    const b = shift === 1 ? start : middle
    const e = shift === 1 ? middle : end
    const bDate = b.format("YYYY-MM-DD HH:mm:ss")
    const eDate = e.format("YYYY-MM-DD HH:mm:ss")

    return [bDate, eDate]
  }

  const areaIdChange = (areaId: AreaId) => setState({ ...state, areaId, heats: undefined, loading: true })
  const shiftChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, shift: +e.target.value, heats: undefined, loading: true })
  const dateChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, datePoint: e.target.value, heats: undefined, loading: true })

  const reset = () => {
    const shift = calculateShift()
    const datePoint = calculateDate().slice(0, 10)

    const [bDate, eDate] = calculatePoints(shift, datePoint)
    fetchState({ bDate, eDate, areaId: state.areaId }, shift, datePoint)
  }
  const back = () => setState({
    ...state,
    datePoint: state.shift === 2 ? state.datePoint : moment(state.datePoint).subtract(1, "day").format("YYYY-MM-DD"),
    shift: state.shift === 2 ? 1 : 2,
    loading: true,
  })
  const forth = () => setState({
    ...state,
    datePoint: state.shift === 2 ? moment(state.datePoint).add(1, "day").format("YYYY-MM-DD") : state.datePoint,
    shift: state.shift === 2 ? 1 : 2,
    loading: true,
  })



  return <div className="production-wrapper jumbotron">
    <Alert>Hello</Alert>
    <div className="title display-5">отчет по работе {getAreaName(state.areaId)}</div>
    {state.loading && <Loading />}

    <Controls {...{
      areaId: state.areaId,
      date: state.datePoint,
      shift: state.shift,
      areaIdChange,
      dateChange,
      shiftChange,
      reset,
      back,
      forth,
      loading: state.loading,
    }} />

    <div className={`main ${state.loading ? "blur" : ""}`}>
      <div className="subtitle">{state.title}</div>

      {state.areaId === AreaId.LF_DIAG &&
        <LFTable {...{
          shift: state.shift,
          heatDate: state.datePoint,
          heats: state.heats as LFHeat[],
          areaId: state.areaId,
        }} />}

      {state.areaId === AreaId.VOD_DIAG &&
        <VODTable {...{
          shift: state.shift,
          heatDate: state.datePoint,
          heats: state.heats as VODHeat[],
          areaId: state.areaId,
        }} />}

      {state.areaId === AreaId.CCM2_DIAG &&
        <CCM2Table {...{
          shift: state.shift,
          heatDate: state.datePoint,
          heats: state.heats as CCM2Heat[],
          areaId: state.areaId,
        }} />}

      {state.areaId === AreaId.CCM1_DIAG &&
        <CCM1Table {...{ heats: state.heats as CCM1Heat[], }} />}

      {state.areaId === AreaId.AKOS_DIAG &&
        <AKOSTable {...{ heats: state.heats as AKOSHeat[], }} />}

      {state.areaId === AreaId.DSP_DIAG &&
        <DSPTable {...{ heats: state.heats as DSPHeat[], }} />}

      {(state.heats?.length === 0 && state.title !== "") && <NoData />}
    </div>
  </div>
}
