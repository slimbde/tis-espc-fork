import React from "react";
import { Button, ButtonGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";


type Props = {
  innerRef: any
  date: string
  dateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  reset: () => void
  back: () => void
  forth: () => void
}


const Controls: React.FC<Props> = ({
  innerRef,
  date,
  dateChange,
  reset,
  back,
  forth,
}) => {

  return <div className="navigation" ref={innerRef}>
    <InputGroup>
      <Input
        bsSize="sm"
        type="date"
        onChange={e => dateChange(e)}
        value={date}
      />
      <InputGroupAddon addonType="append">
        <Button size="sm" outline onClick={reset}>Сейчас</Button>
      </InputGroupAddon>
    </InputGroup>

    <ButtonGroup size="sm">
      <Button outline onClick={back}>Назад</Button>
      <Button outline onClick={forth}>Вперед</Button>
    </ButtonGroup>
  </div>
}

export default Controls;