import { CompressorSensor } from "models/types/Sensors/Compressor/CompressorSensor";
import { TCompressorSensorHandler } from "./TCompressorSensorHandler";
import { DryerAnalogCompressorSensors, DryerDiskrCompressorSensors, DryerOnOffCompressorSensors } from "models/types/Sensors/Compressor/DryerSensors";




export class DryerCompressorSensorHandler extends TCompressorSensorHandler {

  private wrongBoundSensors = [
    "CMP_BS_Des_EMG_STOP",
    "CMP_BS_Des_OverHeat_A",
    "CMP_BS_Des_OverHeat_B",
  ]



  protected handleAnalogSensors(sensors: CompressorSensor[]): void {

    const analogSensors = sensors.filter(s => Object.keys(DryerAnalogCompressorSensors).some(key => key === s.TagName))

    analogSensors.forEach(one => {
      const value = Math.round(+one.ValueString.replace(/[^0-9-.]/g, '') * 1000) / 1000

      const element = document.getElementById(one.TagName) as HTMLDivElement
      element && (element.textContent = `${Math.round(value * 1000) / 1000}`)
      element && (element.title = one.Description)
    })

    // handle summary A B pressure (the non-existing one)
    const element = document.getElementById("CMP_WS_Des_Pres_col_") as HTMLDivElement
    const pressureSensors = sensors.filter(s => ["CMP_WS_Des_Pres_col_A", "CMP_WS_Des_Pres_col_B"].some(key => key === s.TagName))
    const value = pressureSensors.reduce((acc, curr) => acc + +curr.ValueString.replace(/[^0-9-.]/g, ''), 0)
    const rounded = Math.round(value * 1000) / 1000
    element.textContent = rounded + ""
  }


  protected handleDiskrSensors(sensors: CompressorSensor[]): void {

    const diskrSensors = sensors.filter(s => Object.keys(DryerDiskrCompressorSensors).some(key => key === s.TagName))

    diskrSensors.forEach(one => {
      const element = document.getElementById(one.TagName) as HTMLDivElement

      if (element)
        one.ValueString[0] === "1" ? (element.style.opacity = "1") : (element.style.opacity = "0")

      if (this.wrongBoundSensors.some(w => w === one.TagName))
        one.ValueString[0] === "0" ? (element.style.opacity = "1") : (element.style.opacity = "0")

      element && (element.title = one.Description)
    })



    const onOffSensors = sensors.filter(s => Object.keys(DryerOnOffCompressorSensors).some(key => key === s.TagName))

    onOffSensors.forEach(one => {
      const element = document.getElementById(one.TagName) as HTMLDivElement

      if (this.wrongBoundSensors.some(w => w === one.TagName)) {
        one.ValueString[0] === "0" && (one.ValueString = "1")
        one.ValueString[0] === "1" && (one.ValueString = "0")
      }

      const value = one.ValueString.replace(/[^0-9-.]/g, '')

      if (element) {
        element.classList.remove("on", "off")
        if (value === "1") {
          element.classList.add("on")
          element.textContent = "ДА"
        }
        if (value === "0") {
          element.classList.add("off")
          element.textContent = "НЕТ"
        }
      }
    })
  }
}
