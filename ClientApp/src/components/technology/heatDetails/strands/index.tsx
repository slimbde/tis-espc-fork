import "./strands.scss"
import React, { useEffect, useState } from "react"
import { hHandler } from "models/handlers/DbHandlers/IDbHandler"
import decoder, { StrandsInfo, StrandSummary } from "models/types/StrandSummary"
import { Table } from "reactstrap"
import { Loading } from "components/extra/Loading"
import { blinkAlert } from "components/extra/Alert"
import NoData from "components/extra/NoData"

type Props = {
  REPORT_COUNTER: number
}

const Strands: React.FC<Props> = ({
  REPORT_COUNTER,
}) => {

  const [strands, setStrands] = useState<StrandsInfo | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    hHandler.GetStrandsSummaryAsync(REPORT_COUNTER)
      .then(strands => {
        setStrands(Object.keys(strands).length > 0 ? strands : undefined)
        setLoading(false)
      })
      .catch(error => {
        blinkAlert(error, false)
        setLoading(false)
      })
    //eslint-disable-next-line
  }, [])


  return <div className="strands-wrapper">
    {strands &&
      <Table size="sm" hover>
        <thead>
          <tr>
            <th></th>
            <th>Ручей 1</th>
            <th>Ручей 2</th>
            <th>Ручей 3</th>
            <th>Ручей 4</th>
            <th>Ручей 5</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(strands[Object.keys(strands)[0]]).map(p => {
            if (p === "STRAND_NO") return null

            return <tr key={p}>
              <td>{decoder(p as keyof StrandSummary)}</td>
              {strands[1] ? <td>{(strands[1] as any)[p]}</td> : <td>---</td>}
              {strands[2] ? <td>{(strands[2] as any)[p]}</td> : <td>---</td>}
              {strands[3] ? <td>{(strands[3] as any)[p]}</td> : <td>---</td>}
              {strands[4] ? <td>{(strands[4] as any)[p]}</td> : <td>---</td>}
              {strands[5] ? <td>{(strands[5] as any)[p]}</td> : <td>---</td>}
            </tr>
          })}
        </tbody>
      </Table>}
    {loading && <Loading />}
    {!strands && <NoData />}
  </div>
}

export default Strands
