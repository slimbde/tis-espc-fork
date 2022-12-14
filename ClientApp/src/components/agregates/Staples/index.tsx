import "./staples.scss"
import moment from "moment";
import { Alert, blinkAlert } from "components/extra/Alert";
import { Loading } from "components/extra/Loading";
import { setFluid } from "components/extra/SetFluid";
import { StapleSummaryHandler } from "models/handlers/StapleHandlers/StapleSummaryHandler";
import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo";
import { useEffect, useState } from "react";
import { Agregate } from "./Agregate";
import aHandler from "models/handlers/DbHandlers/AgregatesDbHandler";


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
  vd2: AgregateInfo,
}




export const Staples: React.FC = () => {

  const [state, setState] = useState<State>({
    loading: true,
    loadError: false,
    title: "Основные агрегаты ЭСПЦ-6",
    dsp: {},
    akos: {},
    akp1: {},
    akp2: {},
    mnlz1: {},
    mnlz2: {},
    vd1: {},
    vd2: {},
  })


  useEffect(() => {
    document.title = "Агрегаты"
    setFluid(true)

    const update = () => aHandler.ReadStapleSummaryAsync()
      .then(summary => {
        const sHandler = new StapleSummaryHandler(summary)

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

        const time = document.querySelector(".title small")
        time && (time.textContent = `${moment().format("HH:mm:ss")}`)
      })
      .catch(error => {
        blinkAlert(error, false)
        console.log(error)
        setState(state => ({ ...state, loading: false, loadError: true }))
      })

    update()
      .then(() => setState(state => ({ ...state, loading: false })))

    const interval = setInterval(() => update(), (window as any).config.agregatesUpdateInterval)

    return () => {
      setFluid()
      clearInterval(interval)
    }
  }, [])



  return <div className="staples-wrapper">
    <Alert>Hello</Alert>
    <div className="title display-5" style={{ gridArea: "title" }}>{state.title}<small></small></div>

    {state.loading && <Loading />}
    {!state.loading && !state.loadError && <>
      <Agregate {...state.dsp}></Agregate>
      <Agregate {...state.akos}></Agregate>
      <Agregate {...state.mnlz1}></Agregate>
      <Agregate {...state.mnlz2}></Agregate>
      <Agregate {...state.akp1}></Agregate>
      <Agregate {...state.akp2}></Agregate>
      <Agregate {...state.vd1}></Agregate>
      <Agregate {...state.vd2}></Agregate>
    </>}
  </div >
}