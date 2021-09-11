import { CCMHeat } from "models/types/Production/CCMHeat"
import { HeatEvent } from "models/types/Production/HeatEvent"
import { LFHeat } from "models/types/Production/LFHeat"
import { ProductionFilter } from "models/types/Production/ProductionFilter"
import { VODHeat } from "models/types/Production/VODHeat"
import backendHost from "./backendHost"


export class ProductionHandler {
  protected backend = backendHost
  protected api = "Production"

  private static instance: ProductionHandler
  private constructor() { }

  static GetInstance() {
    if (!this.instance)
      this.instance = new ProductionHandler()

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
}

export default ProductionHandler.GetInstance()
