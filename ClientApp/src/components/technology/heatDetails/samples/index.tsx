import "./samples.scss"
import React, { useEffect, useState } from "react"
import { samHandler } from "models/handlers/DbHandlers/IDbHandler"
import { Table } from "reactstrap"
import { Sample } from "models/types/Sample"
import { SampleModal } from "./SampleModal"
import { Loading } from "components/extra/Loading"
import { blinkAlert } from "components/extra/Alert"
import aHandler from "models/handlers/DbHandlers/AuthDbHandler"
import moment from "moment"

type Props = {
  REPORT_COUNTER: number
}

type ModalState = {
  isOpen: boolean
  currentSample: Sample | undefined,
  isAppend: boolean
}



const Samples: React.FC<Props> = ({
  REPORT_COUNTER,
}) => {

  const [userRole, setUserRole] = useState("")
  const [elements, setElements] = useState<Sample[]>([])
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    currentSample: undefined,
    isAppend: false
  })

  useEffect(() => {
    setUserRole(aHandler.GetRoleFromStash())

    samHandler.ListForAsync(REPORT_COUNTER)
      .then(elements => {
        elements.length > 0 && (modalState.currentSample = elements[0])
        setElements(elements)
      })
      .catch(console.error)
    //eslint-disable-next-line
  }, [])


  const toggleModal = () => setModalState({ ...modalState, isOpen: !modalState.isOpen })
  const createCurrent = () => setModalState({
    isOpen: true,
    currentSample: {
      LANCE_TYPE: "1",
      CARBON_VALUE: "0",
      REPORT_COUNTER: REPORT_COUNTER + "",
      SAMPLE_COUNTER: "" + (Math.max(...elements.map(el => +el.SAMPLE_COUNTER)) + 1),
      SAMPLE_DATE: elements[0].SAMPLE_DATE,
      HYDROGEN_VALUE: "0",
      OXYGEN_VALUE: "0",
      SUPERHEAT_VALUE: "0",
      TEMPERATURE_VALUE: "0"
    },
    isAppend: true
  })
  const postSample = (sample: Sample) => {
    setModalState({ ...modalState, isOpen: false })
    samHandler.PostAsync(sample)
      .then(inserted => {
        if (inserted > 0) {
          const correctedSample: Sample = {
            ...sample,
            SAMPLE_DATE: moment(sample.SAMPLE_DATE).format("DD.MM.YYYY HH:mm:ss")
          }

          blinkAlert("Замер успешно добавлен", true)
          setElements([...elements, correctedSample])
        }
      })
      .catch(error => {
        console.log(error)
        blinkAlert("Не удалось добавить замер", false)
      })
  }
  const deleteSample = (sample: Sample) => {
    if (window.confirm("Вы действительно хотите удалить замер?")) {
      samHandler.DeleteAsync(sample)
        .then(deleted => {
          if (deleted > 0) {
            blinkAlert("Замер успешно удален", true)
            setElements(elements.filter(el => !(el.REPORT_COUNTER === sample.REPORT_COUNTER && el.SAMPLE_COUNTER === sample.SAMPLE_COUNTER)))
          }
        })
        .catch(error => {
          console.log(error)
          blinkAlert("Не удалось удалить замер", false)
        })

      return () => false
    }
  }
  const openCurrent = (currentSample: Sample) => setModalState({
    isOpen: true,
    currentSample,
    isAppend: false
  })
  const putSample = (sample: Sample) => {
    setModalState({ ...modalState, isOpen: false })
    samHandler.PutAsync(sample)
      .then(updated => {
        const correctedSample: Sample = {
          ...sample,
          SAMPLE_DATE: moment(sample.SAMPLE_DATE).format("DD.MM.YYYY HH:mm:ss")
        }

        if (updated > 0) {
          blinkAlert("Замер успешно обновлен", true)
          setElements([...elements.map(el => el.SAMPLE_COUNTER === sample.SAMPLE_COUNTER && el.REPORT_COUNTER === sample.REPORT_COUNTER ? correctedSample : el)])
        }
      })
      .catch(error => {
        console.log(error)
        blinkAlert("Не удалось обновить замер", false)
      })
  }



  return <div className="samples-wrapper">
    {elements.length > 0 &&
      <>
        <Table size="sm" hover>
          <thead>
            <tr>
              <th>№ замера</th>
              <th>Время замера</th>
              <th>Температура [°C]</th>
              <th>Перегрев [°C]</th>
              <th>Окисленность [%]</th>
              <th>Содержание водорода [ppm]</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {elements.map(e =>
              <tr key={e.SAMPLE_COUNTER}>
                <td>{e.SAMPLE_COUNTER}</td>
                <td className="a-like" onClick={() => ["Администратор"].some(one => one === userRole) && openCurrent(e)} title="Ну же, нажмите чтобы изменить">{e.SAMPLE_DATE}</td>
                <td>{e.TEMPERATURE_VALUE}</td>
                <td>{e.SUPERHEAT_VALUE}</td>
                <td>{e.OXYGEN_VALUE}</td>
                <td>{e.HYDROGEN_VALUE}</td>
                <td onClick={e => e.preventDefault()}>
                  {["Администратор"].some(one => one === userRole) && <span className="a-like" onClick={() => deleteSample(e)}>Удалить</span>}
                </td>
              </tr>
            )}
            {["Администратор"].some(one => one === userRole) && <tr key="sdf"><td colSpan={6}><span className="a-like" onClick={createCurrent} title="Добавить замер">[+]</span></td></tr>}
          </tbody>
        </Table>
        <SampleModal {...{
          isOpen: modalState.isOpen,
          toggle: toggleModal,
          sample: modalState.currentSample!,
          isAppend: modalState.isAppend,
          postSample,
          putSample,
        }} />
      </>
    }
    {elements.length === 0 && <Loading />}
  </div >
}

export default Samples
