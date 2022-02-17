
export enum AgregateState {
  IDLE = "state-idle",
  PROCESS = "state-process",
  HOTIDLE = "state-hot-idle",
  PRESET = "state-preset",
}



export const ccmState = (streamCast?: boolean, castingSpeed?: string) => {
  if (!streamCast) return AgregateState.IDLE
  if (castingSpeed && castingSpeed !== "0") return AgregateState.PROCESS
  return AgregateState.PRESET
}



export const vdState = (energy: boolean | undefined, vacuum: boolean | undefined, empty: boolean | undefined) => {
  if (energy || vacuum) return AgregateState.PROCESS
  if ((energy || vacuum) && !empty) return AgregateState.HOTIDLE
  return AgregateState.IDLE
}
