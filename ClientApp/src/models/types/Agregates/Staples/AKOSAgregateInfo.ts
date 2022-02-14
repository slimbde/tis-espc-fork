import { AgregateInfo } from "./AgregateInfo";

export type AKOSAgregateInfo = AgregateInfo & {
  argonDelay?: string
  argonFlowDown?: string
  argonFlowInst?: string
  argonFlowInstPwd?: string
  argonTimeDown?: string
  chemicals?: AKOSChemical[]
  chemicalKey?: string
  heatTab?: string
  samples?: string
  steamPipeVacuum?: string
  stoikSvod?: string
}


export type AKOSChemical = {
  num: string
  time: string
  elements: string
}