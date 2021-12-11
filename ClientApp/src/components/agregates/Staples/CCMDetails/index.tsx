import "./ccmDetails.scss"
import { blinkAlert } from "components/extra/Alert"
import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo"
import { CCMInstantCrystDecoder, CCMInstantCrystInfo, CCMInstantHeatDecoder, CCMInstantHeatInfo, CCMInstantPhysDecoder, CCMInstantPhysInfo } from "models/types/Agregates/Staples/CCMInstantInfo"
import { useEffect, useState } from "react"
import { Alert, ListGroup, ListGroupItem } from "reactstrap"
import { CCMView } from "../views/ccm12"
import { StapleSummaryHandler } from "models/handlers/StapleHandlers/StapleSummaryHandler"
import aHandler from "models/handlers/DbHandlers/AgregatesDbHandler"
import { Loading } from "components/extra/Loading"


type State = {
  heat?: CCMInstantHeatInfo
  cryst?: CCMInstantCrystInfo
  phys?: CCMInstantPhysInfo
  samples?: string[]
  mysql?: AgregateInfo
  events?: string[]
}



export const CCMDetails: React.FC = () => {

  const [state, setState] = useState<State>({})

  const update = () => {
    aHandler.ReadCCM2InstantAsync()
      .then(data => {
        setState({
          ...state,
          heat: data.heat,
          cryst: data.cryst,
          phys: data.phys,
          samples: data.samples,
          mysql: new StapleSummaryHandler(data.mysql).GetMNLZ2Info(),
          events: data.events,
        })
      })
      .catch(error => {
        console.log(error)
        blinkAlert("Обновление не удалось", false)
      })
  }

  useEffect(() => {
    update()
    const interval = setInterval(update, 15000)
    return () => clearInterval(interval)
    //eslint-disable-next-line
  }, [])

  const ccmState = () => {
    if (state.cryst?.Lvl === "0") return "state-idle"
    if (state.phys?.CastingSpeed && state.phys.CastingSpeed !== "0") return "state-process"
    return ""
  }




  return <div className="ccm-details-wrapper">
    <Alert id="alert">Hello</Alert>
    <div className={`title display-5 ${ccmState()}`} style={{ gridArea: "title" }}>МНЛЗ-2</div>
    <span className="a-like" style={{ gridArea: "title" }} onClick={() => window.history.back()}>Назад</span>

    <ListGroup className={`heat ${ccmState()}`} style={{ gridArea: "heat" }}>
      {state.heat && Object.keys(state.heat).map(key =>
        <ListGroupItem key={key}>
          <div>{(CCMInstantHeatDecoder as any)[key]}</div>
          <div>{(state.heat as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.heat && <Loading />}
    </ListGroup>

    <ListGroup className={`cryst ${ccmState()}`} style={{ gridArea: "cryst" }}>
      {state.cryst && Object.keys(state.cryst).map(key =>
        <ListGroupItem key={key}>
          <div>{(CCMInstantCrystDecoder as any)[key]}</div>
          <div>{(state.cryst as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.cryst && <Loading />}
    </ListGroup>

    <ListGroup className={`phys ${ccmState()}`} style={{ gridArea: "phys" }}>
      {state.phys && Object.keys(state.phys).map(key =>
        <ListGroupItem key={key}>
          <div>{(CCMInstantPhysDecoder as any)[key]}</div>
          <div>{(state.phys as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.phys && <Loading />}
    </ListGroup>

    <div className={`samples ${ccmState()}`} style={{ gridArea: "samples" }}>
      {state?.samples && state.samples.map((key, id) => <div key={id}>{key}</div>)}
      {!state.samples && <Loading />}
    </div>

    <ListGroup className={`events ${ccmState()}`} style={{ gridArea: "events" }}>
      {state.events?.map(key => <ListGroupItem key={key}>{key}</ListGroupItem>)}
      {!state.events && <Loading />}
    </ListGroup>

    {state.mysql && <CCMView cast={state.mysql?.streamCast!} head={state.mysql?.tsg!} />}
  </div>
}