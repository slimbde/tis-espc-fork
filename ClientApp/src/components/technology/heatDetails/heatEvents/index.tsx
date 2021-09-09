import "./heatEvents.scss"
import React, { useEffect, useState } from "react"
import { hHandler } from "models/handlers/DbHandlers/IDbHandler"
import { Table } from "reactstrap"
import { HeatEvent } from "models/types/HeatEvent"
import { Loading } from "components/extra/Loading"

type Props = {
  REPORT_COUNTER: number
}

const HeatEvents: React.FC<Props> = ({
  REPORT_COUNTER,
}) => {

  const [elements, setElements] = useState<HeatEvent[]>([])

  useEffect(() => {
    hHandler.GetEventsAsync(REPORT_COUNTER)
      .then(elements => setElements(elements))
      .catch(console.error)
    //eslint-disable-next-line
  }, [])

  return <div className="events-wrapper">
    {elements.length > 0 &&
      <Table size="sm" hover>
        <thead>
          <tr>
            <th>Дата/время</th>
            <th>Событие</th>
          </tr>
        </thead>
        <tbody>
          {elements.map(e =>
            <tr key={`${e.MSG}${e.EVENT_DATE}`}>
              <td>{e.EVENT_DATE}</td>
              <td>{e.MSG}</td>
            </tr>
          )}
        </tbody>
      </Table>}
    {elements.length === 0 && <Loading />}
  </div>
}

export default HeatEvents