import moment from "moment"
import { useState } from "react"
import { Filter } from "models/types/Diagnostic/Operators/Filter"
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap"
import { blinkAlert } from "components/extra/Alert"


type Props = {
  applyFilter: (filter: Filter) => void
}


type State = {
  dateFrom: string
  timeFrom: string
  dateTo: string
  timeTo: string
  operation: string
  heatId: string
}



export const Controls: React.FC<Props> = ({
  applyFilter,
}) => {

  const [state, setState] = useState<State>({
    dateFrom: moment().format("YYYY-MM-DD"),
    dateTo: moment().format("YYYY-MM-DD"),
    timeFrom: "07:30",
    timeTo: "19:30",
    operation: "Нажатие кнопок на пультах",
    heatId: "",
  })


  const dateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, dateFrom: e.target.value })
  const timeFromChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, timeFrom: e.target.value })
  const dateToChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, dateTo: e.target.value })
  const timeToChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, timeTo: e.target.value })
  const operationChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, operation: e.target.value })
  const heatChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, heatId: e.target.value })

  const reset = () => setState({
    dateFrom: moment().format("YYYY-MM-DD"),
    dateTo: moment().format("YYYY-MM-DD"),
    timeFrom: "07:30",
    timeTo: "19:30",
    operation: "Нажатие кнопок на пультах",
    heatId: "",
  })

  const checkFilter = () => {
    if (state.heatId !== "") {
      applyFilter({ operation: state.operation, heatId: state.heatId })
      return
    }

    const from = `${state.dateFrom} ${state.timeFrom}:00`
    const to = `${state.dateTo} ${state.timeTo}:00`
    if (moment(from) > moment(to)) {
      blinkAlert("Неверно задан интервал", false)
      return
    }

    applyFilter({ operation: state.operation, from, to })
  }



  return <div className="navigation">
    <span style={{ gridArea: "from-title" }}>Начало:</span>
    <span style={{ gridArea: "to-title" }}>Окончание:</span>
    <span style={{ gridArea: "operation-title" }}>Операция:</span>
    <span style={{ gridArea: "heat-title" }}>Плавка:</span>

    <Button
      style={{ gridArea: "reset", borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
      size="sm"
      outline
      onClick={reset}
    >Сброс</Button>
    <InputGroup size="sm" style={{ gridArea: "from" }}>
      <Input
        style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0", borderLeft: "0" }}
        type="date"
        onChange={e => dateFromChange(e)}
        value={state.dateFrom}
      />
      <Input
        style={{ borderTopRightRadius: "0", borderBottomRightRadius: "0", borderRight: "0" }}
        type="time"
        onChange={e => timeFromChange(e)}
        value={state.timeFrom}
      />
    </InputGroup>


    <InputGroup size="sm" style={{ gridArea: "to" }}    >
      <Input
        style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
        type="date"
        onChange={e => dateToChange(e)}
        value={state.dateTo}
      />
      <Input
        style={{ borderTopRightRadius: "0", borderBottomRightRadius: "0", borderRight: "0" }}
        type="time"
        onChange={e => timeToChange(e)}
        value={state.timeTo}
      />
    </InputGroup>

    <Input
      bsSize="sm"
      style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0", borderTopRightRadius: "0", borderBottomRightRadius: "0", borderRight: "0", gridArea: "operation" }}
      type="select"
      onChange={e => operationChange(e)}
      value={state.operation}
    >
      <option>Нажатие кнопок на пультах</option>
      <option>Команды ЧМИ</option>
      <option>Изменение уставок на ЧМИ</option>
      <option>Компрессорная</option>
    </Input>

    <InputGroup style={{ gridArea: "heat" }}>
      <Input
        style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
        bsSize="sm"
        type="number"
        placeholder="Номер плавки..."
        onChange={e => heatChange(e)}
        value={state.heatId}
      />
      <InputGroupAddon addonType="append">
        <Button size="sm" color="primary" outline onClick={checkFilter}>Поиск</Button>
        <Button size="sm" color="success" outline onClick={() => ({})}>Excel</Button>
      </InputGroupAddon>
    </InputGroup>
  </div >
}