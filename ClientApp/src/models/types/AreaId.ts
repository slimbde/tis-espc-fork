
export enum AreaId {
  CCM_DIAG = 1100,
  LF_DIAG = 600,
  VOD_DIAG = 800,
}


export const getAreaName = (AREA_ID: AreaId) => {
  switch (AREA_ID) {
    case 600: return "АКП-2"
    case 800: return "ВКД"
    case 1100: return "МНЛЗ-2"
  }
}