import { AreaId } from "models/types/Technology/Production/AreaId";
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
}) => {

  return <>
    <div className="navigation">
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
        <Button outline color="info" active={areaId === AreaId.LF_DIAG} onClick={() => areaIdChange(AreaId.LF_DIAG)}>АКП-2</Button>
        <Button outline color="info" active={areaId === AreaId.VOD_DIAG} onClick={() => areaIdChange(AreaId.VOD_DIAG)}>ВАКУУМАТОР</Button>
        <Button outline color="info" active={areaId === AreaId.CCM_DIAG} onClick={() => areaIdChange(AreaId.CCM_DIAG)}>МНЛЗ-2</Button>
      </ButtonGroup>
    </div>
  </>
}

export default Controls;