
export enum AreaId {
  CCM1_DIAG = 1,
  AKOS_DIAG = 73,
  DSP_DIAG = 80,
  LF_DIAG = 600,
  VOD_DIAG = 800,
  CCM2_DIAG = 1100,
}


export const getAreaName = (AREA_ID: AreaId) => {
  switch (AREA_ID) {
    case 600: return "АКП-2"
    case 800: return "ВОД-2"
    case 1: return "МНЛЗ-1"
    case 1100: return "МНЛЗ-2"
    case 80: return "ДСП"
    case 73: return "АКОС"
  }
}