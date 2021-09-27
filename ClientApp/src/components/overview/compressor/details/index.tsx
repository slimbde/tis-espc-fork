import "./details.scss"
import { useEffect } from "react"
import cHandler from "models/handlers/DbHandlers/CompressorDbHandler"
import { blinkAlert } from "components/extra/Alert"
import { dHandler } from "models/handlers/ISensorHandler"
import { Link, useRouteMatch } from "react-router-dom"
import { Dispatch, SetStateAction } from "react"


type Props = {
  setTitle: Dispatch<SetStateAction<string>>
}


export const Details: React.FC<Props> = ({ setTitle }) => {
  const match = useRouteMatch<{ ID: string }>()
  const cNumber = match.params.ID

  useEffect(() => {
    setTitle(`Компрессорная. Компрессор ${cNumber}`)
    dispatch()
    const interval = setInterval(() => dispatch(), 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [setTitle])


  const dispatch = () => {
    cHandler.ReadCompressorAsync()
      .then(sensors => {
        dHandler.Initialize(cNumber)
        dHandler.Handle(sensors)
      })
      .catch(error => {
        blinkAlert(error.message, false)
        console.log(error)
      })
  }



  return <div className="details-wrapper">
    <Link to="/overview/compressor/main" className="btn btn-outline-dark">Назад</Link>

    <div id={`CMP_WS_C${cNumber}_Act_pressure`} style={{ left: 200, top: 82 }}></div>
    <div id={`CMP_WS_C${cNumber}_Temp_of_air`} style={{ left: 200, top: 116 }}></div>

    <div id={`CMP_WS_C${cNumber}_Time_work`} style={{ left: 310, top: 407 }}></div>
    <div id={`CMP_WS_C${cNumber}_Time_work_LOAD`} style={{ left: 310, top: 444 }}></div>
    <div id={`CMP_WS_C${cNumber}_Num_motor_start`} style={{ left: 310, top: 476 }}></div>
    <div id={`CMP_WS_C${cNumber}_Time_work_REG`} style={{ left: 310, top: 510 }}></div>
    <div id={`CMP_WS_C${cNumber}_Relay_load`} style={{ left: 310, top: 545 }}></div>
    <div id={`CMP_WS_C${cNumber}_Status_compr_coded`} style={{ left: 310, top: 580 }}></div>

    <div id={`CMP_WS_C${cNumber}_dP_oil_separator1`} style={{ left: 850, top: 55 }}></div>
    <div id={`CMP_WS_C${cNumber}_dP_oil_separator2`} style={{ left: 850, top: 90 }}></div>
    <div id={`CMP_WS_C${cNumber}_dP_air_filter`} style={{ left: 850, top: 122 }}></div>
    <div id={`CMP_WS_C${cNumber}_Temp_of_ambient1`} style={{ left: 850, top: 153 }}></div>
    <div id={`CMP_WS_C${cNumber}_Temp_of_ambient2`} style={{ left: 850, top: 185 }}></div>
    <div id={`CMP_WS_C${cNumber}_Temp_separator1`} style={{ left: 850, top: 218 }}></div>
    <div id={`CMP_WS_C${cNumber}_Temp_separator2`} style={{ left: 850, top: 252 }}></div>
    <div id={`CMP_WS_C${cNumber}_P_oil_Step1`} style={{ left: 850, top: 284 }}></div>
    <div id={`CMP_WS_C${cNumber}_P_oil_Step2`} style={{ left: 850, top: 316 }}></div>
    <div id={`CMP_WS_C${cNumber}_dP_oil_injection`} style={{ left: 850, top: 347 }}></div>

    <div id={`CMP_BS_C${cNumber}_Compressor_STOP`} className="stop" style={{ left: 93, top: 326 }}>СТОП</div>
    <div id={`CMP_BS_C${cNumber}_EMG_STOP`} className="fault1" style={{ left: 93, top: 295 }}>Авар.стоп</div>
    <div id={`CMP_BS_C${cNumber}_Compressor_MANUAL`} className="manual" style={{ left: 226, top: 295 }}>Руч.реж.</div>
    <div id={`CMP_BS_C${cNumber}_Compressor_AUTO`} className="auto" style={{ left: 226, top: 295 }}>Авторежим</div>
    <div id={`CMP_BS_C${cNumber}_Compressor_LOCAL`} className="local" style={{ left: 226, top: 263 }}>Лок.реж.</div>
    <div id={`CMP_BS_C${cNumber}_Compressor_REMOTE`} className="remote" style={{ left: 226, top: 263 }}>Дист.реж.</div>
    <div id={`CMP_BS_C${cNumber}_Compressor_UNLOAD`} className="unload" style={{ left: 226, top: 231 }}>Хол.ход.</div>
    <div id={`CMP_BS_C${cNumber}_Compressor_LOAD`} className="load" style={{ left: 226, top: 231 }}>Нагрузка</div>
    <div id={`CMP_BS_C${cNumber}_Failure_compress_OUT`} className="fault" style={{ left: 226, top: 200 }}>Error</div>
    <div id={`CMP_BS_C${cNumber}_Warning_compress_OUT`} className="warning" style={{ left: 226, top: 200 }}>Warning</div>

    <div id={`CMP_BS_C${cNumber}_Remote_STR_STP`} style={{ left: 740, top: 402 }}>ДА</div>
    <div id={`CMP_BS_C${cNumber}_Remote_Load_Unload`} style={{ left: 740, top: 434 }}>ДА</div>
    <div id={`CMP_BS_C${cNumber}_Remote_change_pres`} style={{ left: 740, top: 466 }}>ДА</div>
    <div id={`CMP_BS_C${cNumber}_Overload_motor`} className="ovl" style={{ left: 740, top: 498 }}>ДА</div>
    <div id={`CMP_BS_C${cNumber}_KM_ON`} style={{ left: 740, top: 530 }}>ДА</div>
    <div id={`CMP_BS_C${cNumber}_DD1_DD2`} style={{ left: 740, top: 562 }}>ДА</div>
  </div>
}