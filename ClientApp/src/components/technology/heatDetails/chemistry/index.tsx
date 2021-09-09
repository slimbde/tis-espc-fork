import "./chemistry.scss"
import React, { useEffect, useState } from "react"
import { hHandler } from "models/handlers/DbHandlers/IDbHandler"
import { Table } from "reactstrap"
import { ChemistryElement } from "models/types/ChemistryElement"
import { Loading } from "components/extra/Loading"

type Props = {
  REPORT_COUNTER: number
}

const Chemistry: React.FC<Props> = ({
  REPORT_COUNTER,
}) => {

  const [elements, setElements] = useState<ChemistryElement[]>([])

  useEffect(() => {
    hHandler.GetChemistryAsync(REPORT_COUNTER)
      .then(elements => setElements(elements))
      .catch(console.error)
    //eslint-disable-next-line
  }, [])

  return <div className="chemistry-wrapper">
    {elements.length > 0 &&
      <Table size="sm" hover>
        <thead>
          <tr>
            <th>Элемент</th>
            <th>Мин</th>
            <th>Макс</th>
            <th>Цель</th>
            <th>{elements[0].AN1_POINT}</th>
            <th>{elements[0].AN2_POINT}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {elements.map(e =>
            <tr key={e.ELEMENT_NAME}>
              <td>{e.ELEMENT_NAME}</td>
              <td>{e.MIN}</td>
              <td>{e.MAX}</td>
              <td>{e.AIM}</td>
              <td>{e.AN1}</td>
              <td>{e.AN2}</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </Table>}
    {elements.length === 0 && <Loading />}
  </div>
}

export default Chemistry