import { CompressorSensor } from "models/types/Sensors/Compressor/CompressorSensor";
import { Compressor1AnalogCompressorSensors, Compressor1DiskrCompressorSensors, Compressor1OnOffCompressorSensors } from "models/types/Sensors/Compressor/Compressor1";
import { TCompressorSensorHandler } from "./TCompressorSensorHandler";
import { Compressor2AnalogCompressorSensors, Compressor2DiskrCompressorSensors, Compressor2OnOffCompressorSensors } from "models/types/Sensors/Compressor/Compressor2";
import { Compressor3AnalogCompressorSensors, Compressor3DiskrCompressorSensors, Compressor3OnOffCompressorSensors } from "models/types/Sensors/Compressor/Compressor3";




export class DetailsCompressorSensorHandler extends TCompressorSensorHandler {
  private cNmumber = ""
  private wrongBoundSensors = [
    "CMP_BS_C1_EMG_STOP",
    "CMP_BS_C2_EMG_STOP",
    "CMP_BS_C3_EMG_STOP",
    "CMP_BS_C1_Overload_motor",
    "CMP_BS_C2_Overload_motor",
    "CMP_BS_C3_Overload_motor",
  ]


  Initialize(compressorNumber: string): void {
    this.cNmumber = compressorNumber;
  }


  protected handleAnalogSensors(sensors: CompressorSensor[]): void {
    const enumToCollate = this.cNmumber === "1"
      ? Compressor1AnalogCompressorSensors
      : this.cNmumber === "2"
        ? Compressor2AnalogCompressorSensors
        : Compressor3AnalogCompressorSensors

    const analogSensors = sensors.filter(s => Object.keys(enumToCollate).some(key => key === s.TagName))

    analogSensors.forEach(one => {
      const value = +one.ValueString.replace(/[^0-9-.]/g, '')
      const element = document.getElementById(one.TagName) as HTMLDivElement
      element && (element.textContent = `${Math.round(value * 1000) / 1000}`)
      element && (element.title = one.Description)
    })
  }


  protected handleDiskrSensors(sensors: CompressorSensor[]): void {
    const enumToCollate = this.cNmumber === "1"
      ? Compressor1DiskrCompressorSensors
      : this.cNmumber === "2"
        ? Compressor2DiskrCompressorSensors
        : Compressor3DiskrCompressorSensors

    const diskrSensors = sensors.filter(s => Object.keys(enumToCollate).some(key => key === s.TagName))

    diskrSensors.forEach(one => {
      const element = document.getElementById(one.TagName) as HTMLDivElement

      if (element)
        one.ValueString[0] === "1" ? (element.style.opacity = "1") : (element.style.opacity = "0")

      if (this.wrongBoundSensors.some(w => w === one.TagName))
        one.ValueString[0] === "0" ? (element.style.opacity = "1") : (element.style.opacity = "0")

      element && (element.title = one.Description)
    })

    const onoffEnumToCollate = this.cNmumber === "1"
      ? Compressor1OnOffCompressorSensors
      : this.cNmumber === "2"
        ? Compressor2OnOffCompressorSensors
        : Compressor3OnOffCompressorSensors


    const onOffSensors = sensors.filter(s => Object.keys(onoffEnumToCollate).some(key => key === s.TagName))

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
