import { Loading } from "components/extra/Loading"
import { Param } from "models/types/Param"
import React, { useState } from "react"
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"


type Props = {
  open: boolean
  toggle: () => void
  param: Param
  putParam: (obj: Param) => void
  saving: boolean
}



export const ParamModal: React.FC<Props> = ({
  open,
  toggle,
  param,
  putParam,
  saving,
}) => {

  const [state, setState] = useState<Param>(param)


  const onOpen = () => setState(param)


  const update = (prop: keyof Param) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setState({ ...state, [prop]: value })
  }

  const CustomFormGroup = (props: { param: string, hint: string }) =>
    <FormGroup>
      <Input
        bsSize="sm"
        type="number"
        id={props.param}
        value={state[props.param as keyof Param].replace(",", ".")}
        onChange={update(props.param as keyof Param)}
      />
      <Label for={props.param}>{props.hint}</Label>
    </FormGroup>


  return <Modal
    backdrop={"static"}
    isOpen={open}
    toggle={toggle}
    className="params"
    fade={false}
    role="dialog"
    unmountOnClose={true}
    onOpened={onOpen}
  >
    <ModalHeader toggle={toggle}>Изменить заготовку {state.LABEL}{saving && <div>сохранение. ждите ...</div>}{saving && <Loading />}</ModalHeader>
    <ModalBody>
      {saving && <div className="shade film"></div>}
      <Form>
        <CustomFormGroup {...{ param: "REP_WS_DMS_LV", hint: "Уровень в крист. [мм]" }} />
        <CustomFormGroup {...{ param: "REP_WS_H1N_FW", hint: "Расх. воды в крист. [л/мин]" }} />
        <CustomFormGroup {...{ param: "REP_WS_H1N_DT", hint: "dT воды в крист. [°C]" }} />
        <CustomFormGroup {...{ param: "REP_WS_TH_WT", hint: "Вес металла в ПК" }} />
        <CustomFormGroup {...{ param: "REP_WS_GER_SP", hint: "Скорость разливки [м/мин]" }} />
        <CustomFormGroup {...{ param: "REP_WS_TH_SHT", hint: "Текущий перегрев в ПК" }} />
        <CustomFormGroup {...{ param: "REP_WS_TH_TP", hint: "Темпер. металла в ПК[°C]" }} />
        <CustomFormGroup {...{ param: "REP_WS_BOC_STROKE", hint: "Амплит. качания [мм]" }} />
        <CustomFormGroup {...{ param: "REP_WS_BOC_FRQ", hint: "Част. качания" }} />
        <CustomFormGroup {...{ param: "REP_WS_EMS_FRQ", hint: "Част. ЭМП" }} />
        <CustomFormGroup {...{ param: "REP_WS_EMS_CUR", hint: "Ток ЭМП" }} />
        <CustomFormGroup {...{ param: "REP_WS_EMS2_FRQ", hint: "Част. фин ЭМП" }} />
        <CustomFormGroup {...{ param: "REP_WS_EMS2_CUR", hint: "Ток фин. ЭМП" }} />
        <CustomFormGroup {...{ param: "REP_WS_H2N_L01A_FW", hint: "Расход воды: контур 1-А [л/мин]" }} />
        <CustomFormGroup {...{ param: "REP_WS_H2N_L01B_FW", hint: "Расход воды: контур 1-Б [л/мин]" }} />
        <CustomFormGroup {...{ param: "REP_WM_MIX_PH_STS", hint: "Смеш. сталь [1-да]" }} />
        <CustomFormGroup {...{ param: "REP_WS_MIX_ST", hint: "Толщина ШОС [мм]" }} />
        <CustomFormGroup {...{ param: "REP_WS_APL_FW", hint: "Расход ШОС [кг/тон]" }} />
        <CustomFormGroup {...{ param: "REP_WS_APL_AUTO", hint: "Режим ШОС [0-1]" }} />
        <CustomFormGroup {...{ param: "REP_WS_DMS_POS", hint: "Позиция стопора" }} />
      </Form>
    </ModalBody>
    <ModalFooter>
      {saving && <div className="shade"></div>}
      <Button size="sm" outline color="primary" onClick={() => putParam(state)}>Сохранить</Button>{' '}
      <Button size="sm" outline color="secondary" onClick={toggle}>Отмена</Button>
    </ModalFooter>
  </Modal >
}
