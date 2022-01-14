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
    if (state.mysql?.energy) return "state-heating"
    if (state.mysql?.flushSteel) return "state-flush-steel"
    if (state.mysql?.flushSlag) return "state-flush-slag"
    if (state.mysql?.eeHeatActive) return "state-hot-idle"
    return "state-idle"
  }



  const gasItem = (title: string, values: string) =>
    <div className="gas-rows">
      <div className="gas-item">{title}</div>
      {values.split(";").map((val, idx) => <div className="gas-item" key={`${title}${idx}`}>{val}</div>)}
    </div>





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

    <div className={`gas ${dspState()}`}>
      <div className="gas-header">
        <div></div>
        <div>Газ</div>
        <div>O&#8322; на горелку</div>
        <div>O&#8322; на продувку</div>
      </div>
      <div className="gas-sub-header">
        <div></div>
        <div>мгн</div>
        <div>сумм</div>
        <div>мгн</div>
        <div>сумм</div>
        <div>мгн</div>
        <div>сумм</div>
      </div>
      {state.mysql?.gas &&
        <>
          {gasItem("СГФ1", state.mysql.gas[0])}
          {gasItem("СГФ2", state.mysql.gas[1])}
          {gasItem("СГФ3", state.mysql.gas[2])}
          {gasItem("СГФ4", state.mysql.gas[3])}
          {gasItem("СГФ5", state.mysql.gas[4])}
          {gasItem("MФ", state.mysql.gas[5])}
          {gasItem("ПК", state.mysql.gas[6])}
          {gasItem("СУММ", state.mysql.gas[7])}
        </>}
    </div>


    {state.mysql && <DSPView
      energy={state.mysql.energy!}
      coldIdle={!state.mysql.eeHeatActive!}
      flushSteel={state.mysql.flushSteel!}
      flushSlag={state.mysql.flushSlag!}
    />}
  </div>
}