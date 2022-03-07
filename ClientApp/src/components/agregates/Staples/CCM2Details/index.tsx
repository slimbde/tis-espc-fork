import "./ccm2Details.scss"
import { Alert, blinkAlert } from "components/extra/Alert"
import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo"
import { CCMInstantCrystDecoder, CCMInstantCrystInfo, CCMInstantHeatDecoder, CCMInstantHeatInfo, CCMInstantPhysDecoder, CCMInstantPhysInfo } from "models/types/Agregates/Staples/CCMInstantInfo"
import { useEffect, useState } from "react"
import { ListGroup, ListGroupItem } from "reactstrap"
import { CCMView } from "../views/ccm12"
import { StapleSummaryHandler } from "models/handlers/StapleHandlers/StapleSummaryHandler"
import { Loading } from "components/extra/Loading"
import { AgregateState } from "models/types/Agregates/Staples/AgregateState"
import aHandler from "models/handlers/DbHandlers/AgregatesDbHandler"


type State = {
  heat?: CCMInstantHeatInfo
  cryst?: CCMInstantCrystInfo
  phys?: CCMInstantPhysInfo
  samples?: string[]
  mysql?: AgregateInfo
  events?: string[]
  lastUpdate?: string
  agregateState?: AgregateState
}



export const CCM2Details: React.FC = () => {

  const [state, setState] = useState<State>({})

  const update = () => {
    aHandler.ReadCCM2InstantAsync()
      .then(data => {
        const mysql = new StapleSummaryHandler(data.mysql).GetMNLZ2Info()

        data.heat.HeatId = `${mysql.heatId!} (${mysql.series})`

        if (data.phys.CastingSpeed === "0") {
          data.samples = []
          data.heat.CutId = ""
          data.heat.SteelGradeId = ""
          data.heat.TundishCar = ""
        }

        setState({
          ...state,
          heat: data.heat,
          cryst: data.cryst,
          phys: data.phys,
          samples: data.samples,
          mysql,
          events: data.events,
          lastUpdate: new Date().toLocaleTimeString(),
          agregateState: mysql.state,
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





  return <div className="ccm2-details-wrapper">
    <Alert>Hello</Alert>
    <div className={`title display-5 ${state.agregateState}`} style={{ gridArea: "title" }}>
      МНЛЗ-2
      <div className="last-update">{state.lastUpdate}</div>
    </div>

    <span className="a-like" style={{ gridArea: "title" }} onClick={() => window.history.back()}>Назад</span>

    <ListGroup className={`heat ${state.agregateState}`} style={{ gridArea: "heat" }}>
      {state.heat && Object.keys(state.heat).map(key =>
        <ListGroupItem key={key}>
          <div>{(CCMInstantHeatDecoder as any)[key]}</div>
          <div>{(state.heat as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.heat && <Loading />}
    </ListGroup>

    <ListGroup className={`cryst ${state.agregateState}`} style={{ gridArea: "cryst" }}>
      {state.cryst && Object.keys(state.cryst).map(key =>
        <ListGroupItem key={key}>
          <div>{(CCMInstantCrystDecoder as any)[key]}</div>
          <div>{(state.cryst as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.cryst && <Loading />}
    </ListGroup>

    <ListGroup className={`phys ${state.agregateState}`} style={{ gridArea: "phys" }}>
      {state.phys && Object.keys(state.phys).map(key =>
        <ListGroupItem key={key}>
          <div>{(CCMInstantPhysDecoder as any)[key]}</div>
          <div>{(state.phys as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.phys && <Loading />}
    </ListGroup>

    <div className={`samples ${state.agregateState}`} style={{ gridArea: "samples" }}>
      {state?.samples && state.samples.map((key, id) => <div key={id}>{key}</div>)}
      {!state.samples && <Loading />}
    </div>

    <ListGroup className={`events ${state.agregateState}`} style={{ gridArea: "events" }}>
      {state.events?.map(key => <ListGroupItem key={key}>{key}</ListGroupItem>)}
      {!state.events && <Loading />}
    </ListGroup>

    {state.mysql && <CCMView cast={state.mysql?.streamCast!} head={state.mysql?.tgs!} />}
  </div>
}