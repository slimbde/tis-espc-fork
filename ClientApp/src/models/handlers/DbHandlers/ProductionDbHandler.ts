import { CCMHeat } from "models/types/Production/CCMHeat"
import { HeatCCMProcess } from "models/types/Production/HeatCCMProcess"
import { HeatCCMQuality } from "models/types/Production/HeatCCMQuality"
import { HeatEvent } from "models/types/Production/HeatEvent"
import { HeatVODProcess } from "models/types/Production/HeatVODProcess"
import { LFHeat } from "models/types/Production/LFHeat"
import { ProductionFilter } from "models/types/Production/ProductionFilter"
import { VODHeat } from "models/types/Production/VODHeat"
import backendHost from "./backendHost"


export class ProductionDbHandler {
  protected backend = backendHost
  protected api = "Production"

  private static instance: ProductionDbHandler
  private constructor() { }

  static GetInstance() {
    if (!this.instance)
      this.instance = new ProductionDbHandler()

    return this.instance
  }


  async GetListForAsync(filter: ProductionFilter): Promise<LFHeat[] | VODHeat[] | CCMHeat[]> {
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
}

export default ProductionDbHandler.GetInstance()
