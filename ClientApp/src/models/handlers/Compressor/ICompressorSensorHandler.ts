import { CompressorSensor } from "models/types/Compressor/CompressorSensor";
import { MainCompressorSensorHandler } from "./CompressorSensorHandler";



export interface ICompressorSensorHandler {
  Handle(sensors: CompressorSensor[]): void
}




const mHandler = new MainCompressorSensorHandler() as ICompressorSensorHandler

export {
  mHandler,
}