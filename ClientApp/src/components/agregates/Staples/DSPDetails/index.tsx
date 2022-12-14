import "./dspDetails.scss"
import { Alert, blinkAlert } from "components/extra/Alert"
import { useEffect, useState } from "react"
import { ListGroup, ListGroupItem } from "reactstrap"
import { StapleSummaryHandler } from "models/handlers/StapleHandlers/StapleSummaryHandler"
import { Loading } from "components/extra/Loading"
import { DSPInstantEnergyDecoder, DSPInstantEnergyInfo, DSPInstantHeatDecoder, DSPInstantHeatInfo } from "models/types/Agregates/Staples/DSPInstantInfo"
import { DSPAgregateInfo } from "models/types/Agregates/Staples/DSPAgregateInfo"
import { DSPView } from "../views/dsp"
import aHandler from "models/handlers/DbHandlers/AgregatesDbHandler"
import { AgregateState } from "models/types/Agregates/Staples/AgregateState"


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
        blinkAlert("???????????????????? ???? ??????????????", false)
      })
  }

  useEffect(() => {
    update()
    const interval = setInterval(update, (window as any).config.agregatesUpdateInterval)
    return () => clearInterval(interval)
    //eslint-disable-next-line
  }, [])



  const gasItem = (title: string, values: string) =>
    <div className="gas-rows">
      <div className="gas-item">{title}</div>
      {values.split(";").map((val, idx) => <div className="gas-item" key={`${title}${idx}`}>{val}</div>)}
    </div>





  return <div className="dsp-details-wrapper">
    <Alert>Hello</Alert>
    <div className={`title display-5 ${state.mysql?.state}`} style={{ gridArea: "title" }}>
      ??????
      <div className="last-update">{state.lastUpdate}</div>
    </div>

    <span className="a-like" style={{ gridArea: "title" }} onClick={() => window.history.back()}>??????????</span>

    <ListGroup className={`heat ${state.mysql?.state}`} style={{ gridArea: "heat" }}>
      {state.heat && Object.keys(state.heat).map(key =>
        <ListGroupItem key={key}>
          <div>{(DSPInstantHeatDecoder as any)[key]}</div>
          <div>{(state.heat as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.heat && <Loading />}
    </ListGroup>

    <ListGroup className={`energy ${state.mysql?.state}`} style={{ gridArea: "energy" }}>
      {state.energy && Object.keys(state.energy).map(key =>
        <ListGroupItem key={key}>
          <div>{(DSPInstantEnergyDecoder as any)[key]}</div>
          <div>{(state.energy as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.energy && <Loading />}
    </ListGroup>

    <div className={`gas ${state.mysql?.state}`}>
      <div className="gas-header">
        <div></div>
        <div>??????</div>
        <div>O&#8322; ???? ??????????????</div>
        <div>O&#8322; ???? ????????????????</div>
      </div>
      <div className="gas-sub-header">
        <div></div>
        <div>??????</div>
        <div>????????</div>
        <div>??????</div>
        <div>????????</div>
        <div>??????</div>
        <div>????????</div>
      </div>
      {state.mysql?.gas &&
        <>
          {gasItem("??????1", state.mysql.gas[0])}
          {gasItem("??????2", state.mysql.gas[1])}
          {gasItem("??????3", state.mysql.gas[2])}
          {gasItem("??????4", state.mysql.gas[3])}
          {gasItem("??????5", state.mysql.gas[4])}
          {gasItem("M??", state.mysql.gas[5])}
          {gasItem("????", state.mysql.gas[6])}
          {gasItem("????????", state.mysql.gas[7])}
        </>}
    </div>

    <div className={`chems ${state.mysql?.state}`}>
      <div className="chems-header">
        <div key={0}>???</div>
        <div key={1}>??????????</div>
        {state.mysql?.chemicalKey?.split(";").map(el => <div key={el}>{el}</div>)}
      </div>
      {state.mysql?.chemicals && state.mysql.chemicals.map(item =>
        <div className="chems-row" key={`${item.num}${item.time}`}>
          <div key={11} className="chems-item">{item.num}</div>
          <div key={12} className="chems-item">{item.time}</div>
          {item.elements.split(";").map((val, idx) => <div className="chems-item" key={`${val}${idx}`}>{val}</div>)}
        </div>)}
    </div>

    {state.mysql && <DSPView
      energy={state.mysql.energy!}
      coldIdle={state.mysql?.state === AgregateState.IDLE}
      flushSteel={state.mysql.flushSteel!}
      flushSlag={state.mysql.flushSlag!}
    />}
  </div>
}