import { CompressorSensor } from "models/types/Sensors/Compressor/CompressorSensor";
import { ISensorHandler } from "../ISensorHandler";


export abstract class TCompressorSensorHandler implements ISensorHandler<CompressorSensor> {
  Handle(sensors: CompressorSensor[]): void {
    this.handleAnalogSensors(sensors)
    this.handleDiskrSensors(sensors)
  }

  protected abstract handleAnalogSensors(sensors: CompressorSensor[]): void
  protected abstract handleDiskrSensors(sensors: CompressorSensor[]): void
}