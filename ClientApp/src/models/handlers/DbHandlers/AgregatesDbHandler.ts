import { DryerRuntimeSensor } from "models/types/Sensors/Dryers/DryerRuntimeSensor"
import { ChartPoint } from "models/types/Agregates/Dryers/Chart/ChartPoint"
import { HistoryChartFilter } from "models/types/Agregates/Dryers/Chart/HistoryChartFilter"
import { ProtocolFilter } from "models/types/Agregates/Dryers/Protocol/ProtocolFilter"
import { ProtocolEntry } from "models/types/Agregates/Dryers/Protocol/ProtocolEntry"
import { GasChartFilter } from "models/types/Agregates/Dryers/Gas/GasChartFilter"
import { GasChartPoint } from "models/types/Agregates/Dryers/Gas/GasChartPoint"
import { AgregateSummary } from "models/types/Agregates/Staples/AgregateSummary"
import { CCMInstantInfo } from "models/types/Agregates/Staples/CCMInstantInfo"
import { AKPInstantInfo } from "models/types/Agregates/Staples/AKPInstantInfo"
import moment from "moment"



export class AgregatesDbHandler {
  protected backend = (window as any).config.backendHost
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


  async ReadAkpVodInstantAsync(heatId: number, areaId: number): Promise<AKPInstantInfo> {
    const resp = await fetch(`${this.backend}/${this.api}/ReadAgregateInfoAsync?filter=akp;${heatId};${areaId}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    // cast backend chemistry to frontend chemistry
    type BackChemistry = {
      SampleId: string
      Point: string
      Element: string
      Value: string
    }

    const result = await resp.json() as AKPInstantInfo

    if (result.chems.length > 0) {
      const backChems = result.chems as any as BackChemistry[]

      const sampleNo = backChems[0].SampleId
      result.chemKeys = backChems.filter(el => el.SampleId === sampleNo).map(el => el.Element)

      const nums = backChems.reduce((acc, curr) => {
        acc.add(curr.SampleId)
        return acc
      }, new Set<string>())

      result.chems = []
      nums.forEach(num => {
        const elements = backChems.filter(el => el.SampleId === num)

        result.chems.push({
          num,
          time: moment(elements[0].Point, "dd.MM.yyyy HH:mm:ss").format("HH:mm"),
          elements: elements.map(el => el.Value).join(";")
        })
      })

      result.chems = result.chems.reverse()
    }

    const minToTime = (mins: number) => moment.utc(mins * 1000).format("HH:mm:ss")

    result.energo.HeatTime = minToTime(+result.energo.HeatTime!)
    result.energo.HeatCurrentTime = minToTime(+result.energo.HeatCurrentTime!)
    result.energo.ArgonTime1 = minToTime(+result.energo.ArgonTime1!)
    result.energo.ArgonTime2 = minToTime(+result.energo.ArgonTime2!)

    return result
  }
}

export default AgregatesDbHandler.GetInstance()
