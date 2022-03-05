import { AreaId, getAreaName } from "models/types/Technology/Production/AreaId";
import React from "react";
import { Button, ButtonGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";


type Props = {
  areaId: AreaId
  date: string
  shift: number
  areaIdChange: (areaId: AreaId) => void
  dateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  shiftChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  reset: () => void
  back: () => void
  forth: () => void
  loading: boolean
}


const Controls: React.FC<Props> = ({
  areaId,
  date,
  shift,
  dateChange,
  shiftChange,
  areaIdChange,
  reset,
  back,
  forth,
  loading,
}) => {

  return <>
    <div className={`navigation ${loading ? "disabled" : ""}`}>
      <span style={{ gridArea: "date-title" }}>Дата:</span>
      <span style={{ gridArea: "shift-title" }}>Смена:</span>

      <Input
        style={{ gridArea: "date", borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
        bsSize="sm"
        type="date"
        onChange={e => dateChange(e)}
        value={date}
      />

      <InputGroup style={{ gridArea: "shift" }}>
        <Input
          style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0", borderLeft: "0" }}
          className="col-sm-6"
          type="select"
          bsSize="sm"
          value={shift}
          onChange={e => shiftChange(e)}
        >
          <option>1</option>
          <option>2</option>
        </Input>
        <InputGroupAddon addonType="append">
          <Button size="sm" outline onClick={reset}>Сейчас</Button>
        </InputGroupAddon>
      </InputGroup>


      <ButtonGroup size="sm" style={{ gridArea: "controls" }}>
        <Button outline onClick={back}>Назад</Button>
        <Button outline onClick={forth}>Вперед</Button>
      </ButtonGroup>
    </div>

    <div className="filter">
      <span>Агрегат:</span>
      <ButtonGroup size="sm">
        {Object.keys(AreaId).map(area => {
          return isNaN(+area)
            ? <span key={area}></span>
            : <Button key={area} outline color="info" active={areaId === +area} onClick={() => areaIdChange(+area)}>{getAreaName(+area)}</Button>
        })}
      </ButtonGroup>
    </div>
  </>
}

export default Controls;