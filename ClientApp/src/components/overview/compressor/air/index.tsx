import "./air.scss"
import { useEffect } from "react"
import cHandler from "models/handlers/DbHandlers/CompressorDbHandler"
import { blinkAlert } from "components/extra/Alert"
import { aHandler } from "models/handlers/ISensorHandler"
import { Link } from "react-router-dom"
import { Dispatch, SetStateAction } from "react"


type Props = {
  setTitle: Dispatch<SetStateAction<string>>
}


export const Air: React.FC<Props> = ({ setTitle }) => {

  useEffect(() => {
    setTitle("Компрессорная. Сжатый воздух")
    dispatch()
    const interval = setInterval(() => dispatch(), 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])


  const dispatch = () => {
    cHandler.ReadCompressorAsync()
      .then(sensors => aHandler.Handle(sensors))
      .catch(error => {
        blinkAlert(error.message, false)
        console.log(error)
      })
  }



  return <div className="air-wrapper">
    <Link to="/overview/compressor/main" className="btn btn-outline-dark">Назад</Link>

    <div id="CMP_WS_T_osush_vozd_22a" style={{ left: 10, top: 183 }}>##.###</div>
    <div id="CMP_WS_P_osush_vozd_25a" style={{ left: 10, top: 262 }}>##.###</div>
    <div id="CMP_WS_Q_osush_vozd_27a" style={{ left: 10, top: 342 }}>##.###</div>
    <div id="CMP_WS_T_neosush_vozd_23a" style={{ left: 132, top: 184 }}>##.###</div>
    <div id="CMP_WS_P_neosush_vozd_26a" style={{ left: 132, top: 263 }}>##.###</div>
    <div id="CMP_WS_Q_neosush_vozd_28a" style={{ left: 132, top: 341 }}>##.###</div>
  </div>
}