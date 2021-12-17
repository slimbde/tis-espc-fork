import { AgregateInfo } from "./AgregateInfo";

export type CCMAgregateInfo = AgregateInfo & {
  crystFlow?: string
  crystFreq?: string
  crystFLeft?: string
  crystFRight?: string
  crystPullEffort?: string
  crystShos?: string
  crystStoik?: string
  crystTbefore?: string
  crystTdelta?: string
  crystTshears?: string
  currentTemp?: string
  cutId?: string
  heatWeight?: string
  ladleArm?: string
  ladleId?: string
  ladleShib?: string
  ladleStoik?: string
  optimalSpeed?: string
  samples?: string
  shiftCode?: string
  shiftResponsible?: string
  teamId?: string
  tundishCar?: string
  tundishId?: string
  tundishShos?: string
  tundishStoik?: string
}