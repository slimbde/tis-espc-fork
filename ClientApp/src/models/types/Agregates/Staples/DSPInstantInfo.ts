
export type DSPInstantHeatInfo = {
  HeatId?: string
  HeatTab?: string
  LadleId?: string
  SteelGrade?: string
  PSN?: string
  HeatCurrentTime?: string
  HeatTime?: string
  StoikSvodLg?: string
  StoikSvodSm?: string
  StoikWall?: string
  StoikFloor?: string
  StoikQ1?: string
  StoikQ2?: string
  StoikErk?: string
  StoikCaseFrmw?: string
  StoikSvodFrmw?: string
}

export enum DSPInstantHeatDecoder {
  HeatId = "Номер плавки",
  HeatTab = "Табельный номер",
  LadleId = "Номер стальковша",
  SteelGrade = "Марка стали",
  PSN = "Номер ступени ПСН",
  HeatCurrentTime = "Время под током",
  HeatTime = "Продолжительность плавки",
  StoikSvodLg = "Стойкость большого свода",
  StoikSvodSm = "Стойкость малого свода",
  StoikWall = "Стойкость стен",
  StoikFloor = "Стойкость подины",
  StoikQ1 = "Стойкость Q1",
  StoikQ2 = "Стойкость Q2",
  StoikErk = "Стойкость эркера",
  StoikCaseFrmw = "Стойкость каркасa кoжуxa",
  StoikSvodFrmw = "Стойкость каркасa свода",
}



export type DSPInstantEnergyInfo = {
  eeHeatActive?: string
  eeHeatReactive?: string
  eeTodayActive?: string
  eeTodayReactive?: string
  eeYestActive?: string
  eeYestReactive?: string
}

export enum DSPInstantEnergyDecoder {
  eeHeatActive = "На плавку активная",
  eeHeatReactive = "На плавку реактивная",
  eeTodayActive = "С начала суток активная",
  eeTodayReactive = "С начала суток реактивная",
  eeYestActive = "За вчера активная",
  eeYestReactive = "За вчера реактивная",
}
