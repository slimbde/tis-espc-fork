import "./list.scss"
import moment from "moment"
import React, { useEffect, useState } from "react"
import Controls from "./Controls"
import { Heat } from "models/types/Heat"
import { hHandler } from "models/handlers/DbHandlers/IDbHandler"
import { Table } from "reactstrap"
import { Link, useRouteMatch } from "react-router-dom"
import { Loading } from "components/extra/Loading"
import NoData from "../../extra/NoData"


type State = {
  heats: Heat[]
  shift: number
  datePoint: string
  title: string
}


export const List: React.FC = () => {
  const match = useRouteMatch<{ DATE: string, SHIFT: string }>()
  const date = match.params.DATE
  const shift = +match.params.SHIFT

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


  const [state, setState] = useState<State>({
    heats: [],
    shift: shift || calculateShift(),
    datePoint: date || calculateDate(),
    title: ""
  })

  useEffect(() => {
    const [bDate, eDate] = calculatePoints(state.shift, state.datePoint)

    hHandler.GetListForAsync(bDate, eDate)
      .then(heats => {
        setState({ ...state, heats, title: `${moment(bDate).format("DD.MM.YYYY HH:mm")} ... ${moment(eDate).format("DD.MM.YYYY HH:mm")}` })
      })
      .catch(console.error)
    // eslint-disable-next-line
  }, [state.shift, state.datePoint])

  const calculatePoints = (shift: number, datePoint: string) => {
    const bDate1 = `${moment(datePoint).subtract(1, "day").toISOString(true).slice(0, 10)} 19:30`
    const eDate1 = `${moment(datePoint).toISOString(true).slice(0, 10)} 07:30`
    const bDate2 = `${moment(datePoint).toISOString(true).slice(0, 10)} 07:30`
    const eDate2 = `${moment(datePoint).toISOString(true).slice(0, 10)} 19:30`

    return shift === 1
      ? [bDate1, eDate1]
      : [bDate2, eDate2]
  }


  const shiftChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, shift: +e.target.value })
  const dateChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, datePoint: e.target.value })

  const reset = () => {
    const shift = calculateShift()
    const datePoint = calculateDate().slice(0, 10)

    const [bDate, eDate] = calculatePoints(shift, datePoint)
    hHandler.GetListForAsync(bDate, eDate)
      .then(heats => setState({
        ...state,
        shift,
        datePoint,
        heats,
        title: `${moment(bDate).format("DD.MM.YYYY HH:mm")} ... ${moment(eDate).format("DD.MM.YYYY HH:mm")}`
      }))
      .catch(console.error)
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
  const find = (heatId: string) => {
    if (heatId === "" || heatId === "0") {
      reset()
      return
    }

    hHandler.FindListForAsync(heatId)
      .then(heats => setState({ ...state, heats }))
      .catch(console.error)
  }



  return <div className="list-wrapper">
    <div className="title display-5">ОТЧЕТ ПО ПЛАВКАМ МНЛЗ-5</div>

    <div className="files">
      <a href="http://10.2.59.20/ibaHistory">Файлы ibaPDA. Архив</a>
      <a href="http://10.2.59.20/ibaToday">Файлы ibaPDA за текущую дату</a>
    </div>

    <Controls {...{ date: state.datePoint, shift: state.shift, shiftChange, dateChange, reset, back, forth, find }} />

    <div className="main">
      <div className="main-title">{state.title}</div>
      <Table size="sm" striped>
        <thead>
          <tr>
            <th>№ плавки</th>
            <th>Начало плавки</th>
            <th>Окончание плавки</th>
            <th>№ в серии</th>
            <th>Марка</th>
            <th>ПК</th>
            <th>Заготовка</th>
          </tr>
        </thead>
        <tbody>
          {state.heats?.map(h => <tr key={`${h.HEAT_ID}${h.START_TIME}`}>
            <td><Link to={`/tech-params/${h.HEAT_ID}/${h.REPORT_COUNTER}/${state.datePoint}/${state.shift}`}>{h.HEAT_ID}</Link></td>
            <td>{h.START_TIME}</td>
            <td>{h.STOP_TIME}</td>
            <td>{h.SEQ}</td>
            <td>{h.STEEL_GRADE_ID}</td>
            <td>{h.TUNDISH_ID}</td>
            <td>{h.PRODUCT_SIZE}</td>
          </tr>)}
        </tbody>
      </Table>
      {state.title === "" && <Loading />}
      {state.heats.length === 0 && state.title !== "" && <NoData />}
    </div>
  </div>
}