import "./vodDetails.scss"
import { Alert, blinkAlert } from "components/extra/Alert"
import { useEffect, useState } from "react"
import { ListGroup, ListGroupItem } from "reactstrap"
import { StapleSummaryHandler } from "models/handlers/StapleHandlers/StapleSummaryHandler"
import { Loading } from "components/extra/Loading"
import aHandler from "models/handlers/DbHandlers/AgregatesDbHandler"
import { AKPView } from "../views/akp"
import { AgregateState } from "models/types/Agregates/Staples/AgregateState"
import { useRouteMatch } from "react-router-dom"
import { AKPInstantHeatDecoder, AKPInstantInfo, VODInstantEnergoDecoder } from "models/types/Agregates/Staples/AKPInstantInfo"
import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo"
import moment from "moment"



type State = {
  instantInfo?: AKPInstantInfo
  mysql?: AgregateInfo
  lastUpdate?: string
  agregateState?: AgregateState
}



export const VODDetails: React.FC = () => {
  const match = useRouteMatch<{ TankId: string, HeatId: string }>()
  const [state, setState] = useState<State>({ agregateState: AgregateState.IDLE })

  const update = () => {
    aHandler.ReadAkpVodInstantAsync(+match.params.HeatId, 800)
      .then(instantInfo => {
        const mysql = new StapleSummaryHandler(instantInfo.mysql).GetVDInfo(+match.params.TankId as (2 | 1))

        instantInfo.energo.EeHeatActive = moment.utc(+instantInfo.energo.EeHeatActive! * 1000).format("HH:mm:ss")

        setState({
          ...state,
          mysql,
          instantInfo,
          agregateState: mysql.state,
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
    const interval = setInterval(update, (window as any).config.agregatesUpdateInterval)
    return () => clearInterval(interval)
    //eslint-disable-next-line
  }, [])







  return <div className="vod-details-wrapper">
    <Alert>Hello</Alert>
    <div className={`title display-5 ${state.agregateState}`} style={{ gridArea: "title" }}>
      ВД-{match.params.TankId}<small>поз</small>
      <div className="last-update">{state.lastUpdate}</div>
    </div>

    <span className="a-like" style={{ gridArea: "title" }} onClick={() => window.history.back()}>Назад</span>

    <ListGroup className={`heat ${state.agregateState}`} style={{ gridArea: "heat" }}>
      {state.instantInfo?.heat && Object.keys(state.instantInfo.heat).map(key =>
        <ListGroupItem key={key}>
          <div>{(AKPInstantHeatDecoder as any)[key]}</div>
          <div>{(state.instantInfo?.heat as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.instantInfo?.heat && <Loading />}
    </ListGroup>

    <ListGroup className={`energo ${state.agregateState}`} style={{ gridArea: "energo" }}>
      {state.instantInfo?.energo && Object.keys(state.instantInfo?.energo).map(key =>
        <ListGroupItem key={key}>
          <div>{(VODInstantEnergoDecoder as any)[key]}</div>
          <div>{(state.instantInfo?.energo as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.instantInfo?.energo && <Loading />}
    </ListGroup>

    <ListGroup className={`samples ${state.agregateState}`} style={{ gridArea: "samples" }}>
      {state.instantInfo?.samples && state.instantInfo?.samples.split(";").map(pair => {
        const split = pair.split("=")
        return <ListGroupItem key={pair}>
          <div>{split[0]}</div>
          <div>{split[1]} ℃</div>
        </ListGroupItem>
      })}
    </ListGroup>

    <div className={`chems ${state.agregateState}`}>
      {state.instantInfo?.chems && state.instantInfo?.chems.length > 0 && <div className="chems-header">
        <div key={0}>№</div>
        <div key={1}>Время</div>
        {state.instantInfo?.chemKeys?.map(el => <div key={el}>{el}</div>)}
      </div>}
      {state.instantInfo?.chems && state.instantInfo?.chems.length > 0 && state.instantInfo.chems.map(item =>
        <div className="chems-row" key={`${item.num}${item.time}`}>
          <div key={11} className="chems-item">{item.num}</div>
          <div key={12} className="chems-item">{item.time}</div>
          {item.elements.split(";").map((val, idx) => <div className="chems-item" key={`${val}${idx}`}>{val}</div>)}
        </div>)}
    </div>

    <ListGroup className={`events ${state.agregateState}`} style={{ gridArea: "events" }}>
      {state.instantInfo?.events && state.instantInfo.events.length > 0 && state.instantInfo.events.map(key => <ListGroupItem key={key}>{key}</ListGroupItem>)}
    </ListGroup>


    {state.mysql && <AKPView
      energy={state.mysql.energy!}
      argon={state.mysql.argon!}
      capdown={state.mysql.capdown!}
      empty={state.mysql.empty!}
      vacuum={state.mysql.vacuum!}
      vd={true}
    />}
  </div>
}