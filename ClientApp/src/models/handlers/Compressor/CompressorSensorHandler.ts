import { CompressorSensor } from "models/types/Compressor/CompressorSensor";
import { MainAnalogCompressorSensors, MainDiskrCompressorSensors } from "models/types/Compressor/MainSensors";
import { ICompressorSensorHandler } from "./ICompressorSensorHandler";



export class MainCompressorSensorHandler implements ICompressorSensorHandler {

  private wrongBoundSensors = [
    "CMP_BS_Potok_kompr_1",
    "CMP_BS_Potok_kompr_2",
    "CMP_BS_Potok_kompr_3",
    "CMP_BS_Des_EMG_STOP",
    "CMP_BS_C1_EMG_STOP",
    "CMP_BS_C2_EMG_STOP",
    "CMP_BS_C3_EMG_STOP",
  ]



  Handle(sensors: CompressorSensor[]): void {
    const analogSensors = sensors.filter(s => Object.keys(MainAnalogCompressorSensors).some(key => key === s.TagName))
    const diskrSensors = sensors.filter(s => Object.keys(MainDiskrCompressorSensors).some(key => key === s.TagName))

    this.handleAnalogSensors(analogSensors)
    this.handleDiskrSensors(diskrSensors)
  }


  private handleAnalogSensors(sensors: CompressorSensor[]): void {
    sensors.forEach(one => {
      const element = document.getElementById(one.TagName) as HTMLDivElement
      element && (element.textContent = `${Math.round(+one.ValueString * 100) / 100}`)
      element && (element.title = one.Description)
    })
  }

  private handleDiskrSensors(sensors: CompressorSensor[]): void {
    sensors.forEach(one => {
      const element = document.getElementById(one.TagName) as HTMLDivElement

      if (element) {
        one.ValueString[0] === "1" ? (element.style.opacity = "1") : (element.style.opacity = "0")

        if (this.wrongBoundSensors.some(w => w === one.TagName))
          one.ValueString[0] === "0" ? (element.style.opacity = "1") : (element.style.opacity = "0")
      }

      element && (element.title = one.Description)
    })
  }
}
