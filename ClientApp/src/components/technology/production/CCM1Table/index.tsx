import "./CCM1.scss"
import moment from "moment";
import { Table } from "reactstrap";
import { CCM1Heat } from "models/types/Technology/Production/CCM1Heat";
import { MetallurgicalRange } from "components/extra/MetallurgicalDate";
import { useEffect, useState } from "react";


type Props = {
  shift: number
  heats: CCM1Heat[]
  heatDate: string
}



export const CCM1Table: React.FC<Props> = ({
  shift,
  heats,
  heatDate,
}) => {

  const [state, setState] = useState({ middle: moment() })

  useEffect(() => {
    const [middle] = MetallurgicalRange(heatDate)
    setState({ middle })
    //eslint-disable-next-line
  }, [])

  const heatShift = (heat: CCM1Heat) => {
    if (moment(heat.START_POINT).isAfter(state.middle)) return 2
    return 1
  }


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
          if (heatShift(h) !== shift) return undefined

          return <tr key={`${h.HEAT_ID}${h.START_POINT}`}>
            <td>{h.HEAT_ID}</td>
            <td>{moment(h.START_POINT).format("HH:mm:ss")}</td>
            <td>{moment(h.END_POINT).format("HH:mm:ss")}</td>
            <td>{moment.utc(moment(h.END_POINT).diff(moment(h.START_POINT))).format("HH:mm:ss")}</td>
            <td>{h.LADLE_ID}</td>
            <td>{h.TUNDISH_ID}</td>
            <td>{h.STEEL_GRADE}</td>
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