import { OperatorFilter } from "models/types/Diagnostic/Operators/OperatorFilter"
import { OperatorInfo } from "models/types/Diagnostic/Operators/OperatorInfo"
import { ServerInfo } from "models/types/Diagnostic/ServerInfo"
import { ServiceInfo } from "models/types/Diagnostic/ServiceInfo"
import backendHost from "./backendHost"


class DiagnosticDbHandler {
  protected backend = backendHost
  protected api = "Diagnostic"

  private static instance: DiagnosticDbHandler
  private constructor() { }

  static GetInstance() {
    if (!this.instance)
      this.instance = new DiagnosticDbHandler()

    return this.instance
  }


  async GetServiceStatusAsync(): Promise<ServiceInfo> {
    const resp = await fetch(`${this.backend}/${this.api}/GetServiceStatus`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[DiagnosticDbHandler GetServiceStatusAsync]: ${await resp.text()}`)

    return await resp.json()
  }

  async GetServerStatusAsync(): Promise<ServerInfo> {
    const resp = await fetch(`${this.backend}/${this.api}/GetServerStatus`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[DiagnosticDbHandler GetServerStatusAsync]: ${await resp.text()}`)

    return await resp.json()
  }

  async GetListForAsync(filter: OperatorFilter): Promise<OperatorInfo[]> {
    const resp = await fetch(`${this.backend}/${this.api}/ReadOperatorActionsAsync`, {
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

export default DiagnosticDbHandler.GetInstance()
