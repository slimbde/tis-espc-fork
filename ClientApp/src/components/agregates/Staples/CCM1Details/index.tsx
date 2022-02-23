import "./ccm1Details.scss"
import { blinkAlert } from "components/extra/Alert"
import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo"
import { CCMInstantCrystDecoder, CCMInstantCrystInfo, CCMInstantHeatDecoder, CCMInstantHeatInfo, CCMInstantPhysDecoder, CCMInstantPhysInfo } from "models/types/Agregates/Staples/CCMInstantInfo"
import { useEffect, useState } from "react"
import { Alert, ListGroup, ListGroupItem } from "reactstrap"
import { CCMView } from "../views/ccm12"
import { StapleSummaryHandler } from "models/handlers/StapleHandlers/StapleSummaryHandler"
import aHandler from "models/handlers/DbHandlers/AgregatesDbHandler"
import { Loading } from "components/extra/Loading"
import { AgregateState } from "models/types/Agregates/Staples/AgregateState"


type State = {
  heat?: CCMInstantHeatInfo
  cryst?: CCMInstantCrystInfo
  phys?: CCMInstantPhysInfo
  samples?: string[]
  mysql?: AgregateInfo
  lastUpdate?: string
  agregateState?: AgregateState
}



export const CCM1Details: React.FC = () => {

  const [state, setState] = useState<State>({})

  const update = () => {
    aHandler.ReadStapleSummaryAsync()
      .then(data => {
        const mysql = new StapleSummaryHandler(data).GetMNLZ1Info()

        const heat: CCMInstantHeatInfo = {
          HeatId: `${mysql.heatId!} (${mysql.series})`,
          SteelGradeId: mysql.steelGrade,
          ShiftResponsible: mysql.shiftResponsible,
          ShiftCode: mysql.shiftCode,
          TeamId: mysql.teamId,
          CrystShos: mysql.crystShos,
          TundishShos: mysql.tundishShos,
          LadleId: mysql.ladleId,
          LadleShib: mysql.ladleShib,
          TundishCar: mysql.tundishCar,
          TundishId: mysql.tundishId,
          CutId: mysql.cutId,
        }

        const cryst: CCMInstantCrystInfo = {
          SlabWidth: mysql.slabWidth,
          SlabThickness: mysql.slabThickness,
          CrystStoik: mysql.crystStoik,
          CrystFreq: mysql.crystFreq,
          CrystPullEffort: mysql.crystPullEffort,
          CrystTshears: mysql.crystTshears,
          CrystFlow: mysql.crystFlow,
          CrystFLeft: mysql.crystFLeft,
          CrystFRight: mysql.crystFRight,
          CrystTdelta: mysql.crystTdelta,
          CrystTbefore: mysql.crystTbefore,
        }

        const phys: CCMInstantPhysInfo = {
          CastedMeters: mysql.castedMeters,
          CastingSpeed: mysql.castingSpeed,
          OptimalSpeed: mysql.optimalSpeed,
          FlowSpeed: Math.round((+mysql.flowSpeed! * 1000 / 60) * 100) / 100 + "",
          HeatWeight: mysql.heatWeight,
        }

        setState({
          ...state,
          heat,
          cryst,
          phys,
          samples: mysql.samples?.split(";"),
          mysql,
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




  return <div className="ccm1-details-wrapper">
    <Alert id="alert">Hello</Alert>
    <div className={`title display-5 ${state.agregateState}`} style={{ gridArea: "title" }}>
      МНЛЗ-1
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

    {state.cryst && <ListGroup className={`cryst ${state.agregateState}`} style={{ gridArea: "cryst" }}>
      {state.cryst && Object.keys(state.cryst).map(key =>
        <ListGroupItem key={key}>
          <div>{(CCMInstantCrystDecoder as any)[key]}</div>
          <div>{(state.cryst as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.cryst && <Loading />}
    </ListGroup>}

    {state.phys && <ListGroup className={`phys ${state.agregateState}`} style={{ gridArea: "phys" }}>
      {state.phys && Object.keys(state.phys).map(key =>
        <ListGroupItem key={key}>
          <div>{(CCMInstantPhysDecoder as any)[key]}</div>
          <div>{(state.phys as any)[key]}</div>
        </ListGroupItem>
      )}
      {!state.phys && <Loading />}
    </ListGroup>}

    {state.samples && <div className={`samples ${state.agregateState}`} style={{ gridArea: "samples" }}>
      {state?.samples && state.samples.map((key, id) => <div key={id}>{key}</div>)}
      {!state.samples && <Loading />}
    </div>}

    {state.mysql && <CCMView cast={state.mysql?.streamCast!} head={state.mysql?.tgs!} />}
  </div>
}