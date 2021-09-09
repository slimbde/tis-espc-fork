import React, { useRef, useState } from "react";
import { Button, ButtonGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";


type Props = {
  date: string,
  shift: number
  shiftChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  dateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  reset: () => void
  back: () => void
  forth: () => void
  find: (heatId: string) => void
}


const Controls: React.FC<Props> = ({
  date,
  shift,
  shiftChange,
  dateChange,
  reset,
  back,
  forth,
  find
}) => {

  const [heatId, setHeatId] = useState("0")

  const dateInput = useRef<HTMLInputElement>(null)
  const shiftInput = useRef<HTMLInputElement>(null)
  const heatInput = useRef<HTMLInputElement>(null)


  const heatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setHeatId(e.target.value)


  return <>
    <div className="navigation">
      <span style={{ gridArea: "date-title" }}>Дата:</span>
      <span style={{ gridArea: "shift-title" }}>Смена:</span>

      <Input
        style={{ gridArea: "date", borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
        bsSize="sm"
        type="date"
        innerRef={dateInput}
        onChange={e => dateChange(e)}
        value={date}
      />

      <InputGroup style={{ gridArea: "shift" }}>
        <Input
          style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0", borderLeft: "0" }}
          className="col-sm-6"
          type="select"
          bsSize="sm"
          innerRef={shiftInput}
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
      <span style={{ gridArea: "filter-title" }}>Поиск по номеру плавки:</span>

      <InputGroup style={{ gridArea: "filter-main", display: "flex", justifyContent: "flex-end" }}>
        <Input
          className="col-sm-6"
          type="text"
          placeholder="Номер плавки..."
          innerRef={heatInput}
          onChange={heatInputChange}
          bsSize="sm"
          onKeyDown={(e) => e.key === "Enter" && find(heatId)}
        />
        <InputGroupAddon addonType="append">
          <Button size="sm" outline onClick={() => find(heatId)}>Поиск</Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  </>
}

export default Controls;