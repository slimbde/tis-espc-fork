import "./params.scss"
import React, { useEffect, useState } from "react"
import { parHandler } from "models/handlers/DbHandlers/IDbHandler"
import { ParamModal } from "./ParamsModal"
import { Loading } from "components/extra/Loading"
import { blinkAlert } from "components/extra/Alert"
import { Param } from "models/types/Param"
import { Table } from "reactstrap"
import NoData from "components/extra/NoData"
import aHandler from "models/handlers/DbHandlers/AuthDbHandler"


type Props = {
  REPORT_COUNTER: number,
}

type State = {
  elements: Param[]
  loading: boolean
  modalOpen: boolean
  currentParam: Param | undefined
  saving: boolean
  userRole: string
}



const Params: React.FC<Props> = ({
  REPORT_COUNTER,
}) => {

  const [state, setState] = useState<State>({
    elements: [],
    loading: true,
    modalOpen: false,
    currentParam: undefined,
    saving: false,
    userRole: aHandler.GetRoleFromStash()
  })

  useEffect(() => {
    parHandler.ListForAsync(REPORT_COUNTER)
      .then(elements => {
        setState({ ...state, currentParam: elements[0], elements, loading: false })
      })
      .catch(error => {
        blinkAlert(error, false)
        console.error(error)
      })
    //eslint-disable-next-line
  }, [])


  const toggleModal = () => setState({ ...state, modalOpen: !state.modalOpen })

  const putParam = async (param: Param) => {
    setState({ ...state, saving: true })
    try {
      const updated = await parHandler.PutAsync(param)
      if (updated > 0) {
        blinkAlert("Заготовка успешно обновлена", true)
        setState({ ...state, elements: [...state.elements.map(el => el.LABEL === param.LABEL && el.INTERNAL_TIME === param.INTERNAL_TIME ? param : el)], saving: false, modalOpen: false })
      }
    }
    catch (error) {
      setState({ ...state, saving: false, modalOpen: false })
      console.log(error)
      blinkAlert("Не удалось обновить заготовку", false)
    }
  }


  const getClassName = (label: string) => {
    if (label.indexOf("A") > 0) return "strand-1"
    if (label.indexOf("B") > 0) return "strand-2"
    if (label.indexOf("C") > 0) return "strand-3"
    if (label.indexOf("D") > 0) return "strand-4"
    if (label.indexOf("E") > 0) return "strand-5"
    if (label.indexOf("F") > 0) return "strand-6"
    return ""
  }


  return <div className="params-wrapper">
    {state.elements.length > 0 &&
      <>
        <Table size="sm" hover>
          <thead>
            <tr>
              <th>Тип</th>
              <th>Клеймо</th>
              <th>Дли на [мм]</th>
              <th>Сеч. [мм]</th>
              <th>Сеч. [мм]</th>
              <th>Вес Теор. [кг]</th>
              <th title="REP_WS_DMS_LV">Ур. в крист. [мм]</th>
              <th title="REP_WS_H1N_FW">Расх. воды в крист. [л/мин]</th>
              <th title="REP_WS_H1N_DT">dT воды в крист. [°C]</th>
              <th title="REP_WS_TH_WT">Вес мет. в ПК</th>
              <th title="REP_WS_GER_SP">Скор. раз ливки [м/мин]</th>
              <th title="REP_WS_TH_SHT">Текущ. пере грев в ПК</th>
              <th title="REP_WS_TH_TP">Темп. метал ла в ПК [°C]</th>
              <th title="REP_WS_BOC_STROKE">Ам плит. кача ния [мм]</th>
              <th title="REP_WS_BOC_FRQ">Част. кача ния</th>
              <th title="REP_WS_EMS_FRQ">Част. ЭМП</th>
              <th title="REP_WS_EMS_CUR">Ток ЭМП</th>
              <th title="REP_WS_EMS2_FRQ">Част. фин ЭМП</th>
              <th title="REP_WS_EMS2_CUR">Ток фин. ЭМП</th>
              <th title="REP_WS_H2N_L01A_FW">Расход воды: контур 1-А [л/мин]</th>
              <th title="REP_WS_H2N_L01B_FW">Расход воды: контур 1-Б [л/мин]</th>
              <th title="REP_WM_MIX_PH_STS">Смеш. сталь [1-да]</th>
              <th title="REP_WS_MIX_ST">Тол щина ШОС [мм]</th>
              <th title="REP_WS_APL_FW">Расход ШОС [кг/тон]</th>
              <th title="REP_WS_APL_AUTO">Реж. ШОС 0/1</th>
              <th title="REP_WS_DMS_POS">Пози ция сто пора</th>
              <th>Время реза [чч:мм]</th>
            </tr>
          </thead>
          <tbody>
            {state.elements.map(e =>
              <tr key={`${e.LABEL}${e.INTERNAL_TIME}`} className={getClassName(e.LABEL)}>
                <td className={e.TYPE !== "Блюм" ? "outstanding-product" : ""}>{e.TYPE}</td>
                <td
                  className="a-like"
                  onClick={() => ["Администратор"].some(one => one === state.userRole) && e.TYPE !== "Голова" && setState({ ...state, modalOpen: true, currentParam: e })}
                  title="Нажмите чтобы изменить"
                >{e.LABEL}</td>
                <td>{e.PMPRODUCTLENGTH}</td>
                <td>{e.PMPRODUCTWIDTH}</td>
                <td>{e.PMPRODUCTTHICKNESS}</td>
                <td>{e.WEIGHT}</td>
                <td>{e.REP_WS_DMS_LV}</td>
                <td>{e.REP_WS_H1N_FW}</td>
                <td>{e.REP_WS_H1N_DT}</td>
                <td>{e.REP_WS_TH_WT}</td>
                <td>{e.REP_WS_GER_SP}</td>
                <td>{e.REP_WS_TH_SHT}</td>
                <td>{e.REP_WS_TH_TP}</td>
                <td>{e.REP_WS_BOC_STROKE}</td>
                <td>{e.REP_WS_BOC_FRQ}</td>
                <td>{e.REP_WS_EMS_FRQ}</td>
                <td>{e.REP_WS_EMS_CUR}</td>
                <td>{e.REP_WS_EMS2_FRQ}</td>
                <td>{e.REP_WS_EMS2_CUR}</td>
                <td>{e.REP_WS_H2N_L01A_FW}</td>
                <td>{e.REP_WS_H2N_L01B_FW}</td>
                <td>{e.REP_WM_MIX_PH_STS}</td>
                <td>{e.REP_WS_MIX_ST}</td>
                <td>{e.REP_WS_APL_FW}</td>
                <td>{e.REP_WS_APL_AUTO}</td>
                <td>{e.REP_WS_DMS_POS}</td>
                <td>{e.INTERNAL_TIME}</td>
              </tr>
            )}
          </tbody>
        </Table>
        <ParamModal {...{
          open: state.modalOpen,
          toggle: toggleModal,
          param: state.currentParam!,
          putParam,
          saving: state.saving,
        }} />
      </>
    }
    {state.loading && <Loading />}
    {state.elements.length === 0 && !state.loading && <NoData />}
  </div >
}

export default Params
