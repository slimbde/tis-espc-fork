import "./journal.scss"
import { Alert, Button, ButtonGroup } from "reactstrap"
import { useState } from "react"
import { Controls } from "components/diagnostic/Journal/Controls"
import { Filter } from "models/types/Diagnostic/Operators/Filter"


type State = {
  areaId: number
}


export const Journal: React.FC = () => {

  const [state, setState] = useState<State>({
    areaId: 600,
  })


  const getAreaName = (AREA_ID: number) => {
    switch (AREA_ID) {
      case 600: return "АКП-2"
      case 800: return "ВКД"
      case 1100: return "МНЛЗ-2"
    }
  }

  const applyFilter = (filter: Filter) => {
    console.log(filter)
  }


  return <div className="journal-wrapper">
    <Alert id="alert">Hello</Alert>
    <div className="title display-5">Журнал действий оператора {getAreaName(state.areaId)}</div>
    <div className="subtitle">
      Отчеты из системы протоколирования
      <ButtonGroup size="sm">
        <Button color="info" outline active={state.areaId === 600} onClick={() => setState({ ...state, areaId: 600 })}>АКП-2</Button>
        <Button color="info" outline active={state.areaId === 800} onClick={() => setState({ ...state, areaId: 800 })}>ВКД</Button>
        <Button color="info" outline active={state.areaId === 1100} onClick={() => setState({ ...state, areaId: 1100 })}>МНЛЗ-2</Button>
      </ButtonGroup>
    </div>
    <div className="controls">
      <Controls {...{ applyFilter }} />
    </div>
  </div>
}