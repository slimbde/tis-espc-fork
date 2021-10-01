import backendHost from "./backendHost"
import { DryerRuntimeSensor } from "models/types/Sensors/Dryers/DryerRuntimeSensor"
import { ChartPoint } from "models/types/Agregates/Dryers/Chart/ChartPoint"
import { HistoryChartFilter } from "models/types/Agregates/Dryers/Chart/HistoryChartFilter"



export class AgregatesDbHandler {
  protected backend = backendHost
  protected api = "Agregates"

  private chartCache: Map<string, ChartPoint[]> = new Map()
  private static instance: AgregatesDbHandler
  private constructor() { }

  static GetInstance() {
    if (!this.instance)
      this.instance = new AgregatesDbHandler()

    return this.instance
  }



  async ReadDryerRuntimeAsync(areaId: string): Promise<DryerRuntimeSensor[]> {
    const resp = await fetch(`${this.backend}/${this.api}/ReadDryerRuntimeAsync?areaId=${areaId}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async ReadDryerHistoryAsync(filter: HistoryChartFilter): Promise<ChartPoint[]> {
    const filterEntry = `${filter.areaId}${filter.from}${filter.to}${filter.param}`
    if (this.chartCache.has(filterEntry))
      return this.chartCache.get(filterEntry)!

    const resp = await fetch(`${this.backend}/${this.api}/ReadDryerHistoryAsync`, {
      method: "POST",
      headers: {
        "Accept": "text/plain",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(filter),
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    const data = await resp.json()
    this.chartCache.set(filterEntry, data)
    return data
  }
}

export default AgregatesDbHandler.GetInstance()
