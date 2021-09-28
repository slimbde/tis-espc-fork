import { CompressorSensor } from "models/types/Sensors/Compressor/CompressorSensor"
import { AirCompressorSensorHandler } from "./Compressor/AirCompressorSensorHandler"
import { DetailsCompressorSensorHandler } from "./Compressor/DetailsCompressorSensorHandler"
import { DryerCompressorSensorHandler } from "./Compressor/DryerCompressorSensorHandler"
import { KipCompressorSensorHandler } from "./Compressor/KipCompressorSensorHandler"
import { MainCompressorSensorHandler } from "./Compressor/MainCompressorSensorHandler"


export interface ISensorHandler<T> {
  Initialize(params: any): void       // allows set up handler
  Handle(sensors: T[]): void          // staple method
}


const mHandler = new MainCompressorSensorHandler() as ISensorHandler<CompressorSensor>
const kHandler = new KipCompressorSensorHandler() as ISensorHandler<CompressorSensor>
const aHandler = new AirCompressorSensorHandler() as ISensorHandler<CompressorSensor>
const dHandler = new DetailsCompressorSensorHandler() as ISensorHandler<CompressorSensor>
const dryHandler = new DryerCompressorSensorHandler() as ISensorHandler<CompressorSensor>

export {
  mHandler,
  kHandler,
  aHandler,
  dHandler,
  dryHandler,
}