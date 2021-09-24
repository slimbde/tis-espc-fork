import { CompressorSensor } from "models/types/Sensors/Compressor/CompressorSensor"
import { AirCompressorSensorHandler } from "./Compressor/AirCompressorSensorHandler"
import { KipCompressorSensorHandler } from "./Compressor/KipCompressorSensorHandler"
import { MainCompressorSensorHandler } from "./Compressor/MainCompressorSensorHandler"

export interface ISensorHandler<T> {
  Handle(sensors: T[]): void
}


const mHandler = new MainCompressorSensorHandler() as ISensorHandler<CompressorSensor>
const kHandler = new KipCompressorSensorHandler() as ISensorHandler<CompressorSensor>
const aHandler = new AirCompressorSensorHandler() as ISensorHandler<CompressorSensor>

export {
  mHandler,
  kHandler,
  aHandler,
}