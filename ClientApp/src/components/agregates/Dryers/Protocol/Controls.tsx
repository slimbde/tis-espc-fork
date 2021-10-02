import moment from "moment"
import { useState } from "react"
import { Button, Input, InputGroup } from "reactstrap"
import { blinkAlert } from "components/extra/Alert"
import { AgregateAreaId } from "models/types/Agregates/Dryers/AgregateAreaId"
import { ProtocolFilter } from "models/types/Agregates/Dryers/Protocol/ProtocolFilter"
import { Loading } from "components/extra/Loading"


type Props = {
  applyFilter: (filter: ProtocolFilter) => void
  areaId: AgregateAreaId,
  loading: boolean
}


type State = {
  dateFrom: string
  timeFrom: string
  dateTo: string
  timeTo: string
}



export const Controls: React.FC<Props> = ({
  applyFilter,
  areaId,
  loading,
}) => {

  const [state, setState] = useState<State>({
    dateFrom: moment().format("YYYY-MM-DD"),
    dateTo: moment().format("YYYY-MM-DD"),
    timeFrom: "07:30",
    timeTo: "19:30",
  })


  const dateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, dateFrom: e.target.value })
  const timeFromChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, timeFrom: e.target.value })
  const dateToChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, dateTo: e.target.value })
  const timeToChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, timeTo: e.target.value })

  const reset = () => setState({
    dateFrom: moment().format("YYYY-MM-DD"),
    dateTo: moment().format("YYYY-MM-DD"),
    timeFrom: "07:30",
    timeTo: "19:30",
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

    applyFilter({ areaId, from, to })
  }



  return <div className="navigation">
    <span style={{ gridArea: "from-title" }}>Начало:</span>
    <span style={{ gridArea: "to-title" }}>Окончание:</span>

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

    <Button
      size="sm"
      className="search-btn"
      disabled={loading}
      color="primary"
      outline onClick={checkFilter}
    >Поиск</Button>

    <p className="note">Ввиду большого числа записей поиск может длиться до 1мин</p>

    {loading && <Loading />}
  </div >
}