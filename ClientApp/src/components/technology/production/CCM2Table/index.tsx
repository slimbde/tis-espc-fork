import "./CCM.scss"
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { useState } from "react";
import { HeatEventModal } from "../HeatEventModal";
import { AreaId } from "models/types/Technology/Production/AreaId";
import { CCM2Heat } from "models/types/Technology/Production/CCM2Heat";
import { HeatCCMProcessModal } from "./HeatCCMProcessModal";
import { HeatCCMQualityModal } from "./HeatCCMQualityModal";

type Props = {
  shift: number
  heatDate: string
  heats: CCM2Heat[]
  areaId: AreaId
}

type ModalState = {
  isOpen: boolean
  isProcessOpen: boolean
  isQualityOpen: boolean
  currentHeat: string
}


export const CCM2Table: React.FC<Props> = ({
  shift,
  heatDate,
  heats,
  areaId,
}) => {

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    isProcessOpen: false,
    isQualityOpen: false,
    currentHeat: "",
  })

  const getCorrectDate = (date: string) => {
    const fullStart = `${heatDate} ${date}`
    const hour = new Date(fullStart).getHours()
    const minute = new Date(fullStart).getMinutes()

    return shift === 1
      ? (hour < 7) || (hour === 7 && minute < 30)
        ? heatDate
        : moment(heatDate).subtract(1, "day").format("YYYY-MM-DD")
      : heatDate
  }


  const toggle = () => setModalState({ ...modalState, isOpen: !modalState.isOpen })
  const toggleProcess = () => setModalState({ ...modalState, isProcessOpen: !modalState.isProcessOpen })
  const toggleQuality = () => setModalState({ ...modalState, isQualityOpen: !modalState.isQualityOpen })
  const openModal = (currentHeat: string) => setModalState({ ...modalState, isOpen: true, currentHeat })
  const openProcessModal = (currentHeat: string) => setModalState({ ...modalState, isProcessOpen: true, currentHeat })
  const openQualityModal = (currentHeat: string) => setModalState({ ...modalState, isQualityOpen: true, currentHeat })


  return <>
    <Table size="sm" striped className="CCM">
      <thead>
        <tr>
          <th>№ плавки</th>
          <th>Время начала</th>
          <th>Время окончания</th>
          <th>Марка</th>
          <th>Плавка, мин:c</th>
          <th>№ в серии</th>
          <th>Размер</th>
          <th>Слябов</th>
          <th>Нач. температура</th>
          <th>Нач. вес, т</th>
          <th>Отлито вес, т</th>
          <th>Ост. в П/К</th>
        </tr>
      </thead>
      <tbody>
        {heats && heats.length > 0 && heats.map(h => {
          const correctStart = getCorrectDate(h.START_POINT)
          const correctStop = getCorrectDate(h.STOP_POINT)

          return <tr key={`${h.HEAT_ID}${h.START_POINT}`} className={h.STOP_POINT === "ТЕКУЩ" ? "active" : ""}>
            <td title="Посмотреть события плавки" className="a-like" onClick={() => openModal(h.HEAT_ID)}>{h.HEAT_ID}</td>
            <td title="Посмотреть действия оператора"><Link to={`/technology/operator/${areaId}/${correctStart} ${h.START_POINT}/${correctStop} ${h.STOP_POINT}`}>{h.START_POINT}</Link></td>
            <td>{h.STOP_POINT}</td>
            <td title="Посмотреть отчет по качеству" className="a-like" onClick={() => openQualityModal(h.HEAT_ID)}>{h.STEEL_GRADE_ID}</td>
            <td>{h.DURATION}</td>
            <td>{h.SEQ_HEAT_COUNTER}</td>
            <td title="Посмотреть процесс плавки" className="a-like" onClick={() => openProcessModal(h.HEAT_ID)}>{h.MEASURES}</td>
            <td>{h.TOT_PIECES}</td>
            <td>{h.FIRST_TEMP}</td>
            <td>{h.START_WGT}</td>
            <td>{h.TOT_WGT}</td>
            <td>{h.YELD}</td>
          </tr>
        })}
      </tbody>
    </Table>
    <HeatEventModal {...{ isOpen: modalState.isOpen, toggle, heatId: modalState.currentHeat, areaId }} />
    <HeatCCMProcessModal {...{ isOpen: modalState.isProcessOpen, toggle: toggleProcess, heatId: modalState.currentHeat, areaId }} />
    <HeatCCMQualityModal {...{ isOpen: modalState.isQualityOpen, toggle: toggleQuality, heatId: modalState.currentHeat, areaId }} />
  </>
}