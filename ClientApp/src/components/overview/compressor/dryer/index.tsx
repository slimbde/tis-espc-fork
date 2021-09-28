import "./dryer.scss"
import { useEffect } from "react"
import cHandler from "models/handlers/DbHandlers/CompressorDbHandler"
import { blinkAlert } from "components/extra/Alert"
import { dryHandler } from "models/handlers/ISensorHandler"
import { Link } from "react-router-dom"
import { Dispatch, SetStateAction } from "react"


type Props = {
  setTitle: Dispatch<SetStateAction<string>>
}


export const Dryer: React.FC<Props> = ({ setTitle }) => {

  useEffect(() => {
    setTitle("Компрессорная. Осушитель")
    dispatch()
    //  const interval = setInterval(() => dispatch(), 5000)
    //  return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [setTitle])


  const dispatch = () => {
    cHandler.ReadCompressorAsync()
      .then(sensors => dryHandler.Handle(sensors))
      .catch(error => {
        blinkAlert(error.message, false)
        console.log(error)
      })
  }



  return <div className="dryer-wrapper">
    <Link to="/overview/compressor/main" className="btn btn-outline-dark">Назад</Link>

    <div id="CMP_WS_Des_Pres_col_" style={{ left: 200, top: 63 }}>##.###</div>
    <div id="CMP_WS_Des_Pres_col_A" style={{ left: 115, top: 115 }}>##.###</div>
    <div id="CMP_WS_Des_Pres_col_B" style={{ left: 520, top: 113 }}>##.###</div>
    <div id="CMP_WS_Des_Temp_UP_col_A" style={{ left: 115, top: 140 }}>##.###</div>
    <div id="CMP_WS_Des_Temp_UP_col_B" style={{ left: 520, top: 138 }}>##.###</div>
    <div id="CMP_WS_Des_Temp_OUT_air" style={{ left: 345, top: 600 }}>##.###</div>
    <div id="CMP_WS_Des_Pres_OUT_air" style={{ left: 540, top: 598 }}>##.###</div>

    <div id="CMP_WS_Des_Time_work" style={{ left: 880, top: 72 }}>##.###</div>
    <div id="CMP_WS_Des_Time_work_REG" style={{ left: 880, top: 97 }}>##.###</div>
    <div id="CMP_WS_Des_Time_program" style={{ left: 880, top: 121 }}>##.###</div>
    <div id="CMP_WS_Des_Program_time" style={{ left: 880, top: 147 }}>##.###</div>
    <div id="CMP_WS_Des_Halftime_work" style={{ left: 880, top: 172 }}>##.###</div>
    <div id="CMP_WS_Des_Halftime_work_Prog" style={{ left: 880, top: 197 }}>##.###</div>
    <div id="CMP_WS_Des_Regen_cycle_A" style={{ left: 880, top: 222 }}>##.###</div>
    <div id="CMP_WS_Des_Regen_cycle_B" style={{ left: 880, top: 247 }}>##.###</div>
    <div id="CMP_WS_Des_Status_compr_coded" style={{ left: 880, top: 272 }}>##.###</div>

    <div id="CMP_BS_Des_LOW_IN_pressure" className="fault" style={{ left: 100, top: 391, width: "40px", height: "17px" }}>PSL</div>
    <div id="CMP_BS_Des_Warning_compress_OUT" className="warning status" style={{ left: 16, top: 455 }}>Warning</div>
    <div id="CMP_BS_Des_Failure_compress_OUT" className="fault status" style={{ left: 16, top: 455 }}>Error</div>
    <div id="CMP_BS_Des_Compressor_STOP" className="stop status" style={{ left: 16, top: 580 }}>Стоп</div>
    <div id="CMP_BS_Des_EMG_STOP" className="fault status" style={{ left: 16, top: 556 }}>Авар.стоп</div>
    <div id="CMP_BS_Des_Compressor_MANUAL" className="manual status" style={{ left: 16, top: 531 }}>Руч.реж.</div>
    <div id="CMP_BS_Des_Compressor_AUTO" className="auto status" style={{ left: 16, top: 531 }}>Автореж</div>
    <div id="CMP_BS_Des_Compressor_LOCAL" className="local status" style={{ left: 16, top: 506 }}>Лок.реж.</div>
    <div id="CMP_BS_Des_Compressor_REMOTE" className="remote status" style={{ left: 16, top: 506 }}>Дист.реж.</div>
    <div id="CMP_BS_Des_Compressor_UNLOAD" className="unload status" style={{ left: 16, top: 480 }}>Хол.ход</div>
    <div id="CMP_BS_Des_Compressor_LOAD" className="load status" style={{ left: 16, top: 480 }}>Нагрузка</div>

    <div id="CMP_BS_Des_Reg_valv_A_OPN" className="v-valve" style={{ left: 224, top: 468 }}></div>
    <div id="CMP_BS_Des_Reg_valv_B_OPN" className="v-valve" style={{ left: 472, top: 468 }}></div>
    <div id="CMP_BS_Des_In_valv_B_OPN" className="g-valve" style={{ left: 396, top: 422 }}></div>
    <div id="CMP_BS_Des_In_valv_A_OPN" className="g-valve" style={{ left: 269, top: 422 }}></div>

    <div id="CMP_BS_Des_Remote_STR_STP" style={{ left: 917, top: 328 }}></div>
    <div id="CMP_BS_Des_OverHeat_A" style={{ left: 917, top: 354 }}></div>
    <div id="CMP_BS_Des_OverHeat_B" style={{ left: 917, top: 380 }}></div>
    <div id="CMP_BS_Des_Fuse_heater" style={{ left: 917, top: 406 }}></div>
    <div id="CMP_BS_Des_Fuse_Motor" style={{ left: 917, top: 432 }}></div>
    <div id="CMP_BS_Des_FAULT_blowoff_A" style={{ left: 917, top: 458 }}></div>
    <div id="CMP_BS_Des_FAULT_blowoff_B" style={{ left: 917, top: 484 }}></div>
    <div id="CMP_BS_Des_FAULT_pressurize" style={{ left: 917, top: 511 }}></div>
  </div>
}


