import moment from "moment"
import { useState } from "react"
import { FilterOperation, OperatorFilter } from "models/types/Diagnostic/Operators/OperatorFilter"
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap"
import { blinkAlert } from "components/extra/Alert"
import { AreaId } from "models/types/Technology/Production/AreaId"
import { useRouteMatch } from "react-router-dom"


type Props = {
  applyFilter: (filter: OperatorFilter) => void
  areaId: AreaId,
  loading: boolean
}


type State = {
  dateFrom: string
  timeFrom: string
  dateTo: string
  timeTo: string
  operation: keyof FilterOperation
  comment: string
}



export const Controls: React.FC<Props> = ({
  applyFilter,
  areaId,
  loading,
}) => {

  const match = useRouteMatch<{ AREAID: string, FROM: string, TO: string }>()
  const from = match.params.FROM && moment(match.params.FROM)
  const to = match.params.TO && moment(match.params.TO)

  const [state, setState] = useState<State>({
    dateFrom: from ? from.format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
    dateTo: to ? to.format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
    timeFrom: from ? from.format("HH:mm") : "07:30",
    timeTo: to ? to.format("HH:mm") : "19:30",
    operation: "buttons",
    comment: "",
  })


  const getAreaOptions = () => {
    const options = [
      <option key="1" value="buttons">Нажатие кнопок на пультах</option>,
      <option key="2" value="hmi_cmds">Команды ЧМИ</option>,
      <option key="3" value="hmi_sets">Изменение уставок на ЧМИ</option>,
    ]

    if (areaId === AreaId.CCM_DIAG)
      options.push(<option key="4" value="airpump_msg">Компрессорная</option>)

    return options
  }


  const dateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, dateFrom: e.target.value })
  const timeFromChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, timeFrom: e.target.value })
  const dateToChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, dateTo: e.target.value })
  const timeToChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, timeTo: e.target.value })
  const operationChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, operation: e.target.value as keyof FilterOperation })
  const commentChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, comment: e.target.value })

  const reset = () => setState({
    dateFrom: moment().format("YYYY-MM-DD"),
    dateTo: moment().format("YYYY-MM-DD"),
    timeFrom: "07:30",
    timeTo: "19:30",
    operation: "buttons",
    comment: "",
  })

  const checkFilter = () => {
    const from = `${state.dateFrom} ${state.timeFrom}:00`
    const to = `${state.dateTo} ${state.timeTo}:00`
    if (moment(from) > moment(to)) {
      blinkAlert("Неверно задан интервал", false)
      return
    }
    if (moment(to).diff(moment(from), "days") > 30) {
      blinkAlert("Интервал болeе 30 сут. слишком велик", false)
      return
    }

    applyFilter({ operation: state.operation, from, to, comment: state.comment, areaId: (AreaId as any)[areaId] })
  }



  return <div className="navigation">
    <span style={{ gridArea: "from-title" }}>Начало:</span>
    <span style={{ gridArea: "to-title" }}>Окончание:</span>
    <span style={{ gridArea: "operation-title" }}>Операция:</span>
    <span style={{ gridArea: "heat-title" }}>Комментарий:</span>

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
    >{getAreaOptions()}</Input>

    <InputGroup style={{ gridArea: "heat" }}>
      <Input
        style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
        bsSize="sm"
        type="text"
        placeholder="..."
        onChange={e => commentChange(e)}
        value={state.comment}
      />
      <InputGroupAddon addonType="append">
        <Button size="sm" disabled={loading} color="primary" outline onClick={checkFilter}>Поиск</Button>
      </InputGroupAddon>
    </InputGroup>
  </div >
}