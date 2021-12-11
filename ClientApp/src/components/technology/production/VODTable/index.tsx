import "./VOD.scss"
import moment from "moment";
import { VODHeat } from "models/types/Production/VODHeat";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { HeatEventModal } from "../HeatEventModal";
import { AreaId } from "models/types/Production/AreaId";
import { HeatVODProcessModal } from "./HeatVODProcessModal";

type Props = {
  shift: number
  heatDate: string
  heats: VODHeat[]
  areaId: AreaId
}

type ModalState = {
  isOpen: boolean,
  isProcessOpen: boolean
  currentHeat: string
}


export const VODTable: React.FC<Props> = ({
  shift,
  heatDate,
  heats,
  areaId,
}) => {

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    isProcessOpen: false,
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
  const openModal = (currentHeat: string) => setModalState({ ...modalState, isOpen: true, currentHeat })

  const toggleProcess = () => setModalState({ ...modalState, isProcessOpen: !modalState.isProcessOpen })
  const openProcessModal = (currentHeat: string) => setModalState({ ...modalState, isProcessOpen: true, currentHeat })


  return <>
    <Table size="sm" striped className="VOD">
      <thead>
        <tr>
          <th>№ плавки</th>
          <th>Время начала</th>
          <th>Время оконча ния</th>
          <th>Марка</th>
          <th>Про цесс</th>
          <th>Вес, т</th>
          <th>№ сталь ковша</th>
          <th>Нач. темпе ратура</th>
          <th>Конеч. темпе ратура</th>
          <th>Плавка, мин</th>
          <th>Крышка, мин</th>
          <th>Вакуум, мин</th>
          <th>Кисло род, м3</th>
          <th>Давл, мин</th>
          <th>АРГОН, м3 ФУР МА1</th>
          <th>АРГОН, м3 ФУР МА2</th>
          <th>АЗОТ, м3 ФУР МА1</th>
          <th>АЗОТ, м3 ФУР МА2</th>
          <th>ПРО ДУВКА, мин ФУРМА1</th>
          <th>ПРО ДУВКА, мин ФУРМА2</th>
          <th>ДАВЛЕ НИЕ, бар ФУРМА1</th>
          <th>ДАВЛЕ НИЕ, бар ФУРМА2</th>
          <th>БАЙ ПАС, мин ФУРМА1</th>
          <th>БАЙ ПАС, мин ФУРМА2</th>
        </tr>
      </thead>
      <tbody>
        {heats.length > 0 && heats.map(h => {
          const correctStart = getCorrectDate(h.START_POINT)
          const correctStop = getCorrectDate(h.STOP_POINT)

          return <tr key={`${h.HEAT_ID}${h.START_POINT}`} className={h.STOP_POINT === "ТЕКУЩ" ? "active" : ""}>
            <td title="Посмотреть события плавки" className="a-like" onClick={() => openModal(h.HEAT_ID)}>{h.HEAT_ID}</td>
            <td title="Посмотреть действия оператора"><Link to={`/diagnostic/operator/${areaId}/${correctStart} ${h.START_POINT}/${correctStop} ${h.STOP_POINT}`}>{h.START_POINT}</Link></td>
            <td>{h.STOP_POINT}</td>
            <td>{h.STEEL_GRD}</td>
            <td title="Посмотреть процесс плавки" className="a-like" onClick={() => openProcessModal(h.HEAT_ID)}>{h.PROCESS}</td>
            <td>{h.WEIGHT}</td>
            <td>{h.LADLE_ID}</td>
            <td>{h.FIRST_TEMP}</td>
            <td>{h.END_TEMP}</td>
            <td>{h.ALL_TIME}</td>
            <td>{h.CAP_TIME}</td>
            <td>{h.VAC_TIME}</td>
            <td>{h.O2}</td>
            <td>{h.PRESS_MIN}</td>
            <td>{h.AR_FURM1}</td>
            <td>{h.AR_FURM2}</td>
            <td>{h.N_FURM1}</td>
            <td>{h.N_FURM2}</td>
            <td>{h.BLOW_FURM1}</td>
            <td>{h.BLOW_FURM2}</td>
            <td>{h.PRESS_FURM1}</td>
            <td>{h.PRESS_FURM2}</td>
            <td>{h.BYPASS1_TIME}</td>
            <td>{h.BYPASS2_TIME}</td>
          </tr>
        })}
      </tbody>
    </Table>
    <HeatEventModal {...{ isOpen: modalState.isOpen, toggle, heatId: modalState.currentHeat, areaId }} />
    <HeatVODProcessModal {...{ isOpen: modalState.isProcessOpen, toggle: toggleProcess, heatId: modalState.currentHeat }} />
  </>
}