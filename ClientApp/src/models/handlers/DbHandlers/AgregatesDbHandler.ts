import backendHost from "./backendHost"
import { DryerRuntimeSensor } from "models/types/Sensors/Dryers/DryerRuntimeSensor"
import { ChartPoint } from "models/types/Agregates/Dryers/Chart/ChartPoint"
import { HistoryChartFilter } from "models/types/Agregates/Dryers/Chart/HistoryChartFilter"
import { ProtocolFilter } from "models/types/Agregates/Dryers/Protocol/ProtocolFilter"
import { ProtocolEntry } from "models/types/Agregates/Dryers/Protocol/ProtocolEntry"
import { GasChartFilter } from "models/types/Agregates/Dryers/Gas/GasChartFilter"
import { GasChartPoint } from "models/types/Agregates/Dryers/Gas/GasChartPoint"
import { AgregateSummary } from "models/types/Agregates/Staples/AgregateSummary"
import { CCMInstantInfo } from "models/types/Agregates/Staples/CCMInstantInfo"



export class AgregatesDbHandler {
  protected backend = backendHost
  protected api = "Agregates"

  private protocolCache: Map<string, ProtocolEntry[]> = new Map()
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


  async ReadDryerHistoryRealAsync(filter: HistoryChartFilter): Promise<ChartPoint[]> {
    const resp = await fetch(`${this.backend}/${this.api}/ReadDryerHistoryRealAsync`, {
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


  async ReadDryerHistoryBoolAsync(filter: ProtocolFilter): Promise<ProtocolEntry[]> {
    const filterEntry = `${filter.areaId}${filter.from}${filter.to}`
    if (this.protocolCache.has(filterEntry))
      return this.protocolCache.get(filterEntry)!

    const resp = await fetch(`${this.backend}/${this.api}/ReadDryerHistoryBoolAsync`, {
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
    this.protocolCache.set(filterEntry, data)
    return data
  }


  async ReadDryerGasHistoryAsync(filter: GasChartFilter): Promise<GasChartPoint[]> {
    const resp = await fetch(`${this.backend}/${this.api}/ReadDryerGasHistoryAsync`, {
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


  async ReadStapleSummaryAsync(): Promise<AgregateSummary[]> {
    const resp = await fetch(`${this.backend}/${this.api}/ReadAgregateSummaryAsync`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }

  async ReadCCM2InstantAsync(): Promise<CCMInstantInfo> {
    const resp = await fetch(`${this.backend}/${this.api}/ReadAgregateInfoAsync?filter=ccm2`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json() as CCMInstantInfo
  }
}

export default AgregatesDbHandler.GetInstance()
