import "./production.scss"
import moment from "moment"
import NoData from "../../extra/NoData"
import React, { useEffect, useState } from "react"
import pHandler from "models/handlers/DbHandlers/ProductionDbHandler"
import Controls from "./Controls"
import { LFTable } from "./LFTable"
import { Alert } from "reactstrap"
import { LFHeat } from "models/types/Technology/Production/LFHeat"
import { Loading } from "components/extra/Loading"
import { AreaId, getAreaName } from "models/types/Technology/Production/AreaId"
import { setFluid } from "components/extra/SetFluid"
import { blinkAlert } from "components/extra/Alert"
import { ProductionFilter } from "models/types/Technology/Production/ProductionFilter"
import { VODHeat } from "models/types/Technology/Production/VODHeat"
import { CCMHeat } from "models/types/Technology/Production/CCMHeat"
import { VODTable } from "./VODTable"
import { CCMTable } from "./CCMTable"


type State = {
  areaId: AreaId
  heats: LFHeat[] | VODHeat[] | CCMHeat[]
  shift: number
  datePoint: string
  title: string
  loading: boolean
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
      ? moment().toISOString(true).slice(0, 10)
      : hour <= 23 && hour >= 19
        ? moment().add(1, "day").toISOString(true).slice(0, 10)
        : moment().toISOString(true).slice(0, 10)
  }

  const fetchState = (filter: ProductionFilter, shift: number = state.shift, datePoint: string = state.datePoint,) => {

    pHandler.GetListForAsync(filter)
      .then(heats => setState({
        ...state,
        shift,
        datePoint,
        heats,
        title: `${moment(filter.bDate).format("DD.MM.YYYY HH:mm")} ... ${moment(filter.eDate).format("DD.MM.YYYY HH:mm")}`,
        loading: false,
      }))
      .catch(error => {
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
  })

  useEffect(() => {
    document.title = "Производство"
    setFluid(true)
    return setFluid
  }, [])

  useEffect(() => {
    setState({ ...state, loading: true })
    const [bDate, eDate] = calculatePoints(state.shift, state.datePoint)

    fetchState({ bDate, eDate, areaId: state.areaId })
    // eslint-disable-next-line
  }, [state.shift, state.datePoint, state.areaId])

  const calculatePoints = (shift: number, datePoint: string) => {
    const bDate1 = `${moment(datePoint).subtract(1, "day").toISOString(true).slice(0, 10)} 19:30`
    const eDate1 = `${moment(datePoint).toISOString(true).slice(0, 10)} 07:30`
    const bDate2 = `${moment(datePoint).toISOString(true).slice(0, 10)} 07:30`
    const eDate2 = `${moment(datePoint).toISOString(true).slice(0, 10)} 19:30`

    return shift === 1
      ? [bDate1, eDate1]
      : [bDate2, eDate2]
  }

  const areaIdChange = (areaId: AreaId) => setState({ ...state, areaId })
  const shiftChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, shift: +e.target.value })
  const dateChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, datePoint: e.target.value })

  const reset = () => {
    const shift = calculateShift()
    const datePoint = calculateDate().slice(0, 10)

    const [bDate, eDate] = calculatePoints(shift, datePoint)
    fetchState({ bDate, eDate, areaId: state.areaId }, shift, datePoint)
  }
  const back = () => setState({
    ...state,
    datePoint: state.shift === 2 ? state.datePoint : moment(state.datePoint).subtract(1, "day").toISOString(true).slice(0, 10),
    shift: state.shift === 2 ? 1 : 2
  })
  const forth = () => setState({
    ...state,
    datePoint: state.shift === 2 ? moment(state.datePoint).add(1, "day").toISOString(true).slice(0, 10) : state.datePoint,
    shift: state.shift === 2 ? 1 : 2
  })



  return <div className="production-wrapper jumbotron">
    <Alert id="alert">Hello</Alert>
    <div className="title display-5">отчет по работе {getAreaName(state.areaId)}</div>

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
    }} />

    <div className="main">
      <div className="subtitle">{state.title}</div>

      {state.areaId === AreaId.LF_DIAG &&
        <LFTable {...{
          shift: state.shift,
          heatDate: state.datePoint,
          heats: state.heats as LFHeat[],
          areaId: state.areaId
        }} />}

      {state.areaId === AreaId.VOD_DIAG &&
        <VODTable {...{
          shift: state.shift,
          heatDate: state.datePoint,
          heats: state.heats as VODHeat[],
          areaId: state.areaId
        }} />}

      {state.areaId === AreaId.CCM_DIAG &&
        <CCMTable {...{
          shift: state.shift,
          heatDate: state.datePoint,
          heats: state.heats as CCMHeat[],
          areaId: state.areaId
        }} />}

      {state.heats.length === 0 && state.title !== "" && <NoData />}
      {state.loading && <Loading />}
    </div>
  </div>
}
