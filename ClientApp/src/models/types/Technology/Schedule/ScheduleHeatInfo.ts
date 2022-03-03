
export type ScheduleHeatInfo = {
  AGREGATE: string
  START_POINT: Date
  END_POINT: Date
  HEAT_ID: string
}


export const ScheduleAgregateDecoder: { [key: string]: string } = {
  AKOS: "АКОС",
  AKP21: "АКП-2 1поз",
  AKP22: "АКП-2 2поз",
  DSP: "ДСП",
  VOD1: "ВД-2 1поз",
  VOD2: "ВД-2 2поз",
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