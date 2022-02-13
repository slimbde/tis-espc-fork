
export type AKOSInstantHeatInfo = {
  HeatId?: string
  HeatTab?: string
  LadleId?: string
  SteelGrade?: string
  HeatWeight?: string
  StoikSvod?: string
  CurrentTemp?: string
}

export enum AKOSInstantHeatDecoder {
  HeatId = "Номер плавки",
  HeatTab = "Табельный номер",
  LadleId = "Номер стальковша",
  SteelGrade = "Марка",
  HeatWeight = "Масса плавки, т",
  StoikSvod = "Стойкость свода",
  CurrentTemp = "Текущая температура, ℃"
}


export type AKOSInstantEnergoInfo = {
  HeatCurrentTime?: string
  ArgonTime?: string
  ArgonTimeDown?: string
  ArgonDelay?: string
  eeHeatActive?: string
  ArgonFlow?: string
  ArgonFlowDown?: string
  ArgonPressure?: string
  ArgonFlowInst?: string
  ArgonFlowInstPwd?: string
  SteamPipeVacuum?: string
}

export enum AKOSInstantEnergoDecoder {
  HeatCurrentTime = "Время под током",
  ArgonTime = "Время продувки",
  ArgonTimeDown = "Время продувки снизу",
  ArgonDelay = "Время выдержки",
  eeHeatActive = "Расход ЭЭ КВт*час",
  ArgonFlow = "Расход Ar на продувку, м³",
  ArgonFlowDown = "Расход Ar снизу, м³",
  ArgonPressure = "Давление Ar снизу, атм",
  ArgonFlowInst = "Мгн. расход Ar сверху, м³/ч",
  ArgonFlowInstPwd = "Мгн. расход Ar снизу, м³/ч",
  SteamPipeVacuum = "Разрежение, Па",
}
