import { blinkAlert } from "components/extra/Alert";
import { Loading } from "components/extra/Loading";
import aHandler from "models/handlers/DbHandlers/AgregatesDbHandler";
import { StapleAgregateHandler } from "models/handlers/StapleHandlers/StapleAgregateHandler";
import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo";
import { useEffect, useState } from "react";
import { Alert } from "reactstrap"
import { Agregate } from "./Agregate";
import "./staples.scss"


type State = {
  loading: boolean
  loadError: boolean
  title: string
  dsp: AgregateInfo
  akos: AgregateInfo
  akp1: AgregateInfo
  akp2: AgregateInfo
  mnlz1: AgregateInfo
  mnlz2: AgregateInfo
  vd1: AgregateInfo
  vd2: AgregateInfo
}


const sHandler = new StapleAgregateHandler()




export const Staples: React.FC = () => {

  const [state, setState] = useState<State>({
    loading: true,
    loadError: false,
    title: "Основные агрегаты ЭСПЦ-6",
    dsp: { name: "ДСП", className: "dsp" },
    akos: { name: "АКОС", className: "akos" },
    akp1: { name: "АКП-1", className: "akp1" },
    akp2: { name: "АКП-2", className: "akp2" },
    mnlz1: { name: "МНЛЗ-1", className: "mnlz1" },
    mnlz2: { name: "МНЛЗ-2", className: "mnlz2" },
    vd1: { name: "ВД-1", className: "vd1" },
    vd2: { name: "ВД-2", className: "vd2" },
  })


  useEffect(() => {
    const update = () => aHandler.ReadStapleSummaryAsync()
      .then(summary => {
        sHandler.SetAgregateSummary(summary)

        setState(state => ({
          ...state,
          loadError: false,
          dsp: sHandler.GetDSPInfo(),
          akos: sHandler.GetAKOSInfo(),
          akp1: sHandler.GetAKPInfo(1),
          akp2: sHandler.GetAKPInfo(2),
          mnlz1: sHandler.GetMNLZ1Info(),
          mnlz2: sHandler.GetMNLZ2Info(),
          vd1: sHandler.GetVDInfo(1),
          vd2: sHandler.GetVDInfo(2),
        }))
      })
      .catch(error => {
        blinkAlert(error, false)
        console.log(error)
        setState(state => ({ ...state, loading: false, loadError: true }))
      })

    update()
      .then(() => setState(state => ({ ...state, loading: false })))

    const interval = setInterval(() => update(), 10000)
    return () => clearInterval(interval)
  }, [])



  return <div className="staples-wrapper jumbotron">
    <Alert id="alert">Hello</Alert>
    <div className="title display-5" style={{ gridArea: "title" }} >{state.title}</div>

    {state.loading && <Loading />}
    {!state.loading && !state.loadError && <>
      <Agregate {...state.dsp}></Agregate>
      <Agregate {...state.akos}></Agregate>
      <Agregate {...state.akp1}></Agregate>
      <Agregate {...state.akp2}></Agregate>
      <Agregate {...state.mnlz1}></Agregate>
      <Agregate {...state.mnlz2}></Agregate>
      <Agregate {...state.vd1}></Agregate>
      <Agregate {...state.vd2}></Agregate>
    </>}

  </div >
}