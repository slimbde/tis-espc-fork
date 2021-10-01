import "./chart.scss"
import { AgregateAreaId } from "models/types/Agregates/Dryers/AgregateAreaId"
import { ChartParams } from "models/types/Agregates/Dryers/Chart/ChartParams"
import { useRef, useState } from "react"
import { useRouteMatch } from "react-router-dom"
import agrHandler from "models/handlers/DbHandlers/AgregatesDbHandler"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { Loading } from "components/extra/Loading"
import moment from "moment"
import Highcharts from 'highcharts'
import { blinkAlert } from "components/extra/Alert"



type State = {
  areaId: AgregateAreaId
  param: ChartParams
  from: string
  to: string
  loading: boolean
}




export const DryerChart: React.FC = () => {
  const match = useRouteMatch<{ ID: string }>()

  const chartRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const getAreaId = (id: string) => {
    switch (id) {
      case "1": return AgregateAreaId.DryerHistory1
      case "2": return AgregateAreaId.DryerHistory2
      case "3": return AgregateAreaId.HeaterHistory1
      case "4": return AgregateAreaId.HeaterHistory2
    }
    return AgregateAreaId.DryerHistory1
  }

  const [state, setState] = useState<State>({
    areaId: getAreaId(match.params.ID),
    param: Object.keys(ChartParams)[0] as ChartParams,
    from: moment().subtract(15, "days").toISOString(true).slice(0, 10),
    to: (new Date()).toISOString().slice(0, 10),
    loading: false,
  })



  const paramChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, param: e.target.value as unknown as ChartParams })
  const fromChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, from: e.target.value })
  const toChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, to: e.target.value })


  const populateChart = () => {
    const loading = document.getElementById("loading")
    loading && (loading.style.opacity = "1")

    btnRef.current!.disabled = true

    agrHandler.ReadDryerHistoryAsync({
      areaId: state.areaId,
      from: state.from,
      to: moment(state.to).add(1, "day").format("YYYY-MM-DD"),
      param: state.param
    })
      .then(chartPoints => {
        if (chartPoints.length === 0)
          throw new Error()

        chartPoints.length > 0 && Highcharts.chart("chart", {
          title: { text: '' },
          subtitle: { text: '' },
          xAxis: {
            type: "datetime",
            tickInterval: 1,
            gridLineWidth: 1,
            categories: chartPoints.map(pt => moment(pt.RevisionTime, "YYYY-MM-DD").format("DD.MM.YYYY")),
            crosshair: true,
          },
          yAxis: {
            title: { text: '' },
          },
          legend: { enabled: false },
          tooltip: { shared: true },
          plotOptions: {
            series: {
              cursor: 'pointer',
              className: 'popup-on-click',
              animation: false,
              marker: {
                lineWidth: 1
              }
            }
          },
          series: [{
            type: "spline",
            lineWidth: 2,
            marker: { radius: 3 },
            name: state.param,
            data: chartPoints.map(pt => Math.round(pt.AVGValue * 100) / 100),
            color: "blue",
          }]
        })
        loading && (loading.style.opacity = "0")
        chartRef.current!.style.display = "block"
        btnRef.current!.disabled = false
      })
      .catch(error => {
        blinkAlert("Нет данных", false)
        chartRef.current!.style.display = "none"
        console.log(error)
        loading && (loading.style.opacity = "0")
        btnRef.current!.disabled = false
      })
  }

  return <div className="chart-wrapper">
    {<Form inline>
      <FormGroup>
        <Label for="param">Параметр</Label>
        <Input bsSize="sm" type="select" id="param" onChange={paramChange}>
          {Object.keys(ChartParams).map(p => <option key={p} value={p}>{(ChartParams as any)[p]}</option>)}
        </Input>
      </FormGroup>

      <FormGroup>
        <Label for="from">С</Label>
        <Input
          bsSize="sm"
          type="date"
          value={state.from}
          max={new Date().toISOString().slice(0, 10)}
          id="from"
          onChange={fromChange} />
      </FormGroup>

      <FormGroup>
        <Label for="to">По</Label>
        <Input
          bsSize="sm"
          type="date"
          value={state.to}
          max={new Date().toISOString().slice(0, 10)}
          id="to"
          onChange={toChange} />
      </FormGroup>

      <FormGroup className="loading-group">
        <Button innerRef={btnRef} outline color="primary" size="sm" onClick={populateChart}>Построить</Button>
        <p><Loading /></p>
      </FormGroup>
    </Form>}
    <div id="chart" ref={chartRef}></div>
  </div>
}
