import { OperatorFilter } from "models/types/Diagnostic/Operators/OperatorFilter"
import { OperatorInfo } from "models/types/Diagnostic/Operators/OperatorInfo"
import { ServerInfo } from "models/types/Diagnostic/ServerInfo"
import { ServiceInfo } from "models/types/Diagnostic/ServiceInfo"
import backendHost from "./backendHost"


export default class DiagnosticHandler {
  protected static backend = backendHost
  protected static api = "Diagnostic"

  static async GetServiceStatusAsync(): Promise<ServiceInfo> {
    const resp = await fetch(`${this.backend}/${this.api}/GetServiceStatus`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[DiagnosticHandler GetServiceStatusAsync]: ${await resp.text()}`)

    return await resp.json()
  }

  static async GetServerStatusAsync(): Promise<ServerInfo> {
    const resp = await fetch(`${this.backend}/${this.api}/GetServerStatus`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[DiagnosticHandler GetServerStatusAsync]: ${await resp.text()}`)

    return await resp.json()
  }

  static async GetListForAsync(filter: OperatorFilter): Promise<OperatorInfo[]> {
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
}