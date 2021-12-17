
export type AgregateInfo = {
  className?: string
  name?: string
  castingSpeed?: string
  flowSpeed?: string
  heatId?: string
  heatStart?: string
  heatTime?: string
  series?: string
  steelGrade?: string

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
  refining?: boolean

  dataDelayed?: boolean
  lastUpdate?: string
}
