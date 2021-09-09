import "./corrections.scss"
import React, { useEffect, useState } from "react"
import { hHandler } from "models/handlers/DbHandlers/IDbHandler"
import { Table } from "reactstrap"
import { Correction } from "models/types/Correction"
import NoData from "components/extra/NoData"


type Props = {
  REPORT_COUNTER: number
}

const Corrections: React.FC<Props> = ({
  REPORT_COUNTER,
}) => {

  const [elements, setElements] = useState<Correction[]>([])

  useEffect(() => {
    hHandler.GetCorrectionsAsync(REPORT_COUNTER)
      .then(elements => setElements(elements))
      .catch(console.error)
    //eslint-disable-next-line
  }, [])

  return <div className="corrections-wrapper">
    {elements.length > 0 &&
      <Table size="sm" striped>
        <thead>
          <tr>
            <th>Дата/время</th>
            <th>Событие</th>
          </tr>
        </thead>
        <tbody>
          {elements.map(e =>
            <tr key={`${e.TEXT}${e.RESTORE_DATE}`}>
              <td>{e.RESTORE_DATE}</td>
              <td>[{e.AUTHOR}] :: {e.TEXT}</td>
            </tr>
          )}
        </tbody>
      </Table>}
    {elements.length === 0 && <NoData />}
  </div>
}

export default Corrections
