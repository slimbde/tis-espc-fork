import { CompressorSensor } from "models/types/Sensors/Compressor/CompressorSensor";
import { AirAnalogCompressorSensors } from "models/types/Sensors/Compressor/AirSensors";
import { TCompressorSensorHandler } from "./TCompressorSensorHandler";




export class AirCompressorSensorHandler extends TCompressorSensorHandler {


  protected handleAnalogSensors(sensors: CompressorSensor[]): void {
    const analogSensors = sensors.filter(s => Object.keys(AirAnalogCompressorSensors).some(key => key === s.TagName))

    analogSensors.forEach(one => {
      const value = +one.ValueString.replace(/[^0-9-.]/g, '')
      const element = document.getElementById(one.TagName) as HTMLDivElement
      element && (element.textContent = `${Math.round(value * 100) / 100}`)
      element && (element.title = one.Description)
    })
  }


  protected handleDiskrSensors(sensors: CompressorSensor[]): void { }
}
