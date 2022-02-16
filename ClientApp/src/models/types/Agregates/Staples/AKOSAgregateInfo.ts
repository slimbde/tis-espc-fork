import { AgregateInfo } from "./AgregateInfo";
import { Chemical } from "./Chemical";

export type AKOSAgregateInfo = AgregateInfo & {
  argonDelay?: string
  argonFlowDown?: string
  argonFlowInst?: string
  argonFlowInstPwd?: string
  argonTimeDown?: string
  chemicals?: Chemical[]
  chemicalKey?: string
  heatTab?: string
  samples?: string
  steamPipeVacuum?: string
  stoikSvod?: string
}
