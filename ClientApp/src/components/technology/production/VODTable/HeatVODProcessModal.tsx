import React, { useState } from "react"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import { HeatVODProcess } from "models/types/Production/HeatVODProcess"
import pHandler from "models/handlers/DbHandlers/ProductionDbHandler"


type Props = {
  isOpen: boolean
  toggle: () => void
  heatId: string
}



export const HeatVODProcessModal: React.FC<Props> = ({
  isOpen,
  toggle,
  heatId,
}) => {

  const [processes, setProcesses] = useState<HeatVODProcess[]>([])

  const getEvents = () => {
    pHandler.GetHeatVODProcessesAsync(heatId)
      .then(processes => setProcesses(processes))
      .catch(console.log)
  }

  return <div className="heat-process-wrapper">
    <Modal isOpen={isOpen} onOpened={getEvents} toggle={toggle} fade={false} unmountOnClose={true}>
      <ModalHeader toggle={toggle}>Процесс плавки {heatId}</ModalHeader>
      <ModalBody>
        {processes &&
          <Table hover>
            <thead>
              <tr>
                <th>Операция</th>
                <th>Начало</th>
                <th>Окончание</th>
                <th>Факт. время</th>
                <th>Факт. температура</th>
                <th>План. температура</th>
                <th>Факт. вакуумирование</th>
              </tr>
            </thead>
            <tbody>
              {processes.map(e =>
                <tr key={`${e.START_TIME}${e.STOP_TIME}`}>
                  <td>{e.PROCESS_STEP_ID}</td>
                  <td>{e.START_TIME}</td>
                  <td>{e.STOP_TIME}</td>
                  <td>{e.ALL_TIME}</td>
                  <td>{e.STOP_STEEL_TEMP}</td>
                  <td>{e.AIM_STEEL_TEMP}</td>
                  <td>{e.VACUUM_PR_MIN}</td>
                </tr>
              )}
            </tbody>
          </Table>}
      </ModalBody>
    </Modal>
  </div>
}
