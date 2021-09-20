import "./kip.scss"
import { useEffect } from "react"
import cHandler from "models/handlers/DbHandlers/CompressorDbHandler"
import { blinkAlert } from "components/extra/Alert"
import { kHandler } from "models/handlers/ISensorHandler"
import { Link } from "react-router-dom"
import { Dispatch, SetStateAction } from "react"


type Props = {
  setTitle: Dispatch<SetStateAction<string>>
}


export const KipElectro: React.FC<Props> = ({ setTitle }) => {

  useEffect(() => {
    setTitle("Компрессорная. Статус датчиков и электрооборудования")
    dispatch()
    const interval = setInterval(() => dispatch(), 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [setTitle])


  const dispatch = () => {
    cHandler.ReadCompressorAsync()
      .then(sensors => kHandler.Handle(sensors))
      .catch(error => {
        blinkAlert(error.message, false)
        console.log(error)
      })
  }



  return <div className="kip-wrapper">
    <Link to="/overview/compressor/main" className="btn btn-outline-dark">Назад</Link>

    <div id="CMP_WS_T_neosush_vozd_3a" className="col1 _3a">23.46</div>
    <div id="CMP_WS_T_osush_vozd_4a" className="col1 _4a">0.00</div>
    <div id="CMP_WS_T_pram_voda_5a" className="col1 _5a">0.00</div>
    <div id="CMP_WS_T_obr_voda_6a" className="col1 _6a">0.00</div>
    <div id="CMP_WS_P_neosush_vozd_8a" className="col1 _8a">0.00</div>
    <div id="CMP_WS_P_osush_vozd_9a" className="col1 _9a">0.00</div>
    <div id="CMP_WS_P_pram_voda_10a" className="col1 _10a">0.00</div>
    <div id="CMP_WS_P_obr_voda_11a" className="col1 _11a">0.00</div>
    <div id="CMP_WS_Q_neosush_vozd_13a" className="col1 _13a">0.00</div>
    <div id="CMP_WS_Q_osush_vozd_14a" className="col1 _14a">0.00</div>
    <div id="CMP_WS_Q_pram_voda_12a" className="col1 _12a">0.00</div>
    <div id="CMP_WS_T_osush_vozd_22a" className="col1 _22a">0.00</div>
    <div id="CMP_WS_T_neosush_vozd_23a" className="col1 _23a">0.00</div>
    <div id="CMP_WS_P_osush_vozd_25a" className="col1 _25a">0.00</div>
    <div id="CMP_WS_P_neosush_vozd_26a" className="col1 _26a">0.00</div>
    <div id="CMP_WS_Q_osush_vozd_27a" className="col1 _27a">0.00</div>
    <div id="CMP_WS_Q_neosush_vozd_28a" className="col1 _28a">0.00</div>

    <div id="CMP_WS_T_neosush_vozd_3a_cur" className="col2 _3a">0.00</div>
    <div id="CMP_WS_T_osush_vozd_4a_cur" className="col2 _4a">0.00</div>
    <div id="CMP_WS_T_pram_voda_5a_cur" className="col2 _5a">0.00</div>
    <div id="CMP_WS_T_obr_voda_6a_cur" className="col2 _6a">0.00</div>
    <div id="CMP_WS_P_neosush_vozd_8a_cur" className="col2 _8a">0.00</div>
    <div id="CMP_WS_P_osush_vozd_9a_cur" className="col2 _9a">0.00</div>
    <div id="CMP_WS_P_pram_voda_10a_cur" className="col2 _10a">0.00</div>
    <div id="CMP_WS_P_obr_voda_11a_cur" className="col2 _11a">0.00</div>
    <div id="CMP_WS_Q_neosush_vozd_13a_cur" className="col2 _13a">0.00</div>
    <div id="CMP_WS_Q_osush_vozd_14a_cur" className="col2 _14a">0.00</div>
    <div id="CMP_WS_Q_pram_voda_12a_cur" className="col2 _12a">0.00</div>
    <div id="CMP_WS_T_osush_vozd_22a_cur" className="col2 _22a">0.00</div>
    <div id="CMP_WS_T_neosush_vozd_23a_cur" className="col2 _23a">0.00</div>
    <div id="CMP_WS_P_osush_vozd_25a_cur" className="col2 _25a">0.00</div>
    <div id="CMP_WS_P_neosush_vozd_26a_cur" className="col2 _26a">0.00</div>
    <div id="CMP_WS_Q_osush_vozd_27a_cur" className="col2 _27a">0.00</div>
    <div id="CMP_WS_Q_neosush_vozd_28a_cur" className="col2 _28a">0.00</div>

    <div id="COM_WS_CMP_PLC_WDOG" style={{ left: 110, top: 179 }}>0.00</div>

    <div id="CMP_BS_T_neosush_vozd_3a_norma" className="ok col3 _3a">норма</div>
    <div id="CMP_BS_T_osush_vozd_4a_norma" className="ok col3 _4a">норма</div>
    <div id="CMP_BS_T_pram_voda_5a_norma" className="ok col3 _5a">норма</div>
    <div id="CMP_BS_T_obr_voda_6a_norma" className="ok col3 _6a">норма</div>
    <div id="CMP_BS_P_neosush_vozd_8a_norma" className="ok col3 _8a">норма</div>
    <div id="CMP_BS_P_osush_vozd_9a_norma" className="ok col3 _9a">норма</div>
    <div id="CMP_BS_P_pram_voda_10a_norma" className="ok col3 _10a">норма</div>
    <div id="CMP_BS_P_obr_voda_11a_norma" className="ok col3 _11a">норма</div>
    <div id="CMP_BS_Q_neosush_vozd_13a_norma" className="ok col3 _13a">норма</div>
    <div id="CMP_BS_Q_osush_vozd_14a_norma" className="ok col3 _14a">норма</div>
    <div id="CMP_BS_Q_pram_voda_12a_norma" className="ok col3 _12a">норма</div>
    <div id="CMP_BS_T_osush_vozd_22a_norma" className="ok col3 _22a">норма</div>
    <div id="CMP_BS_T_neosush_vozd_23a_norma" className="ok col3 _23a">норма</div>
    <div id="CMP_BS_P_osush_vozd_25a_norma" className="ok col3 _25a">норма</div>
    <div id="CMP_BS_P_neosush_vozd_26a_norma" className="ok col3 _26a">норма</div>
    <div id="CMP_BS_Q_osush_vozd_27a_norma" className="ok col3 _27a">норма</div>
    <div id="CMP_BS_Q_neosush_vozd_28a_norma" className="ok col3 _28a">норма</div>

    <div id="CMP_BS_T_neosush_vozd_3a_obriv" className="fault col4 _3a">обрыв</div>
    <div id="CMP_BS_T_osush_vozd_4a_obriv" className="fault col4 _4a">обрыв</div>
    <div id="CMP_BS_T_pram_voda_5a_obriv" className="fault col4 _5a">обрыв</div>
    <div id="CMP_BS_T_obr_voda_6a_obriv" className="fault col4 _6a">обрыв</div>
    <div id="CMP_BS_P_neosush_vozd_8a_obriv" className="fault col4 _8a">обрыв</div>
    <div id="CMP_BS_P_osush_vozd_9a_obriv" className="fault col4 _9a">обрыв</div>
    <div id="CMP_BS_P_pram_voda_10a_obriv" className="fault col4 _10a">обрыв</div>
    <div id="CMP_BS_P_obr_voda_11a_obriv" className="fault col4 _11a">обрыв</div>
    <div id="CMP_BS_Q_neosush_vozd_13a_obriv" className="fault col4 _13a">обрыв</div>
    <div id="CMP_BS_Q_osush_vozd_14a_obriv" className="fault col4 _14a">обрыв</div>
    <div id="CMP_BS_Q_pram_voda_12a_obriv" className="fault col4 _12a">обрыв</div>
    <div id="CMP_BS_T_osush_vozd_22a_obriv" className="fault col4 _22a">обрыв</div>
    <div id="CMP_BS_T_neosush_vozd_23a_obriv" className="fault col4 _23a">обрыв</div>
    <div id="CMP_BS_P_osush_vozd_25a_obriv" className="fault col4 _25a">обрыв</div>
    <div id="CMP_BS_P_neosush_vozd_26a_obriv" className="fault col4 _26a">обрыв</div>
    <div id="CMP_BS_Q_osush_vozd_27a_obriv" className="fault col4 _27a">обрыв</div>
    <div id="CMP_BS_Q_neosush_vozd_28a_obriv" className="fault col4 _28a">обрыв</div>

    <div id="CMP_BS_T_neosush_vozd_3a_peregr" className="warning col5 _3a">переполнение</div>
    <div id="CMP_BS_T_osush_vozd_4a_peregr" className="warning col5 _4a">переполнение</div>
    <div id="CMP_BS_T_pram_voda_5a_peregr" className="warning col5 _5a">переполнение</div>
    <div id="CMP_BS_T_obr_voda_6a_peregr" className="warning col5 _6a">переполнение</div>
    <div id="CMP_BS_P_neosush_vozd_8a_peregr" className="warning col5 _8a">переполнение</div>
    <div id="CMP_BS_P_osush_vozd_9a_peregr" className="warning col5 _9a">переполнение</div>
    <div id="CMP_BS_P_pram_voda_10a_peregr" className="warning col5 _10a">переполнение</div>
    <div id="CMP_BS_P_obr_voda_11a_peregr" className="warning col5 _11a">переполнение</div>
    <div id="CMP_BS_Q_neosush_vozd_13a_peregr" className="warning col5 _13a">переполнение</div>
    <div id="CMP_BS_Q_osush_vozd_14a_peregr" className="warning col5 _14a">переполнение</div>
    <div id="CMP_BS_Q_pram_voda_12a_peregr" className="warning col5 _12a">переполнение</div>
    <div id="CMP_BS_T_osush_vozd_22a_peregr" className="warning col5 _22a">переполнение</div>
    <div id="CMP_BS_T_neosush_vozd_23a_peregr" className="warning col5 _23a">переполнение</div>
    <div id="CMP_BS_P_osush_vozd_25a_peregr" className="warning col5 _25a">переполнение</div>
    <div id="CMP_BS_P_neosush_vozd_26a_peregr" className="warning col5 _26a">переполнение</div>
    <div id="CMP_BS_Q_osush_vozd_27a_peregr" className="warning col5 _27a">переполнение</div>
    <div id="CMP_BS_Q_neosush_vozd_28a_peregr" className="warning col5 _28a">переполнение</div>

    <div id="CMP_BS_KTP_VV_1" className="onoff-col1 onoff-row1 on">ВКЛ</div>
    <div id="CMP_BS_KTP_VV_2" className="onoff-col1 onoff-row2 on">ВКЛ</div>
    <div id="CMP_BS_KTP_section" className="on onoff-col1 onoff-row3">ВКЛ</div>
    <div id="CMP_BS_Lin_conpr_1" className="on onoff-col1 onoff-row4">ВКЛ</div>
    <div id="CMP_BS_Lin_conpr_2" className="on onoff-col1 onoff-row5">ВКЛ</div>
    <div id="CMP_BS_Lin_conpr_3" className="on onoff-col1 onoff-row6">ВКЛ</div>
    <div id="CMP_BS_Lin_conpr_4" className="on onoff-col1 onoff-row7">ВКЛ</div>

    <div id="CMP_BS_AH1101_QF" className="on onoff-col2 onoff-row1">ВКЛ</div>
    <div id="CMP_BS_AH1102_QF" className="on onoff-col2 onoff-row2">ВКЛ</div>
    <div id="CMP_BS_AH1103_QF" className="on onoff-col2 onoff-row3">ВКЛ</div>
    <div id="CMP_BS_AH1104_QF" className="on onoff-col2 onoff-row4">ВКЛ</div>

    <div id="CMP_BS_Shkaf_2_AZ1" className="on onoff-col3 onoff-row1">ВКЛ</div>
    <div id="CMP_BS_Shkaf_4_AZ1" className="on onoff-col3 onoff-row2">ВКЛ</div>
    <div id="CMP_BS_AH1101_FU" className="on onoff-col3 onoff-row3">ВКЛ</div>
    <div id="CMP_BS_AH1102_FU" className="on onoff-col3 onoff-row4">ВКЛ</div>
    <div id="CMP_BS_AH1103_FU" className="on onoff-col3 onoff-row5">ВКЛ</div>
    <div id="CMP_BS_AH1104_FU" className="on onoff-col3 onoff-row6">ВКЛ</div>

    <div id="CMP_PLC_Ok" className="ok" style={{ left: 118, top: 152, width: 52 }}>OK</div>
    <div id="CMP_PLC_fault" className="fault" style={{ left: 118, top: 152, width: 52 }}>FAIL</div>
    <div id="CMP_BA_COMBOX_COMM_OK" className="ok" style={{ left: 118, top: 205, width: 52 }}>OK</div>
    <div id="CMP_BA_COMBOX_COMM_ERR" className="fault" style={{ left: 118, top: 205, width: 52 }}>FAIL</div>
  </div>
}
