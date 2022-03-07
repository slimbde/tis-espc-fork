import "./dsp.scss"
import moment from "moment";
import { Table } from "reactstrap";
import { MinToTime } from "components/extra/MinToTime";
import { DSPHeat } from "models/types/Technology/Production/DSPHeat";


type Props = {
  heats: DSPHeat[]
}



export const DSPTable: React.FC<Props> = ({
  heats,
}) => {


  return <>
    <Table size="sm" striped className="dsp">
      <thead>
        <tr>
          <th>№ плавки</th>
          <th>Время начала</th>
          <th>Завалка</th>
          <th>Слив</th>
          <th>Время окончания</th>
          <th>Марка</th>
          <th>№ C/K</th>
          <th>Таб. №</th>
          <th>Вес плавки</th>
          <th>Время под током</th>
          <th>Расход ЭЭ</th>
        </tr>
      </thead>
      <tbody>
        {heats && heats.length > 0 && heats.map(h => {
          const startPoint = h.START_POINT ? moment(h.START_POINT).format("HH:mm:ss") : ""
          const endPoint = h.END_POINT ? moment(h.END_POINT).format("HH:mm:ss") : ""
          const fillPoint = h.FILL_POINT ? moment(h.FILL_POINT).format("HH:mm:ss") : ""
          const flushPoint = h.FLUSH_POINT ? moment(h.FLUSH_POINT).format("HH:mm:ss") : ""

          return <tr key={`${h.HEAT_ID}${h.START_POINT}`}>
            <td>{h.HEAT_ID}</td>
            <td>{startPoint}</td>
            <td>{fillPoint}</td>
            <td>{flushPoint}</td>
            <td>{endPoint}</td>
            <td>{h.STEEL_GRADE || "нет данных"}</td>
            <td>{h.LADLE_ID}</td>
            <td>{h.HEAT_TAB}</td>
            <td>{h.HEAT_WEIGHT}</td>
            <td>{MinToTime(h.CURRENT_TIME)}</td>
            <td>{h.ENERGY_EXPENSE}</td>
          </tr>
        })}
      </tbody>
    </Table>
  </>
}