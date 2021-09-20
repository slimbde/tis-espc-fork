import { CompressorSensor } from "models/types/Sensors/Compressor/CompressorSensor";
import { KipAnalogCompressorSensors, KipDiskrCompressorSensors, KipOnOffCompressorSensors } from "models/types/Sensors/Compressor/KipSensors";
import { TCompressorSensorHandler } from "./TCompressorSensorHandler";




export class KipCompressorSensorHandler extends TCompressorSensorHandler {


  protected handleAnalogSensors(sensors: CompressorSensor[]): void {
    const analogSensors = sensors.filter(s => Object.keys(KipAnalogCompressorSensors).some(key => key === s.TagName))

    analogSensors.forEach(one => {
      const value = +one.ValueString.replace(/[^0-9-.]/g, '')
      const element = document.getElementById(one.TagName) as HTMLDivElement
      element && element.tagName === "COM_WS_CMP_PLC_WDOG"
        ? element.textContent = `${value}`
        : (element.textContent = `${Math.round(value * 1000) / 1000}`)
      element && (element.title = one.Description)
    })
  }


  protected handleDiskrSensors(sensors: CompressorSensor[]): void {
    const diskrSensors = sensors.filter(s => Object.keys(KipDiskrCompressorSensors).some(key => key === s.TagName))

    diskrSensors.forEach(one => {
      const element = document.getElementById(one.TagName) as HTMLDivElement

      if (element)
        one.ValueString[0] === "1" ? (element.style.opacity = "1") : (element.style.opacity = "0")

      element && (element.title = one.Description)
    })


    const onOffSensors = sensors.filter(s => Object.keys(KipOnOffCompressorSensors).some(key => key === s.TagName))

    onOffSensors.forEach(one => {
      const element = document.getElementById(one.TagName) as HTMLDivElement
      const value = one.ValueString.replace(/[^0-9-.]/g, '')

      if (element) {
        element.classList.remove("on", "off")
        if (value === "1") {
          element.classList.add("on")
          element.textContent = "ВКЛ"
        }
        if (value === "0") {
          element.classList.add("off")
          element.textContent = "ВЫКЛ"
        }
      }
    })
  }
}
