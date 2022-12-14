import "./akosDetails.scss"
import { Alert, blinkAlert } from "components/extra/Alert"
import { useEffect, useState } from "react"
import { ListGroup, ListGroupItem } from "reactstrap"
import { StapleSummaryHandler } from "models/handlers/StapleHandlers/StapleSummaryHandler"
import { Loading } from "components/extra/Loading"
import aHandler from "models/handlers/DbHandlers/AgregatesDbHandler"
import { AKOSInstantEnergoDecoder, AKOSInstantEnergoInfo, AKOSInstantHeatDecoder, AKOSInstantHeatInfo } from "models/types/Agregates/Staples/AKOSInstantInfo"
import { AKOSAgregateInfo } from "models/types/Agregates/Staples/AKOSAgregateInfo"
import { AKPView } from "../views/akp"
import { AgregateState } from "models/types/Agregates/Staples/AgregateState"



type State = {
  heat?: AKOSInstantHeatInfo
  energo?: AKOSInstantEnergoInfo
  samples?: string[]
  mysql?: AKOSAgregateInfo
  lastUpdate?: string
  agregateState?: AgregateState
}



export const AKOSDetails: React.FC = () => {

  const [state, setState] = useState<State>({})

  const update = () => {
    aHandler.ReadStapleSummaryAsync()
      .then(data => {
        const mysql = new StapleSummaryHandler(data).GetAKOSInfo()

        const heat: AKOSInstantHeatInfo = {
          HeatId: mysql.heatId,
          HeatTab: mysql.heatTab,
          LadleId: mysql.ladleId,
          SteelGrade: mysql.steelGrade,
          HeatWeight: mysql.heatWeight,
          StoikSvod: mysql.stoikSvod,
          CurrentTemp: mysql.currentTemp,
        }

        const energo: AKOSInstantEnergoInfo = {
          HeatCurrentTime: mysql.heatCurrentTime,
          ArgonTime: mysql.argonTime,
          ArgonTimeDown: mysql.argonTimeDown,
          ArgonDelay: mysql.argonDelay,
          eeHeatActive: mysql.eeHeatActive,
          ArgonFlow: mysql.argonFlow,
          ArgonFlowDown: mysql.argonFlowDown,
          ArgonPressure: mysql.argonPressure,
          ArgonFlowInst: mysql.argonFlowInst,
          ArgonFlowInstPwd: mysql.argonFlowInstPwd,
          SteamPipeVacuum: mysql.steamPipeVacuum,
        }

        const samples: string[] | undefined = mysql.samples?.split(";")

        setState({
          ...state,
          heat,
          energo,
          mysql,
          samples,
          agregateState: mysql.state,
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





  return <div className="akos-details-wrapper">
    <Alert>Hello</Alert>
    <div className={`title display-5 ${state.agregateState}`} style={{ gridArea: "title" }}>
      ????????
      <div className="last-update">{state.lastUpdate}</div>
    </div>

    <span className="a-like" style={{ gridArea: "title" }} onClick={() => window.history.back()}>??????????</span>

    <ListGroup className={`heat ${state.agregateState}`} style={{ gridArea: "heat" }}>
      {state.heat && Object.keys(state.heat).map(key =>
        <ListGroupItem key={key}>
          <div>{(AKOSInstantHeatDecoder as any)[key]}</div>
          <div>{(state.heat as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.heat && <Loading />}
    </ListGroup>

    <ListGroup className={`energo ${state.agregateState}`} style={{ gridArea: "energo" }}>
      {state.energo && Object.keys(state.energo).map(key =>
        <ListGroupItem key={key}>
          <div>{(AKOSInstantEnergoDecoder as any)[key]}</div>
          <div>{(state.energo as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.energo && <Loading />}
    </ListGroup>

    <ListGroup className={`samples ${state.agregateState}`} style={{ gridArea: "samples" }}>
      {state.samples && state.samples.length > 0 && state.samples.map(pair => {
        if (pair === "") return <div key={1}></div>
        const split = pair.split("=")
        return <ListGroupItem key={pair}>
          <div>{split[0]}</div>
          <div>{split[1]} ???</div>
        </ListGroupItem>
      })}
    </ListGroup>

    <div className={`chems ${state.agregateState}`}>
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


    {state.mysql && <AKPView
      energy={state.mysql.energy!}
      argon={state.mysql.argon!}
      capdown={state.mysql.capdown!}
      empty={state.mysql.empty!}
      vacuum={state.mysql.vacuum!}
      vd={false}
    />}
  </div>
}