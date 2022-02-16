
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


export const akosState = (energy: boolean | undefined, argon: boolean | undefined, heatCurrentTime: string | undefined, argonTime: string | undefined) => {
  if (energy || argon) return AgregateState.PROCESS
  if (heatCurrentTime !== "00:00:00") return AgregateState.HOTIDLE
  if (argonTime !== "00:00:00") return AgregateState.HOTIDLE
  return AgregateState.IDLE
}


export const dspState = (energy: boolean | undefined, eeHeatActive: string | undefined) => {
  if (energy) return AgregateState.PROCESS
  if (eeHeatActive) return AgregateState.HOTIDLE
  return AgregateState.IDLE
}


export const vdState = (energy: boolean | undefined, vacuum: boolean | undefined, empty: boolean | undefined) => {
  if (energy || vacuum) return AgregateState.PROCESS
  if ((energy || vacuum) && !empty) return AgregateState.HOTIDLE
  return AgregateState.IDLE
}
