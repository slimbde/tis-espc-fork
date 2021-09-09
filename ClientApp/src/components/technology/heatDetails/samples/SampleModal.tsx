import { Sample } from "models/types/Sample"
import moment from "moment"
import React, { useState } from "react"
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"


type Props = {
  isOpen: boolean
  sample: Sample
  isAppend: boolean
  toggle: () => void
  postSample: (obj: Sample) => void
  putSample: (obj: Sample) => void
}

type State = {
  date: string
  time: string
  temp: string
  superheat: string
  oxygen: string
  hydrogen: string,
  counter: string,
}




export const SampleModal: React.FC<Props> = ({
  isOpen,
  sample,
  isAppend,
  toggle,
  postSample,
  putSample
}) => {

  const dt = moment(sample.SAMPLE_DATE, "DD.MM.YYYY HH:mm:ss").toISOString(true)

  const [state, setState] = useState<State>({
    date: dt.slice(0, 10),
    time: dt.slice(11, 19),
    temp: sample.TEMPERATURE_VALUE,
    superheat: sample.SUPERHEAT_VALUE,
    oxygen: sample.OXYGEN_VALUE,
    hydrogen: sample.HYDROGEN_VALUE,
    counter: sample.SAMPLE_COUNTER,
  })

  const onOpen = () => {
    setState({
      date: dt.slice(0, 10),
      time: dt.slice(11, 19),
      temp: sample.TEMPERATURE_VALUE,
      superheat: sample.SUPERHEAT_VALUE,
      oxygen: sample.OXYGEN_VALUE,
      hydrogen: sample.HYDROGEN_VALUE,
      counter: sample.SAMPLE_COUNTER,
    })
  }


  const update = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setState({ ...state, [prop]: value })
  }

  const submit = () => {
    const sampleToDb: Sample = {
      LANCE_TYPE: sample.LANCE_TYPE,
      REPORT_COUNTER: sample.REPORT_COUNTER,
      CARBON_VALUE: sample.CARBON_VALUE,
      HYDROGEN_VALUE: state.hydrogen,
      OXYGEN_VALUE: state.oxygen,
      SAMPLE_COUNTER: sample.SAMPLE_COUNTER,
      SAMPLE_DATE: `${state.date} ${state.time}`,
      SUPERHEAT_VALUE: state.superheat,
      TEMPERATURE_VALUE: state.temp
    }

    isAppend && postSample(sampleToDb)
    !isAppend && putSample(sampleToDb)
  }


  return <Modal isOpen={isOpen} onOpened={onOpen} toggle={toggle} className="samples" fade={false} unmountOnClose={true}>
    <ModalHeader toggle={toggle}>{isAppend ? "Добавить" : "Изменить"} замер {state.counter}</ModalHeader>
    <ModalBody>
      <Form>
        <FormGroup>
          <Label for="date">Дата</Label>
          <Input bsSize="sm" type="date" id="date" value={state.date} onChange={update("date")} />
        </FormGroup>
        <FormGroup>
          <Label for="time">Время</Label>
          <Input bsSize="sm" type="time" id="time" value={state.time} onChange={update("time")} />
        </FormGroup>
        <FormGroup>
          <Label for="temp">Температура</Label>
          <Input bsSize="sm" type="number" id="temp" value={state.temp} onChange={update("temp")} />
        </FormGroup>
        <FormGroup>
          <Label for="superheat">Перегрев</Label>
          <Input bsSize="sm" type="number" id="superheat" value={state.superheat} onChange={update("superheat")} />
        </FormGroup>
        <FormGroup>
          <Label for="oxygen">Окисленность</Label>
          <Input bsSize="sm" type="number" id="oxygen" value={state.oxygen} onChange={update("oxygen")} />
        </FormGroup>
        <FormGroup>
          <Label for="hydrogen">Водород</Label>
          <Input bsSize="sm" type="number" id="hydrogen" value={state.hydrogen} onChange={update("hydrogen")} />
        </FormGroup>
      </Form>
    </ModalBody>
    <ModalFooter>
      <Button size="sm" outline color="primary" onClick={submit}>Сохранить</Button>{' '}
      <Button size="sm" outline color="secondary" onClick={toggle}>Отмена</Button>
    </ModalFooter>
  </Modal>
}