import { MetallurgicalDate } from "components/extra/MetallurgicalDate"
import { CCM2Heat } from "models/types/Technology/Production/CCM2Heat"
import { HeatCCMProcess } from "models/types/Technology/Production/HeatCCMProcess"
import { HeatCCMQuality } from "models/types/Technology/Production/HeatCCMQuality"
import { HeatEvent } from "models/types/Technology/Production/HeatEvent"
import { HeatVODProcess } from "models/types/Technology/Production/HeatVODProcess"
import { LFHeat } from "models/types/Technology/Production/LFHeat"
import { ProductionFilter } from "models/types/Technology/Production/ProductionFilter"
import { VODHeat } from "models/types/Technology/Production/VODHeat"
import { ScheduleHeatInfo } from "models/types/Technology/Schedule/ScheduleHeatInfo"



export class ProductionDbHandler {
  protected backend = (window as any).config.backendHost
  protected api = "Production"

  private lastScheduleRequeust: number = 0
  private static instance: ProductionDbHandler
  private constructor() { }

  static GetInstance() {
    if (!this.instance)
      this.instance = new ProductionDbHandler()

    return this.instance
  }


  private interimCache: Map<string, ScheduleHeatInfo[]> = new Map()



  async GetListForAsync(filter: ProductionFilter): Promise<LFHeat[] | VODHeat[] | CCM2Heat[]> {
    const resp = await fetch(`${this.backend}/${this.api}/ReadForAsync`, {
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

    return await resp.json()
  }

  async GetHeatEventsAsync(heatId: string, areaId: number): Promise<HeatEvent[]> {
    const resp = await fetch(`${this.backend}/${this.api}/GetHeatEventsAsync?heatId=${heatId}&areaId=${areaId}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }

  async GetHeatVODProcessesAsync(heatId: string): Promise<HeatVODProcess[]> {
    const resp = await fetch(`${this.backend}/${this.api}/GetHeatVODProcessesAsync?heatId=${heatId}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }

  async GetHeatCCMProcessesAsync(heatId: string): Promise<HeatCCMProcess[]> {
    const resp = await fetch(`${this.backend}/${this.api}/GetHeatCCMProcessesAsync?heatId=${heatId}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }

  async GetHeatCCMQualityAsync(heatId: string): Promise<HeatCCMQuality[]> {
    const resp = await fetch(`${this.backend}/${this.api}/GetHeatCCMQualityAsync?heatId=${heatId}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async GetScheduleHeatInfoAsync(date: string): Promise<ScheduleHeatInfo[]> {
    const requestTime = new Date().getTime()

    if (this.interimCache.has(date)) {
      if (date !== MetallurgicalDate() ||
        (date === MetallurgicalDate() && requestTime - this.lastScheduleRequeust < 5 * 60 * 1000)
      )
        return this.interimCache.get(date)!
    }

    const resp = await fetch(`${this.backend}/${this.api}/GetScheduleAsync?date=${date}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    const result = await resp.json();
    this.interimCache.set(date, result)
    this.lastScheduleRequeust = requestTime

    return result
  }
}

export default ProductionDbHandler.GetInstance()
