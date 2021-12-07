import "./LF.scss"
import { LFHeat } from "models/types/Production/LFHeat";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { useState } from "react";
import { HeatEventModal } from "../HeatEventModal";
import { AreaId } from "models/types/Production/AreaId";

type Props = {
  shift: number
  heatDate: string
  heats: LFHeat[]
  areaId: AreaId
}

type ModalState = {
  isOpen: boolean,
  currentHeat: string
}


export const LFTable: React.FC<Props> = ({
  shift,
  heatDate,
  heats,
  areaId,
}) => {

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
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
  const openModal = (currentHeat: string) => setModalState({ isOpen: true, currentHeat })


  return <>
    <Table size="sm" striped className="LF">
      <thead>
        <tr>
          <th>№ плавки</th>
          <th>Время начала</th>
          <th>Время оконча ния</th>
          <th>Марка</th>
          <th>Вес, т</th>
          <th>№ сталь ковша</th>
          <th>Нач. темпе ратура</th>
          <th>Конеч. темпе ратура</th>
          <th>Плавка, мин:c</th>
          <th>Под током, мин:c</th>
          <th>Расход ЭЭ</th>
          <th>АРГОН, м3 ФУР МА1</th>
          <th>АРГОН, м3 ФУР МА2</th>
          <th>АЗОТ, м3 ФУР МА1</th>
          <th>АЗОТ, м3 ФУР МА2</th>
          <th>ПРО ДУВКА, мин:с ФУРМА1</th>
          <th>ПРО ДУВКА, мин:с ФУРМА2</th>
          <th>ДАВЛЕ НИЕ, бар ФУРМА1</th>
          <th>ДАВЛЕ НИЕ, бар ФУРМА2</th>
          <th>БАЙПАС, мин ФУРМА1</th>
          <th>БАЙПАС, мин ФУРМА2</th>
        </tr>
      </thead>
      <tbody>
        {heats.length > 0 && heats.map(h => {
          const correctStart = getCorrectDate(h.START_POINT)
          const correctStop = getCorrectDate(h.STOP_POINT)

          return <tr key={`${h.HEAT_ID}${h.START_POINT}`} className={h.STOP_POINT === "ТЕКУЩ" ? "active" : ""}>
            <td title="Посмотреть события плавки" className="a-like" onClick={() => openModal(h.HEAT_ID)}>{h.HEAT_ID}</td>
            <td title="Посмотреть действия оператора"><Link to={`/technology/operator/${areaId}/${correctStart} ${h.START_POINT}/${correctStop} ${h.STOP_POINT}`}>{h.START_POINT}</Link></td>
            <td>{h.STOP_POINT}</td>
            <td>{h.STEEL_GRD}</td>
            <td>{h.WEIGHT}</td>
            <td>{h.LADLE_ID}</td>
            <td>{h.FIRST_TEMP}</td>
            <td>{h.END_TEMP}</td>
            <td>{h.TOTAL_TIME}</td>
            <td>{h.ENERGY_TIME}</td>
            <td>{h.SUM_ENERGY}</td>
            <td>{h.SUM_AR1}</td>
            <td>{h.SUM_AR2}</td>
            <td>{h.SUM_N1}</td>
            <td>{h.SUM_N2}</td>
            <td>{h.BLOW_TIME1}</td>
            <td>{h.BLOW_TIME2}</td>
            <td>{h.PRESS_AVG1}</td>
            <td>{h.PRESS_AVG2}</td>
            <td>{h.BYPASS_TIME1}</td>
            <td>{h.BYPASS_TIME2}</td>
          </tr>
        })}
      </tbody>
    </Table>
    <HeatEventModal {...{ isOpen: modalState.isOpen, toggle, heatId: modalState.currentHeat, areaId }} />
  </>
}