import "./CCM1.scss"
import moment from "moment";
import { Table } from "reactstrap";
import { CCM1Heat } from "models/types/Technology/Production/CCM1Heat";


type Props = {
  heats: CCM1Heat[]
}



export const CCM1Table: React.FC<Props> = ({
  heats,
}) => {


  return <>
    <Table size="sm" striped className="CCM1">
      <thead>
        <tr>
          <th>№ плавки</th>
          <th>Время начала</th>
          <th>Время окончания</th>
          <th>Длитель ность</th>
          <th>№ C/K</th>
          <th>№ П/К</th>
          <th>Марка</th>
          <th>№ в серии</th>
          <th>Скорость разливки</th>
          <th>Профиль</th>
          <th>Слябов</th>
          <th>Нач. темпера тура</th>
          <th>Годное, т</th>
          <th>Стойкость кристалли затора</th>
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
            <td>{h.LADLE_ID}</td>
            <td>{h.TUNDISH_ID}</td>
            <td>{h.STEEL_GRADE || "нет данных"}</td>
            <td>{h.SERIES}</td>
            <td>{h.CASTING_SPEED}</td>
            <td>{h.PROFILE_ID}</td>
            <td>{h.SLABS}</td>
            <td>{h.TEMP}</td>
            <td>{h.GOOD}</td>
            <td>{h.STOIK_CRYST}</td>
          </tr>
        })}
      </tbody>
    </Table>
  </>
}