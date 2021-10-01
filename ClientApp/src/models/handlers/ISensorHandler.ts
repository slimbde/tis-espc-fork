import { CompressorSensor } from "models/types/Sensors/Compressor/CompressorSensor"
import { DryerRuntimeSensor } from "models/types/Sensors/Dryers/DryerRuntimeSensor"
import { AirCompressorSensorHandler } from "./CompressorSensorHandlers/AirCompressorSensorHandler"
import { DetailsCompressorSensorHandler } from "./CompressorSensorHandlers/DetailsCompressorSensorHandler"
import { DryerCompressorSensorHandler } from "./CompressorSensorHandlers/DryerCompressorSensorHandler"
import { KipCompressorSensorHandler } from "./CompressorSensorHandlers/KipCompressorSensorHandler"
import { MainCompressorSensorHandler } from "./CompressorSensorHandlers/MainCompressorSensorHandler"
import { DryerSummarySensorHandler } from "./DryerSensorHandlers/DryerSummarySensorHandler"



export interface ISensorHandler<T> {
  Initialize(params: any): void       // allows set up handler
  Handle(sensors: T[]): void          // staple method
}


const mHandler = new MainCompressorSensorHandler() as ISensorHandler<CompressorSensor>
const kHandler = new KipCompressorSensorHandler() as ISensorHandler<CompressorSensor>
const aHandler = new AirCompressorSensorHandler() as ISensorHandler<CompressorSensor>
const dHandler = new DetailsCompressorSensorHandler() as ISensorHandler<CompressorSensor>
const dryHandler = new DryerCompressorSensorHandler() as ISensorHandler<CompressorSensor>

const drHandler = new DryerSummarySensorHandler() as ISensorHandler<DryerRuntimeSensor>

export {
  mHandler,
  kHandler,
  aHandler,
  dHandler,
  dryHandler,

  drHandler,
}