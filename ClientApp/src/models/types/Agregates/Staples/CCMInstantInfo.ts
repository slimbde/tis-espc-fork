import { AgregateSummary } from "./AgregateSummary"

export type CCMInstantHeatInfo = {
  HeatId: string
  SteelGradeId: string
  ShiftResponsible: string
  ShiftCode: string
  TeamId: string
  PwdType: string
  MouldLife: string
  TundishCarOnCast: string
  LadleArmOnCast: string
  AimLen: string
}

export enum CCMInstantHeatDecoder {
  HeatId = "Плавка",
  SteelGradeId = "Марка",
  ShiftResponsible = "Мастер",
  ShiftCode = "Смена",
  TeamId = "Бригада",
  PwdType = "ШОС П/К",
  MouldLife = "С/К (N стойк)",
  TundishCarOnCast = "Тележка П/К",
  LadleArmOnCast = "П/К (N стойк)",
  AimLen = "Раскрой",
}


export type CCMInstantCrystInfo = {
  Width: string
  Thickness: string
  MouldLife: string
  Frequency: string
  Lvl: string
  TotalFlow: string
  LeftFlow: string
  RightFlow: string
  DeltaT: string
}

export enum CCMInstantCrystDecoder {
  Width = "Ширина",
  Thickness = "Высота",
  MouldLife = "Стойкость",
  Frequency = "Частота качания, мин`¹",
  Lvl = "Уровень, мм",
  TotalFlow = "Расход воды, м³/ч",
  LeftFlow = "Расход воды слева, м³/ч",
  RightFlow = "Расход воды справа, м³/ч",
  DeltaT = "Перепад t, ℃",
}

export type CCMInstantPhysInfo = {
  CastingSpeed: string
  SteelFlow: string
  LadleTimeToEnd: string
  TundishTimeToEnd: string
  ProductWeight: string
  LadleTareWeight: string
  LadleWeight: string
  TundishTareWeight: string
  TundishWeight: string
}

export enum CCMInstantPhysDecoder {
  CastingSpeed = "Скорость разливки",
  SteelFlow = "Поток стали, кг/мин",
  LadleTimeToEnd = "Время до конца с/к, мин",
  TundishTimeToEnd = "Время до конца п/к, мин",
  ProductWeight = "Вес продукта",
  LadleTareWeight = "Тара стальковша",
  LadleWeight = "Масса стальковша",
  TundishTareWeight = "Тара промковша",
  TundishWeight = "Масса промковша",
}

export type CCMInstantInfo = {
  heat: CCMInstantHeatInfo
  cryst: CCMInstantCrystInfo
  phys: CCMInstantPhysInfo
  samples: string[]
  mysql: AgregateSummary[]
  events: string[]
}
