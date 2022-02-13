
export type AgregateInfo = {
  name?: string
  argonFlow?: string
  argonPressure?: string
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
