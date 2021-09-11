import "./heatEventModal.scss"
import { AreaId } from "models/types/AreaId"
import React, { useState } from "react"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import pHandler from "models/handlers/DbHandlers/ProductionHandler"
import { HeatEvent } from "models/types/Production/HeatEvent"


type Props = {
  isOpen: boolean
  toggle: () => void
  heatId: string
  areaId: AreaId
}



export const HeatEventModal: React.FC<Props> = ({
  isOpen,
  toggle,
  heatId,
  areaId
}) => {

  const [events, setEvents] = useState<HeatEvent[]>([])

  const getEvents = () => {
    pHandler.GetHeatEventsAsync(heatId, areaId)
      .then(events => setEvents(events))
      .catch(console.log)
  }

  return <div className="heat-event-wrapper">
    <Modal isOpen={isOpen} onOpened={getEvents} toggle={toggle} fade={false} unmountOnClose={true}>
      <ModalHeader toggle={toggle}>События плавки {heatId}</ModalHeader>
      <ModalBody>
        {events &&
          <Table hover>
            <tbody>
              {events.map(e =>
                <tr key={`${e.TIME_POINT}${e.TEXT}`}>
                  <td>{e.TIME_POINT}</td>
                  <td>{e.TEXT}</td>
                </tr>
              )}
            </tbody>
          </Table>}
      </ModalBody>
    </Modal>
  </div>
}