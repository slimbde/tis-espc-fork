import React, { useState } from "react"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import pHandler from "models/handlers/DbHandlers/ProductionHandler"
import { HeatCCMProcess } from "models/types/Production/HeatCCMProcess"


type Props = {
  isOpen: boolean
  toggle: () => void
  heatId: string
}



export const HeatCCMProcessModal: React.FC<Props> = ({
  isOpen,
  toggle,
  heatId,
}) => {

  const [processes, setProcesses] = useState<HeatCCMProcess[]>([])

  const getEvents = () => {
    pHandler.GetHeatCCMProcessesAsync(heatId)
      .then(processes => setProcesses(processes))
      .catch(console.log)
  }

  return <div className="ccm-heat-process-wrapper">
    <Modal className="ccm-heat-process-modal" isOpen={isOpen} onOpened={getEvents} toggle={toggle} fade={false} unmountOnClose={true}>
      <ModalHeader toggle={toggle}>Процесс плавки {heatId}</ModalHeader>
      <ModalBody>
        {processes.length > 0 &&
          <Table hover>
            <thead>
              <tr>
                <th>№ сля ба</th>
                <th>Ампл. кача ния</th>
                <th>Час тота</th>
                <th>dT</th>
                <th>Вода ЗВО</th>
                <th>Уро вень в_крист.</th>
                <th>Сто пор</th>
                <th>Скорости</th>
                <th>Т промковша</th>
                <th>Дли на</th>
                <th>Шири на</th>
                <th>Тол щина</th>
                <th>Вес</th>
              </tr>
            </thead>
            <tbody>
              {processes.map(e =>
                <tr key={`${e.N_SL}${e.WEIGHT}`}>
                  <td>{e.N_SL}</td>
                  <td>{e.K_AMP}</td>
                  <td>{e.K_FREQ}</td>
                  <td>{e.DT}</td>
                  <td>{e.W_ZVO}</td>
                  <td>{e.K_UR}</td>
                  <td>{e.S_POZ}</td>
                  <td>{e.V_RAZL}</td>
                  <td>{e.T_PK}</td>
                  <td>{e.LEN}</td>
                  <td>{e.WID}</td>
                  <td>{e.THICK}</td>
                  <td>{e.WEIGHT}</td>
                </tr>
              )}
            </tbody>
          </Table>}
      </ModalBody>
    </Modal>
  </div>
}
