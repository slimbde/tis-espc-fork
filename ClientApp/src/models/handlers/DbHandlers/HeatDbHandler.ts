import TDbHandler from "./TDbHandler"
import { Heat } from "models/types/Heat";
import { HeatSummary } from "models/types/HeatSummary";
import { StrandsInfo } from "models/types/StrandSummary";
import { ChemistryElement } from "models/types/ChemistryElement";
import { HeatEvent } from "models/types/HeatEvent";
import { Correction } from "models/types/Correction";
import { ChartData } from "models/types/Chart/ChartData";


export default class HeatDbHandler extends TDbHandler<Heat> {

  constructor() { super("Heat") }


  async GetListForAsync(bDate: string, eDate: string): Promise<Heat[]> {
    const resp = await fetch(`${this.backend}/${this.api}/ReadForAsync?bDate=${bDate}&eDate=${eDate}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async FindListForAsync(heatId: string): Promise<Heat[]> {
    const resp = await fetch(`${this.backend}/${this.api}/FindHeatAsync?heat_id=${heatId}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async GetHeatSummaryAsync(report_counter: number): Promise<HeatSummary> {
    const resp = await fetch(`${this.backend}/${this.api}/GetHeatSummaryAsync?report_counter=${report_counter}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async GetStrandsSummaryAsync(report_counter: number): Promise<StrandsInfo> {
    const resp = await fetch(`${this.backend}/${this.api}/GetStrandsSummaryAsync?report_counter=${report_counter}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async GetChemistryAsync(report_counter: number): Promise<ChemistryElement[]> {
    const resp = await fetch(`${this.backend}/${this.api}/GetChemistryAsync?report_counter=${report_counter}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async GetEventsAsync(report_counter: number): Promise<HeatEvent[]> {
    const resp = await fetch(`${this.backend}/${this.api}/GetEventsAsync?report_counter=${report_counter}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async GetCorrectionsAsync(report_counter: number): Promise<Correction[]> {
    const resp = await fetch(`${this.backend}/${this.api}/GetCorrectionsAsync?report_counter=${report_counter}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async GetProductsAsync(heat_id: number, strand_no: number): Promise<number[]> {
    const resp = await fetch(`${this.backend}/${this.api}/GetProductsAsync?heat_id=${heat_id}&strand_no=${strand_no}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async GetChartDataAsync(heat_id: number, strand_no: number, productno: number, var_id: string): Promise<ChartData> {
    const resp = await fetch(`${this.backend}/${this.api}/GetChartDataAsync?heat_id=${heat_id}&strand_no=${strand_no}&productno=${productno}&var_id=${var_id}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }
}