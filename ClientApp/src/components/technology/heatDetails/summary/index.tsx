import "./summary.scss"
import React, { useEffect, useState } from "react"
import { hHandler } from "models/handlers/DbHandlers/IDbHandler"
import decoder, { HeatSummary } from "models/types/HeatSummary"
import { Loading } from "components/extra/Loading"

type Props = {
  REPORT_COUNTER: number
}

const Summary: React.FC<Props> = ({
  REPORT_COUNTER,
}) => {

  const [summary, setSummary] = useState<HeatSummary | undefined>(undefined)

  useEffect(() => {
    hHandler.GetHeatSummaryAsync(REPORT_COUNTER)
      .then(summary => setSummary(summary))
      .catch(console.error)
    //eslint-disable-next-line
  }, [])

  // counters for the grid
  let rowCounter = 1
  let ladleCounter = 1
  let tundishCounter = 1

  return <div className="summary-wrapper">
    {summary && Object.keys(summary).map(key => {
      if (key === "HEAT_ID")
        return null

      const isLadleParam = key.indexOf("LADLE") > -1
      const isTundishParam = key.indexOf("TUNDISH") > -1

      return <div className="summary-field" key={key} style={{
        gridColumn: isLadleParam
          ? "2/3"
          : isTundishParam
            ? "3/4"
            : "1/2",
        gridRow: isLadleParam
          ? ladleCounter++
          : isTundishParam
            ? tundishCounter++
            : rowCounter++
      }}>
        <div>{decoder(key as keyof (HeatSummary))}</div>
        <div>{(summary as any)[key]}</div>
      </div>
    })}
    {!summary && <Loading />}
  </div>
}

export default Summary