import "./protocol.scss"
import { useState } from "react"
import { useRouteMatch } from "react-router-dom"
import { blinkAlert } from "components/extra/Alert"
import { AgregateAreaId } from "models/types/Agregates/Dryers/AgregateAreaId"
import { ProtocolFilter } from "models/types/Agregates/Dryers/Protocol/ProtocolFilter"
import { ProtocolEntry } from "models/types/Agregates/Dryers/Protocol/ProtocolEntry"
import agrHandler from "models/handlers/DbHandlers/AgregatesDbHandler"
import { Controls } from "./Controls"
import { applyShade, removeShade } from "components/extra/Shade"
import { Table } from "reactstrap"
import moment from "moment"
import NoData from "components/extra/NoData"


type State = {
  areaId: AgregateAreaId
  loading: boolean
  isLoaded: boolean
  data: ProtocolEntry[]
}



export const DryerProtocol: React.FC = () => {
  const match = useRouteMatch<{ ID: string }>()

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
    loading: false,
    isLoaded: false,
    data: [],
  })


  const applyFilter = async (filter: ProtocolFilter) => {
    try {
      applyShade()
      setState({ ...state, loading: true })
      const data = await agrHandler.ReadDryerHistoryBoolAsync(filter)
      setState({ ...state, data, loading: false })
      removeShade()
    } catch (error) {
      console.log(error)
      blinkAlert(error as string, false)
      setState({ ...state, loading: false })
      removeShade()
    }
  }




  return <div className="protocol-wrapper">
    <Controls {...{ applyFilter, areaId: state.areaId, loading: state.loading }} />
    {!state.loading && state.data.length > 0 && <Table hover>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Время</th>
          <th>Действие</th>
          <th>Значение</th>
        </tr>
      </thead>
      <tbody>
        {state.data.map(d =>
          <tr key={`${d.RevisionTime}${d.Description}`}>
            <td>{moment(d.RevisionTime).format("DD.MM.YYYY")}</td>
            <td>{moment(d.RevisionTime).format("HH:mm:ss")}</td>
            <td>{d.Description}</td>
            <td>{d.ValueString}</td>
          </tr>
        )}
      </tbody>
    </Table>}
    {state.isLoaded && state.data.length === 0 && <NoData />}
  </div>
}