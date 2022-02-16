import { AgregateSummary } from "./AgregateSummary"
import { Chemical } from "./Chemical"


export type AKPInstantHeatInfo = {
  HeatId?: string
  LadleId?: string
  SteelGrade?: string
  HeatWeight?: string
  WireA1?: string
  MetalBatch?: string
}

export enum AKPInstantHeatDecoder {
  HeatId = "Номер плавки",
  LadleId = "Номер стальковша",
  SteelGrade = "Марка",
  HeatWeight = "Масса плавки, т",
  WireA1 = "Расход А1 проволоки, кг",
  MetalBatch = "Расход мет. шихты, кг"
}


export type AKPInstantEnergoInfo = {
  HeatCurrentTime?: string
  ArgonTime1?: string
  ArgonTime2?: string
  HeatTime?: string
  EeHeatActive?: string
  ArgonFlow?: string
  ArgonFlowInst1?: string
  ArgonFlowInst2?: string
}

export enum AKPInstantEnergoDecoder {
  HeatCurrentTime = "Время под током",
  ArgonTime1 = "Время продувки L1",
  ArgonTime2 = "Время продувки L2",
  HeatTime = "Время плавки",
  EeHeatActive = "Расход ЭЭ КВт*час",
  ArgonFlow = "Расход Ar на продувку, м³",
  ArgonFlowInst1 = "Мгн. расход Ar L1, м³",
  ArgonFlowInst2 = "Мгн. расход Ar L2, м³",
}


export type AKPInstantInfo = {
  heat: AKPInstantHeatInfo
  energo: AKPInstantEnergoInfo
  chems: Chemical[]
  chemKeys: string[]
  samples: string
  mysql: AgregateSummary[]
  events: string[]
}
