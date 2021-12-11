import React, { useState } from "react"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import pHandler from "models/handlers/DbHandlers/ProductionDbHandler"
import { HeatCCMQuality } from "models/types/Production/HeatCCMQuality"
import { Loading } from "components/extra/Loading"


type Props = {
  isOpen: boolean
  toggle: () => void
  heatId: string
}



export const HeatCCMQualityModal: React.FC<Props> = ({
  isOpen,
  toggle,
  heatId,
}) => {

  const [processes, setProcesses] = useState<HeatCCMQuality[]>([])

  const getEvents = () => {
    pHandler.GetHeatCCMQualityAsync(heatId)
      .then(processes => setProcesses(processes))
      .catch(console.log)
  }

  return <div className="ccm-heat-quality-wrapper">
    <Modal className="ccm-heat-quality-modal" isOpen={isOpen} onOpened={getEvents} toggle={toggle} fade={false} unmountOnClose={true}>
      <ModalHeader toggle={toggle}>Отчет по качеству плавки {heatId}</ModalHeader>
      <ModalBody>
        {processes.length === 0 && <Loading />}
        {processes.length > 0 &&
          <Table hover>
            <thead>
              <tr>
                <th>№ сля ба</th>
                <th>Описание</th>
                <th>Ед. изм.</th>
                <th>Мин. предел</th>
                <th>Макс. предел</th>
                <th>Деффект</th>
                <th>Начало, мм</th>
                <th>Конец, мм</th>
                <th>Мин</th>
                <th>Сред</th>
                <th>Макс</th>
              </tr>
            </thead>
            <tbody>
              {processes.map(e =>
                <tr style={{ backgroundColor: `${+e.PROD_COUNTER % 2 === 0 ? "whitesmoke" : "white"}` }} key={`${e.LABEL}${e.PROD_COUNTER}`}>
                  <td>{e.PROD_COUNTER}</td>
                  <td>{e.LABEL}</td>
                  <td>{e.UNIT}</td>
                  <td>{e.MIN_RANGE}</td>
                  <td>{e.MAX_RANGE}</td>
                  <td>{e.DEFECT_LEVEL_DESCR}</td>
                  <td>{e.START_POSITION}</td>
                  <td>{e.END_POSITION}</td>
                  <td>{e.MIN}</td>
                  <td>{e.AVG}</td>
                  <td>{e.MAX}</td>
                </tr>
              )}
            </tbody>
          </Table>}
      </ModalBody>
    </Modal>
  </div >
}
