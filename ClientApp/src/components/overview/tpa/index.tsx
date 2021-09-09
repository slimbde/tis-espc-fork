import "./tpa.scss"
import React, { useRef, useState } from "react"
import { Idle } from "models/types/Idle"
import { Alert, Button, Input, InputGroup, Table } from "reactstrap"
import { blinkAlert } from "components/extra/Alert"
import { populateChart } from "./populateChart"
import iHandler from "models/handlers/IdleHandler"
import moment from "moment"
import { Loading } from "components/extra/Loading"


type State = {
  idles: Idle[]
}


export const TPA: React.FC = () => {
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)

  const [state, setState] = useState<State>({
    idles: []
  })


  const getIdles = () => {
    const bDate = fromRef.current!.value
    const eDate = toRef.current!.value

    if (moment(bDate) > moment(eDate)) {
      blinkAlert("Ошибка! Начальная дата позднее конечной!", false)
      return
    }

    const loading = document.getElementById("loading") as HTMLImageElement
    try {
      loading && (loading.style.opacity = "1")

      iHandler.GetIdlesForAsync(bDate, eDate)
        .then(idles => {
          setState({ ...state, idles })
          populateChart(idles)
        })
    } catch (error) {
      blinkAlert((error as string), false)
      console.log(error)
    }

    loading && (loading.style.opacity = "0")
  }

  const getDiff = (begin: string, end: string) => {
    const start = moment(begin)
    const finish = moment(end)
    const durationMin = finish.diff(start, "minutes")

    const days = finish.diff(start, "days")
    const hours = Math.floor((durationMin - days * 24 * 60) / 60)
    const minutes = durationMin - days * 24 * 60 - hours * 60
    return (days ? `${days}д ` : ``) + (hours ? `${hours}ч ` : ``) + `${minutes}мин`
  }

  const getClassName = (strand: string) => {
    if (strand.indexOf("1") > 0) return "strand-1"
    if (strand.indexOf("2") > 0) return "strand-2"
    if (strand.indexOf("3") > 0) return "strand-3"
    if (strand.indexOf("4") > 0) return "strand-4"
    if (strand.indexOf("5") > 0) return "strand-5"
    return ""
  }



  return <div className="tpa-wrapper jumbotron">
    <Alert id="alert">Hello</Alert>
    <div className="title display-5">МНЛЗ-5. Простои ТПА</div>

    <div className="report">
      <h2>Полный отчет</h2>
      <p>Получить отчет по всем зарегистрированным простоям в виде Excel файла</p>
      <p><Button
        size="sm"
        outline
        color="secondary"
        onClick={() => (window.location.assign(`http://10.2.59.133:90/Home/Download?filename=CCM_Idles.xlsx`))}
      >Получить файл &raquo;</Button></p>
    </div>

    <div className="controls">
      <h2>Выборка</h2>
      Выберите необходимый интервал
      и нажмите на запрос
      <InputGroup size="sm">
        <label htmlFor="startDate">Начальная дата</label>
        <Input
          innerRef={fromRef}
          type="date"
          id="startDate"
          min="2021-07-01"
          defaultValue={moment().toISOString(true).slice(0, 10)}
        />
      </InputGroup>
      <InputGroup size="sm">
        <label htmlFor="endDate">Конечная дата</label>
        <Input
          innerRef={toRef}
          type="date"
          id="endDate"
          min="2021-07-01"
          defaultValue={moment().toISOString(true).slice(0, 10)}
        />
      </InputGroup>
      <Loading />
      <Button size="sm" color="secondary" outline onClick={getIdles}>Запрос &raquo;</Button>
    </div>

    {state.idles.length > 0 && <Table hover>
      <thead>
        <tr>
          <th>Ручей</th>
          <th>ТПА</th>
          <th>Начало</th>
          <th>Окончание</th>
          <th>Простой</th>
          <th></th>
        </tr>
      </thead>
      <tbody id="contents">
        {state.idles.map(idl =>
          <tr className={getClassName(idl.IMMName)} key={`${idl.StartPoint}${Math.random()}`}>
            <td>{idl.IMMName}</td>
            <td>{idl.StreamName}</td>
            <td>{moment(idl.StartPoint).format("DD.MM.YYYY HH:mm:ss")}</td>
            <td>{idl.EndPoint && moment(idl.EndPoint).format("DD.MM.YYYY HH:mm:ss")}</td>
            <td>{idl.EndPoint && getDiff(idl.StartPoint, idl.EndPoint)}</td>
          </tr>)}
      </tbody>
    </Table>}

    {state.idles.length > 0 && <div id="chart-container"></div>}
  </div >
}