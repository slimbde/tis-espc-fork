import { AgregateInfo } from "./AgregateInfo";

export type DSPAgregateInfo = AgregateInfo & {
  eeHeatReactive?: string
  eeTodayActive?: string
  eeTodayReactive?: string
  eeYestActive?: string
  eeYestReactive?: string
  heatTab?: string
  ladleId?: string
  psn?: string
  stoikCaseFrmw?: string
  stoikErk?: string
  stoikFloor?: string
  stoikQ1?: string
  stoikQ2?: string
  stoikSvodFrmw?: string
  stoikSvodLg?: string
  stoikSvodSm?: string
  stoikWall?: string
  gas?: string[]
}