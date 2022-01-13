import "./dspDetails.scss"
import { blinkAlert } from "components/extra/Alert"
import { useEffect, useState } from "react"
import { Alert, ListGroup, ListGroupItem } from "reactstrap"
import { StapleSummaryHandler } from "models/handlers/StapleHandlers/StapleSummaryHandler"
import { Loading } from "components/extra/Loading"
import { DSPInstantEnergyDecoder, DSPInstantEnergyInfo, DSPInstantHeatDecoder, DSPInstantHeatInfo } from "models/types/Agregates/Staples/DSPInstantInfo"
import { DSPAgregateInfo } from "models/types/Agregates/Staples/DSPAgregateInfo"
import { DSPView } from "../views/dsp"
import aHandler from "models/handlers/DbHandlers/AgregatesDbHandler"


type State = {
  heat?: DSPInstantHeatInfo
  energy?: DSPInstantEnergyInfo
  mysql?: DSPAgregateInfo
  lastUpdate?: string
}



export const DSPDetails: React.FC = () => {

  const [state, setState] = useState<State>({})

  const update = () => {
    aHandler.ReadStapleSummaryAsync()
      .then(data => {
        const mysql = new StapleSummaryHandler(data).GetDSPInfo()

        const heat: DSPInstantHeatInfo = {
          HeatId: `${mysql.heatId!}`,
          HeatTab: mysql.heatTab,
          LadleId: mysql.ladleId,
          SteelGrade: mysql.steelGrade,
          PSN: mysql.psn,
          HeatCurrentTime: mysql.heatCurrentTime,
          HeatTime: mysql.heatTime,
          StoikSvodLg: mysql.stoikSvodLg,
          StoikSvodSm: mysql.stoikSvodSm,
          StoikWall: mysql.stoikWall,
          StoikFloor: mysql.stoikFloor,
          StoikQ1: mysql.stoikQ1,
          StoikQ2: mysql.stoikQ2,
          StoikErk: mysql.stoikErk,
          StoikCaseFrmw: mysql.stoikCaseFrmw,
          StoikSvodFrmw: mysql.stoikSvodFrmw,
        }

        const energy: DSPInstantEnergyInfo = {
          eeHeatActive: mysql.eeHeatActive,
          eeHeatReactive: mysql.eeHeatReactive,
          eeTodayActive: mysql.eeTodayActive,
          eeTodayReactive: mysql.eeTodayReactive,
          eeYestActive: mysql.eeYestActive,
          eeYestReactive: mysql.eeYestReactive,
        }

        setState({
          ...state,
          heat,
          energy,
          mysql,
          lastUpdate: new Date().toLocaleTimeString()
        })
      })
      .catch(error => {
        console.log(error)
        blinkAlert("Обновление не удалось", false)
      })
  }

  useEffect(() => {
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
    //eslint-disable-next-line
  }, [])

  const dspState = () => {
    if (state.mysql?.energy || state.mysql?.refining) return "state-process"
    return "state-idle"
  }




  return <div className="dsp-details-wrapper">
    <Alert id="alert">Hello</Alert>
    <div className={`title display-5 ${dspState()}`} style={{ gridArea: "title" }}>
      ДСП
      <div className="last-update">{state.lastUpdate}</div>
    </div>

    <span className="a-like" style={{ gridArea: "title" }} onClick={() => window.history.back()}>Назад</span>

    <ListGroup className={`heat ${dspState()}`} style={{ gridArea: "heat" }}>
      {state.heat && Object.keys(state.heat).map(key =>
        <ListGroupItem key={key}>
          <div>{(DSPInstantHeatDecoder as any)[key]}</div>
          <div>{(state.heat as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.heat && <Loading />}
    </ListGroup>

    <ListGroup className={`energy ${dspState()}`} style={{ gridArea: "energy" }}>
      {state.energy && Object.keys(state.energy).map(key =>
        <ListGroupItem key={key}>
          <div>{(DSPInstantEnergyDecoder as any)[key]}</div>
          <div>{(state.energy as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.energy && <Loading />}
    </ListGroup>


    {state.mysql && <DSPView energy={state.mysql.energy!} refining={state.mysql.refining!} />}
  </div>
}