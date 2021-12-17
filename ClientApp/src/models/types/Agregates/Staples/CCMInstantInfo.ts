import { AgregateSummary } from "./AgregateSummary"

export type CCMInstantHeatInfo = {
  HeatId?: string
  SteelGradeId?: string
  ShiftResponsible?: string
  ShiftCode?: string
  TeamId?: string
  CrystShos?: string
  TundishShos?: string
  LadleId?: string
  LadleArm?: string
  LadleShib?: string
  TundishCar?: string
  TundishId?: string
  CutId?: string
}

export enum CCMInstantHeatDecoder {
  HeatId = "Плавка",
  SteelGradeId = "Марка",
  ShiftResponsible = "Мастер",
  ShiftCode = "Смена",
  TeamId = "Бригада",
  CrystShos = "ШОС крист",
  TundishShos = "ШОС П/К",
  LadleArm = "Стенд С/К",
  LadleId = "C/К (N стойк)",
  LadleShib = "Шибер",
  TundishCar = "Тележка П/К",
  TundishId = "П/К (N стойк)",
  CutId = "Раскрой",
}


export type CCMInstantCrystInfo = {
  SlabThickness?: string
  SlabWidth?: string
  CrystStoik?: string
  CrystFreq?: string
  CrystPullEffort?: string
  CrystTshears?: string
  Lvl?: string
  CrystFlow?: string
  CrystFLeft?: string
  CrystFRight?: string
  CrystTdelta?: string
  CrystTbefore?: string
}

export enum CCMInstantCrystDecoder {
  SlabThickness = "Высота",
  SlabWidth = "Ширина",
  CrystStoik = "Стойкость",
  CrystFreq = "Частота качания, мин`¹",
  CrystPullEffort = "Усилие вытягивания, т",
  CrystTshears = "Температура перед ножницами, ℃",
  Lvl = "Уровень, мм",
  CrystFlow = "Расход воды, м³/ч",
  CrystFLeft = "Расход воды слева, м³/ч",
  CrystFRight = "Расход воды справа, м³/ч",
  CrystTdelta = "Перепад t, ℃",
  CrystTbefore = "Температура вх. воды, ℃",
}

export type CCMInstantPhysInfo = {
  CastedMeters?: string
  CastingSpeed?: string
  OptimalSpeed?: string
  FlowSpeed?: string
  LadleTimeToEnd?: string
  TundishTimeToEnd?: string
  HeatWeight?: string
  LadleTareWeight?: string
  LadleWeight?: string
  TundishTareWeight?: string
  TundishWeight?: string
}

export enum CCMInstantPhysDecoder {
  CastedMeters = "Длина плавки",
  CastingSpeed = "Скорость разливки",
  OptimalSpeed = "Оптимальная скорость",
  FlowSpeed = "Поток стали, кг/мин",
  LadleTimeToEnd = "Время до конца с/к, мин",
  TundishTimeToEnd = "Время до конца п/к, мин",
  HeatWeight = "Вес продукта, т",
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
