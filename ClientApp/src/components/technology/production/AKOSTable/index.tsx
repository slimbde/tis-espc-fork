import "./akos.scss"
import moment from "moment";
import { Table } from "reactstrap";
import { AKOSHeat } from "models/types/Technology/Production/AKOSHeat";
import { MinToTime } from "components/extra/MinToTime";


type Props = {
  heats: AKOSHeat[]
}



export const AKOSTable: React.FC<Props> = ({
  heats,
}) => {


  return <>
    <Table size="sm" striped className="akos">
      <thead>
        <tr>
          <th>№ плавки</th>
          <th>Время начала</th>
          <th>Время окончания</th>
          <th>Длительность</th>
          <th>Марка</th>
          <th>№ C/K</th>
          <th>Таб. №</th>
          <th>Вес плавки</th>
          <th>Расход аргона</th>
          <th>Время продувки</th>
          <th>Время под током</th>
          <th>Расход ЭЭ</th>
        </tr>
      </thead>
      <tbody>
        {heats && heats.length > 0 && heats.map(h => {
          const startPoint = h.START_POINT ? moment(h.START_POINT).format("HH:mm:ss") : ""
          const endPoint = h.END_POINT ? moment(h.END_POINT).format("HH:mm:ss") : ""
          const duration = startPoint && endPoint
            ? moment.utc(moment(h.END_POINT).diff(moment(h.START_POINT))).format("HH:mm:ss")
            : startPoint
              ? moment.utc(moment().diff(moment(h.START_POINT))).format("HH:mm:ss")
              : ""

          return <tr key={`${h.HEAT_ID}${h.START_POINT}`}>
            <td>{h.HEAT_ID}</td>
            <td>{startPoint}</td>
            <td>{endPoint}</td>
            <td>{duration}</td>
            <td>{h.STEEL_GRADE || "нет данных"}</td>
            <td>{h.LADLE_ID}</td>
            <td>{h.HEAT_TAB}</td>
            <td>{h.HEAT_WEIGHT}</td>
            <td>{h.ARGON_EXPENSE}</td>
            <td>{MinToTime(h.ARGON_TIME)}</td>
            <td>{MinToTime(h.CURRENT_TIME)}</td>
            <td>{h.ENERGY_EXPENSE}</td>
          </tr>
        })}
      </tbody>
    </Table>
  </>
}