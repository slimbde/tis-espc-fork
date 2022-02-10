
export type AgregateInfo = {
  name?: string
  castingSpeed?: string
  flowSpeed?: string
  heatId?: string
  heatStart?: string
  heatTime?: string
  heatWeight?: string
  series?: string
  steelGrade?: string
  ladleId?: string
  argonFlow?: string
  argonPressure?: string
  currentTemp?: string

  heatCurrentTime?: string
  eeHeatActive?: string
  flushSteel?: boolean
  flushSlag?: boolean

  castedMeters?: string
  castedTonns?: string
  slabThickness?: string
  slabWidth?: string
  streamCast?: boolean
  tgs?: string

  argon?: boolean
  capdown?: boolean
  empty?: boolean
  energy?: boolean
  vacuum?: boolean

  dataDelayed?: boolean
  lastUpdate?: string
}
