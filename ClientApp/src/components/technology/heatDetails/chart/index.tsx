import "./chart.scss"
import React, { useEffect, useRef, useState } from "react"
import { hHandler } from "models/handlers/DbHandlers/IDbHandler"
import Highcharts from 'highcharts'
import decoder from "./ParamsDecoder"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { Loading } from "components/extra/Loading"
import { blinkAlert } from "components/extra/Alert"


type Props = {
  heatId: number
}


type State = {
  strandNo: number
  productNums: number[]
  productNo: number
  varId: string
  loading: boolean
}




const Chart: React.FC<Props> = ({
  heatId,
}) => {

  const chartRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState<State>({
    strandNo: 1,
    productNums: [],
    productNo: 3,
    varId: "REP_WS_DMS_LV",
    loading: false
  })

  useEffect(() => {
    hHandler.GetProductsAsync(heatId, state.strandNo)
      .then(productNums => setState({ ...state, productNums }))
      .catch(console.log)
    //eslint-disable-next-line
  }, [state.strandNo])


  const varIdChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, varId: e.target.value })
  const strandChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, strandNo: +e.target.value })
  const productChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, productNo: +e.target.value })


  const populateChart = () => {
    const loading = document.getElementById("loading")
    loading && (loading.style.opacity = "1")

    hHandler.GetChartDataAsync(heatId, state.strandNo, state.productNo, state.varId)
      .then(chartData => {
        Highcharts.chart("chart", {
          title: { text: '' },
          subtitle: { text: '' },
          xAxis: {
            type: "datetime",
            tickInterval: 20,
            gridLineWidth: 1,
            categories: chartData?.POINTS.map(pt => pt.TIME.split(" ").join("<br />")),
            crosshair: true,
          },
          yAxis: {
            title: { text: '' },
          },
          legend: {
            align: 'left',
            verticalAlign: 'bottom',
            borderWidth: 0
          },
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
            name: decoder[state.varId],
            data: chartData?.POINTS.map(pt => Math.round(pt.VALUE * 100) / 100),
            color: "blue",
          }, {
            type: "line",
            lineWidth: 1,
            marker: { radius: 2 },
            name: "Среднее",
            data: chartData?.POINTS.map(pt => Math.round(+chartData?.AVERAGE! * 100) / 100),
            color: "red",
          }]
        })
        loading && (loading.style.opacity = "0")
        chartRef.current!.style.display = "block"
      })
      .catch(error => {
        blinkAlert("Нет данных", false)
        chartRef.current!.style.display = "none"
        console.log(error)
        loading && (loading.style.opacity = "0")
      })
  }





  return <div className="chart-wrapper">
    {<div className="chart-wrapper">
      <Form inline>
        <FormGroup>
          <Label for="strand">Ручей</Label>
          <Input bsSize="sm" type="select" name="select" id="strand" onChange={strandChange}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Input>
        </FormGroup>

        {state.productNums.length > 0
          ? <FormGroup>
            <Label for="productNo">Заготовка</Label>
            <Input bsSize="sm" type="select" name="select" id="product" onChange={productChange}>
              {state.productNums.map(num => <option value={num} key={num}>{num}</option>)}
            </Input>
          </FormGroup>
          : <div className="no-data">Нет заготовок</div>}

        {state.productNums.length > 0
          ? <>
            <FormGroup>
              <Label for="varId">Параметр</Label>
              <Input bsSize="sm" type="select" name="select" id="varId" onChange={varIdChange}>
                {Object.keys(decoder).map(key => <option value={key} key={key}>{decoder[key]}</option>)}
              </Input>
            </FormGroup>
            <FormGroup className="loading-group">
              <Button outline color="primary" size="sm" onClick={populateChart}>Построить</Button>
              <p><Loading /></p>
            </FormGroup>
          </>
          : <div></div>}
      </Form>
      <div id="chart" ref={chartRef}></div>
    </div>}
  </div>
}

export default Chart
