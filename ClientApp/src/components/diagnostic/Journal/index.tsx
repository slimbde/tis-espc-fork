import "./journal.scss"
import { useState } from "react"
import { Alert, Button, ButtonGroup, Table } from "reactstrap"
import { Controls } from "components/diagnostic/Journal/Controls"
import { OperatorFilter } from "models/types/Diagnostic/Operators/OperatorFilter"
import { AreaId, getAreaName } from "models/types/AreaId"
import { EventPriorityProvider } from "models/types/Diagnostic/Operators/EventPrioritySet"
import { OperatorInfo } from "models/types/Diagnostic/Operators/OperatorInfo"
import dHandler from "models/handlers/DbHandlers/DiagnosticDbHandler"
import { blinkAlert } from "components/extra/Alert"
import { Loading } from "components/extra/Loading"
import NoData from "components/extra/NoData"
import moment from "moment"
import { useRouteMatch } from "react-router-dom"


type State = {
  areaId: AreaId
  loading: boolean
  operatorInfo: OperatorInfo[]
}


export const Journal: React.FC = () => {
  const match = useRouteMatch<{ AREAID: string, FROM: string, TO: string }>()

  const [state, setState] = useState<State>({
    areaId: +match.params.AREAID || AreaId.CCM_DIAG,
    loading: false,
    operatorInfo: [],
  })

  const applyFilter = async (filter: OperatorFilter) => {
    const eventPrioritySet = EventPriorityProvider(state.areaId)

    switch (filter.operation) {
      case "buttons": filter.eventPriority = eventPrioritySet.prioBtn; break;
      case "hmi_sets": filter.eventPriority = eventPrioritySet.prioHmiSets; break;
      case "hmi_cmds": filter.eventPriority = eventPrioritySet.prioHmiCmds; break;
      case "airpump_msg": filter.eventPriority = eventPrioritySet.prioAirpump as string; break;
    }

    try {
      setState({ ...state, loading: true })
      const operatorInfo = await dHandler.GetListForAsync(filter)
      setState({ ...state, operatorInfo, loading: false })
    } catch (error) {
      console.log(error)
      blinkAlert(error as string, false)
      setState({ ...state, loading: false })
    }
  }


  return <div className="journal-wrapper">
    <Alert id="alert">Hello</Alert>
    <div className="title display-5">Журнал действий оператора {getAreaName(state.areaId)}</div>
    <div className="subtitle">
      Отчеты из системы протоколирования
      <ButtonGroup size="sm">
        <Button color="info" outline active={state.areaId === AreaId.LF_DIAG} onClick={() => setState({ ...state, areaId: AreaId.LF_DIAG })}>АКП-2</Button>
        <Button color="info" outline active={state.areaId === AreaId.VOD_DIAG} onClick={() => setState({ ...state, areaId: AreaId.VOD_DIAG })}>ВКД</Button>
        <Button color="info" outline active={state.areaId === AreaId.CCM_DIAG} onClick={() => setState({ ...state, areaId: AreaId.CCM_DIAG })}>МНЛЗ-2</Button>
      </ButtonGroup>
    </div>
    <div className="controls">
      {state.loading && <Loading />}
      <Controls {...{ applyFilter, areaId: state.areaId, loading: state.loading }} />
    </div>
    {!state.loading && state.operatorInfo.length > 0 && <Table hover>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Время</th>
          <th>Действие / Параметр</th>
          <th>Было</th>
          <th>Стало</th>
        </tr>
      </thead>
      <tbody>
        {state.operatorInfo.map(oi =>
          <tr key={`${oi.EventStamp}${oi.Comment}${oi.OldValue}${oi.NewValue}`}>
            <td>{moment(oi.EventStamp).format("DD.MM.YYYY")}</td>
            <td>{moment(oi.EventStamp).format("HH:mm:ss")}</td>
            <td>{oi.Comment}</td>
            <td>{oi.OldValue}</td>
            <td>{oi.NewValue}</td>
          </tr>
        )}
      </tbody>
    </Table>}
    {!state.loading && state.operatorInfo.length === 0 && <NoData />}
  </div>
}