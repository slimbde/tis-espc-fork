import { AKOSHeat } from "models/types/Technology/Production/AKOSHeat"
import { CCM1Heat } from "models/types/Technology/Production/CCM1Heat"
import { CCM2Heat } from "models/types/Technology/Production/CCM2Heat"
import { DSPHeat } from "models/types/Technology/Production/DSPHeat"
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

  private static instance: ProductionDbHandler
  private constructor() { }

  static GetInstance() {
    if (!this.instance)
      this.instance = new ProductionDbHandler()

    return this.instance
  }





  async GetListForAsync(filter: ProductionFilter, token: AbortController): Promise<LFHeat[] | VODHeat[] | CCM2Heat[] | CCM1Heat[] | AKOSHeat[] | DSPHeat[]> {
    const resp = await fetch(`${this.backend}/${this.api}/ReadForAsync`, {
      method: "POST",
      headers: {
        "Accept": "text/plain",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(filter),
      credentials: "include",
      signal: token.signal
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


  async GetScheduleHeatInfoAsync(date: string, token: AbortController): Promise<ScheduleHeatInfo[]> {
    const resp = await fetch(`${this.backend}/${this.api}/GetScheduleAsync?date=${date}`, {
      credentials: "include",
      signal: token.signal
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    const result = await resp.json();
    return result
  }
}

export default ProductionDbHandler.GetInstance()
