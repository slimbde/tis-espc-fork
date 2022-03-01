
export type ScheduleHeatInfo = {
  AGREGATE: string
  START_POINT: Date
  END_POINT: Date
  HEAT_ID: string
}


export const ScheduleAgregateDecoder: { [key: string]: string } = {
  AKOC: "АКОС",
  AKOC2: "АКП-2",
  DSP: "ДСП",
  VOD: "ВД-2",
  CCM1: "МНЛЗ-1",
  CCM2: "МНЛЗ-2",
}