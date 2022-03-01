import { AreaId } from "../../Technology/Production/AreaId"

export type FilterOperation = {
  buttons: "buttons"
  hmi_sets: "hmi_sets"
  hmi_cmds: "hmi_cmds"
  airpump_msg: "airpump_msg"
}


export type OperatorFilter = {
  from: string
  to: string
  operation: keyof FilterOperation
  comment: string
  eventPriority?: string
  areaId?: keyof AreaId
}