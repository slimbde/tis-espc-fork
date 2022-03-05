import { AreaId } from "../../Technology/Production/AreaId"

export type EventPrioritySet = {
  prioBtn: string         // Кнопки на пультах
  prioHmiSets: string     // Уставки HMI
  prioHmiCmds: string     // Команды HMI
  prioAirpump?: string    // Компрессорная
}

const CCMPrioritySet: EventPrioritySet = {
  prioBtn: "770",
  prioHmiCmds: "772",
  prioHmiSets: "770",
  prioAirpump: "774"
}

const LFPrioritySet: EventPrioritySet = {
  prioBtn: "750",
  prioHmiCmds: "752",
  prioHmiSets: "750",
}

const VODPrioritySet: EventPrioritySet = {
  prioBtn: "760",
  prioHmiCmds: "762",
  prioHmiSets: "760",
}


export const EventPriorityProvider = (areaId: AreaId) => {
  switch (areaId) {
    case AreaId.CCM2_DIAG: return CCMPrioritySet
    case AreaId.LF_DIAG: return LFPrioritySet
    case AreaId.VOD_DIAG: return VODPrioritySet
  }
}
