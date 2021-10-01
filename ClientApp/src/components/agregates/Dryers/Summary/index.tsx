import "./summary.scss"
import { useEffect } from "react"
import { useRouteMatch } from "react-router-dom"
import { AgregateAreaId } from "models/types/Agregates/Dryers/AgregateAreaId"
import { drHandler } from "models/handlers/ISensorHandler"
import { blinkAlert } from "components/extra/Alert"
import { SummaryCard } from "./SummaryCard"
import agrHandler from "models/handlers/DbHandlers/AgregatesDbHandler"


export const DryerSummary: React.FC = () => {
  const match = useRouteMatch<{ ID: string }>()
  const id = match.params.ID

  const getAreaId = (id: string) => {
    switch (id) {
      case "1": return AgregateAreaId.DryerRuntime1
      case "2": return AgregateAreaId.DryerRuntime2
      case "3": return AgregateAreaId.HeaterRuntime1
      case "4": return AgregateAreaId.HeaterRuntime2
    }
    return AgregateAreaId.DryerRuntime1
  }

  useEffect(() => {
    const update = () => {
      agrHandler.ReadDryerRuntimeAsync(getAreaId(id))
        .then(data => drHandler.Handle(data))
        .catch(error => {
          console.log(error)
          blinkAlert((error as string), false)
        })
    }

    const interval = setInterval(update, 10000)
    update()

    return () => clearInterval(interval)
  }, [id])


  return <div className="dryer-summary-wrapper">
    <SummaryCard
      title="Статус"
      tags={[
        "Actual_Mode",
        "Arm_Position",
      ]} />

    <SummaryCard
      title="Газовый клапан"
      tags={[
        "MODE_CTR.REF_VALVE_POS",
        "MODE_CTR.VALVE_POS",
        "Gas_Cut_Valve",
      ]} />

    <SummaryCard
      title="Природный газ"
      tags={[
        "MODE_CTR.GAS_Q",
        "MODE_CTR.GAS_TEMPER",
        "MODE_CTR.GAS_PRESS_1",
        "MODE_CTR.GAS_PRESS_2",
      ]} />


    <SummaryCard
      title="Воздух"
      tags={[
        "MODE_CTR.AIR_Q",
        "MODE_CTR.AIR_TEMPER",
        "MODE_CTR.AIR_PRESS",
        "MODE_CTR.ATM_PRESS",
      ]} />

    <SummaryCard
      title="Дымоход"
      tags={[
        "MODE_CTR.TEMPER_COMB_GAS",
        "MODE_CTR.TEMPER_EXG",
        "MODE_CTR.RAZREGENIE",
      ]} />

    <SummaryCard
      title="Футеровка"
      tags={[
        "MODE_CTR.ACT_TEMPER",
      ]} />
  </div>
}