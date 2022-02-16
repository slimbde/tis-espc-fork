import { AgregateState } from "./AgregateState";

export type AgregateInfo = {
  name?: string
  argonFlow?: string
  argonPressure?: string
  argonTime?: string
  castedMeters?: string
  castedTonns?: string
  castingSpeed?: string
  currentTemp?: string
  eeHeatActive?: string
  flowSpeed?: string
  heatId?: string
  heatStart?: string
  heatTime?: string
  heatWeight?: string
  heatCurrentTime?: string
  ladleId?: string
  series?: string
  slabThickness?: string
  slabWidth?: string
  steelGrade?: string
  tgs?: string
  state?: AgregateState

  argon?: boolean
  capdown?: boolean
  empty?: boolean
  energy?: boolean
  flushSlag?: boolean
  flushSteel?: boolean
  streamCast?: boolean
  vacuum?: boolean

  dataDelayed?: boolean
  lastUpdate?: string
}
