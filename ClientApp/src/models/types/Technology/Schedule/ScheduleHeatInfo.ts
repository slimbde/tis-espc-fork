
export type ScheduleHeatInfo = {
  AGREGATE: string
  START_POINT: Date
  MIDDLE_POINT: any
  END_POINT: Date
  HEAT_ID: string
  STEEL_GRADE: string
}


export const ScheduleAgregateDecoder: { [key: string]: string } = {
  AKOS: "АКОС",
  AKP21: "АКП 1поз",
  AKP22: "АКП 2поз",
  DSP: "ДСП",
  VOD1: "ВД 1поз",
  VOD2: "ВД 2поз",
  MNLS1: "МНЛЗ-1",
  MNLS2: "МНЛЗ-2",
}


export const ScheduleColorDecoder: { [key: string]: string } = {
  AKOS: "#ffc107",
  AKP21: "#ffe0b2",
  AKP22: "#ffe0b2",
  DSP: "#f44336",
  VOD1: "#4caf50",
  VOD2: "#4caf50",
  MNLS1: "#64b5f6",
  MNLS2: "lightblue",
}


export const ScheduleTitleAgregateDecoder: { [key: string]: string } = {
  AKOS: "Проба",
  AKP21: "Проба",
  AKP22: "Проба",
  DSP: "Ввод ЭЭ",
  VOD1: "Проба",
  VOD2: "Проба",
  MNLS1: "Годное",
  MNLS2: "Годное",
}