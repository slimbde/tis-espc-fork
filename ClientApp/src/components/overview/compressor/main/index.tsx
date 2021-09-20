import "./main.scss"
import { Dispatch, SetStateAction, useEffect } from "react"
import cHandler from "models/handlers/DbHandlers/CompressorDbHandler"
import { blinkAlert } from "components/extra/Alert"
import { mHandler } from "models/handlers/ISensorHandler"
import { Link } from "react-router-dom"


type Props = {
  setTitle: Dispatch<SetStateAction<string>>
}



export const Main: React.FC<Props> = ({ setTitle }) => {

  useEffect(() => {
    setTitle("Компрессорная обзор")
    dispatch()
    const interval = setInterval(() => dispatch(), 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])


  const dispatch = () => {
    cHandler.ReadCompressorAsync()
      .then(sensors => mHandler.Handle(sensors))
      .catch(error => {
        blinkAlert(error.message, false)
        console.log(error)
      })
  }



  return <div className="main-wrapper">
    <Link to="/overview/compressor/kipelectro" className="btn btn-outline-dark">Датчики КИП и электрика</Link>
    <Link to="/overview/compressor/air" className="link-to-air btn btn-outline-dark">Сжатый воздух</Link>
    <Link to="/overview/compressor/dryer" className="link-to-dryer btn btn-outline-dark">Осушитель</Link>
    <Link to="/overview/compressor/details/1" className="link-to-details1 btn btn-outline-dark">Компрессор 1</Link>
    <Link to="/overview/compressor/details/2" className="link-to-details2 btn btn-outline-dark">Компрессор 2</Link>
    <Link to="/overview/compressor/details/3" className="link-to-details3 btn btn-outline-dark">Компрессор 3</Link>

    <div id="CMP_WS_T_neosush_vozd_3a" style={{ left: 5, top: 120 }}>23.46</div>
    <div id="CMP_WS_P_neosush_vozd_8a" style={{ left: 5, top: 188 }}>0.07</div>
    <div id="CMP_WS_Q_neosush_vozd_13a" style={{ left: 5, top: 255 }}>-7.95</div>

    <div id="CMP_WS_T_osush_vozd_4a" style={{ left: 125, top: 155 }}>24.16</div>
    <div id="CMP_WS_P_osush_vozd_9a" style={{ left: 125, top: 222 }}>0.06</div>
    <div id="CMP_WS_Q_osush_vozd_14a" style={{ left: 125, top: 290 }}>-1.62</div>

    <div id="CMP_WS_ACT_PRES_AVG" style={{ left: 405, top: 15 }}>0.00</div>

    <div id="CMP_WS_C3_Act_pressure" style={{ left: 480, top: 65 }}>0.00</div>
    <div id="CMP_WS_C3_Temp_of_air" style={{ left: 480, top: 89 }}>24.2</div>
    <div id="CMP_WS_C3_Time_work" style={{ left: 492, top: 333 }}>40122</div>
    <div id="CMP_WS_C3_Time_work_LOAD" style={{ left: 492, top: 357 }}>23446</div>
    <div id="CMP_WS_C3_Temp_water" style={{ left: 610, top: 504 }}>38.8</div>

    <div id="CMP_WS_C2_Act_pressure" style={{ left: 705, top: 65 }}>0.00</div>
    <div id="CMP_WS_C2_Temp_of_air" style={{ left: 705, top: 89 }}>24.2</div>
    <div id="CMP_WS_C2_Time_work" style={{ left: 707, top: 333 }}></div>
    <div id="CMP_WS_C2_Time_work_LOAD" style={{ left: 707, top: 357 }}></div>
    <div id="CMP_WS_C2_Temp_water" style={{ left: 823, top: 503 }}>28.0</div>

    <div id="CMP_WS_C1_Act_pressure" style={{ left: 917, top: 65 }}>6.7</div>
    <div id="CMP_WS_C1_Temp_of_air" style={{ left: 917, top: 89 }}>43.9</div>
    <div id="CMP_WS_C1_Time_work" style={{ left: 921, top: 333 }}>47175</div>
    <div id="CMP_WS_C1_Time_work_LOAD" style={{ left: 921, top: 358 }}>28922</div>
    <div id="CMP_WS_C1_Temp_water" style={{ left: 913, top: 504 }}>28.0</div>

    <div id="CMP_WS_Des_Pres_col_A" style={{ left: 297, top: 333 }}>0.00</div>
    <div id="CMP_WS_Des_Pres_col_B" style={{ left: 297, top: 356 }}>0.00</div>

    <div id="CMP_WS_T_obr_voda_6a" style={{ left: 155, top: 496 }}>26.66</div>
    <div id="CMP_WS_P_obr_voda_11a" style={{ left: 235, top: 496 }}>1.63</div>

    <div id="CMP_WS_T_pram_voda_5a" style={{ left: 165, top: 599 }}>26.97</div>
    <div id="CMP_WS_P_pram_voda_10a" style={{ left: 245, top: 599 }}>3.11</div>
    <div id="CMP_WS_Q_pram_voda_12a" style={{ left: 310, top: 599 }}>56.35</div>

    <div id="CMP_BS_Des_LOW_IN_pressure" className="fault" style={{ left: 364, top: 74, width: "40px", height: "17px" }}>PSL</div>
    <div id="CMP_BS_Des_FAULT_pressurize" className="fault" style={{ left: 217, top: 248, width: "80px", height: "17px" }}>FAULT</div>
    <div id="CMP_BS_Des_Compressor_STOP" className="stop" style={{ left: 307, top: 249, width: "80px", height: "17px" }}>Стоп</div>
    <div id="CMP_BS_Des_EMG_STOP" className="fault" style={{ left: 307, top: 226, width: "79px", height: "17px" }}>Авар.стоп</div>
    <div id="CMP_BS_Des_Compressor_MANUAL" className="manual" style={{ left: 307, top: 203, width: "79px", height: "17px" }}>Руч.реж.</div>
    <div id="CMP_BS_Des_Compressor_AUTO" className="auto" style={{ left: 307, top: 203, width: "79px", height: "17px" }}>Авто.реж.</div>
    <div id="CMP_BS_Des_Compressor_LOCAL" className="local" style={{ left: 307, top: 181, width: "79px", height: "17px" }}>Лок.реж.</div>
    <div id="CMP_BS_Des_Compressor_REMOTE" className="remote" style={{ left: 307, top: 181, width: "79px", height: "17px" }}>Дист.реж.</div>
    <div id="CMP_BS_Des_Compressor_UNLOAD" className="unload" style={{ left: 307, top: 159, width: "79px", height: "17px" }}>Хол.ход.</div>
    <div id="CMP_BS_Des_Compressor_LOAD" className="load" style={{ left: 307, top: 159, width: "79px", height: "17px" }}>Нагрузка</div>
    <div id="CMP_BS_Des_Failure_compress_OUT" className="warning" style={{ left: 307, top: 137, width: "79px", height: "17px" }}>Warning</div>
    <div id="CMP_BS_Des_Warning_compress_OUT" className="fault" style={{ left: 307, top: 137, width: "79px", height: "17px" }}>Error</div>

    <div id="CMP_BS_Potok_kompr_1" className="fault" style={{ left: 956, top: 478, width: "40px", height: "17px" }}>FSL</div>
    <div id="CMP_BS_Potok_kompr_2" className="fault" style={{ left: 742, top: 478, width: "40px", height: "17px" }}>FSL</div>
    <div id="CMP_BS_Potok_kompr_3" className="fault" style={{ left: 528, top: 478, width: "40px", height: "17px" }}>FSL</div>

    <div id="CMP_BS_Pritoch_sistema_1_emg" className="fault" style={{ left: 811, top: 566, width: "64px", height: "17px" }}>FAULT</div>
    <div id="CMP_BS_Pritoch_sistema_2_emg" className="fault" style={{ left: 811, top: 591, width: "64px", height: "17px" }}>FAULT</div>

    <div id="CMP_BS_C3_Compressor_STOP" className="stop" style={{ left: 431, top: 239, width: "80px", height: "17px" }}>Стоп</div>
    <div id="CMP_BS_C3_EMG_STOP" className="fault" style={{ left: 431, top: 217, width: "79px", height: "17px" }}>Авар.стоп</div>
    <div id="CMP_BS_C3_Compressor_MANUAL" className="manual" style={{ left: 521, top: 216, width: "79px", height: "17px" }}>Руч.реж.</div>
    <div id="CMP_BS_C3_Compressor_AUTO" className="auto" style={{ left: 521, top: 216, width: "79px", height: "17px" }}>Авто.реж.</div>
    <div id="CMP_BS_C3_Compressor_LOCAL" className="local" style={{ left: 521, top: 194, width: "79px", height: "17px" }}>Лок.реж.</div>
    <div id="CMP_BS_C3_Compressor_REMOTE" className="remote" style={{ left: 521, top: 194, width: "79px", height: "17px" }}>Дист.реж.</div>
    <div id="CMP_BS_C3_Compressor_UNLOAD" className="unload" style={{ left: 521, top: 171, width: "79px", height: "17px" }}>Хол.ход.</div>
    <div id="CMP_BS_C3_Compressor_LOAD" className="load" style={{ left: 521, top: 171, width: "79px", height: "17px" }}>Нагрузка</div>
    <div id="CMP_BS_C3_Failure_compress_OUT" className="warning" style={{ left: 521, top: 149, width: "79px", height: "17px" }}>Warning</div>
    <div id="CMP_BS_C3_Warning_compress_OUT" className="fault" style={{ left: 521, top: 149, width: "79px", height: "17px" }}>Error</div>

    <div id="CMP_BS_C2_Compressor_STOP" className="stop" style={{ left: 644, top: 239, width: "80px", height: "17px" }}>Стоп</div>
    <div id="CMP_BS_C2_EMG_STOP" className="fault" style={{ left: 644, top: 217, width: "79px", height: "17px" }}>Авар.стоп</div>
    <div id="CMP_BS_C2_Compressor_MANUAL" className="manual" style={{ left: 735, top: 216, width: "78px", height: "17px" }}>Руч.реж.</div>
    <div id="CMP_BS_C2_Compressor_AUTO" className="auto" style={{ left: 735, top: 216, width: "78px", height: "17px" }}>Авто.реж.</div>
    <div id="CMP_BS_C2_Compressor_LOCAL" className="local" style={{ left: 735, top: 194, width: "78px", height: "17px" }}>Лок.реж.</div>
    <div id="CMP_BS_C2_Compressor_REMOTE" className="remote" style={{ left: 735, top: 194, width: "78px", height: "17px" }}>Дист.реж.</div>
    <div id="CMP_BS_C2_Compressor_UNLOAD" className="unload" style={{ left: 735, top: 171, width: "78px", height: "17px" }}>Хол.ход.</div>
    <div id="CMP_BS_C2_Compressor_LOAD" className="load" style={{ left: 735, top: 171, width: "78px", height: "17px" }}>Нагрузка</div>
    <div id="CMP_BS_C2_Failure_compress_OUT" className="warning" style={{ left: 735, top: 149, width: "78px", height: "17px" }}>Warning</div>
    <div id="CMP_BS_C2_Warning_compress_OUT" className="fault" style={{ left: 735, top: 149, width: "78px", height: "17px" }}>Error</div>

    <div id="CMP_BS_C1_Compressor_STOP" className="stop" style={{ left: 858, top: 239, width: "80px", height: "17px" }}>Стоп</div>
    <div id="CMP_BS_C1_EMG_STOP" className="fault" style={{ left: 858, top: 217, width: "79px", height: "17px" }}>Авар.стоп</div>
    <div id="CMP_BS_C1_Compressor_MANUAL" className="manual" style={{ left: 949, top: 216, width: "78px", height: "17px" }}>Руч.реж.</div>
    <div id="CMP_BS_C1_Compressor_AUTO" className="auto" style={{ left: 949, top: 216, width: "78px", height: "17px" }}>Авто.реж.</div>
    <div id="CMP_BS_C1_Compressor_LOCAL" className="local" style={{ left: 949, top: 194, width: "78px", height: "17px" }}>Лок.реж.</div>
    <div id="CMP_BS_C1_Compressor_REMOTE" className="remote" style={{ left: 949, top: 194, width: "78px", height: "17px" }}>Дист.реж.</div>
    <div id="CMP_BS_C1_Compressor_UNLOAD" className="unload" style={{ left: 949, top: 171, width: "78px", height: "17px" }}>Хол.ход.</div>
    <div id="CMP_BS_C1_Compressor_LOAD" className="load" style={{ left: 949, top: 171, width: "78px", height: "17px" }}>Нагрузка</div>
    <div id="CMP_BS_C1_Failure_compress_OUT" className="fault" style={{ left: 949, top: 149, width: "78px", height: "17px" }}>Error</div>
    <div id="CMP_BS_C1_Warning_compress_OUT" className="warning" style={{ left: 949, top: 149, width: "78px", height: "17px" }}>Warning</div>

    <div id="CMP_BS_Vityajka_1" className="load" style={{ left: 907, top: 585, width: "20px", height: "17px" }}>1</div>
    <div id="CMP_BS_Vityajka_2" className="load" style={{ left: 932, top: 585, width: "20px", height: "17px" }}>2</div>
    <div id="CMP_BS_Vityajka_3" className="load" style={{ left: 956, top: 585, width: "20px", height: "17px" }}>3</div>
    <div id="CMP_BS_Vityajka_4" className="load" style={{ left: 981, top: 585, width: "20px", height: "17px" }}>4</div>
    <div id="CMP_BS_Vityajka_5" className="load" style={{ left: 1006, top: 585, width: "20px", height: "17px" }}>5</div>
  </div>
}