import { OperatorFilter } from "models/types/Diagnostic/Operators/OperatorFilter"
import { OperatorInfo } from "models/types/Diagnostic/Operators/OperatorInfo"
import { ServerInfo } from "models/types/Diagnostic/ServerInfo"
import { ServiceInfo } from "models/types/Diagnostic/ServiceInfo"
import backendHost from "./backendHost"


class DiagnosticHandler {
  protected backend = backendHost
  protected api = "Diagnostic"

  private static instance: DiagnosticHandler
  private constructor() { }

  static GetInstance() {
    if (!this.instance)
      this.instance = new DiagnosticHandler()

    return this.instance
  }


  async GetServiceStatusAsync(): Promise<ServiceInfo> {
    const resp = await fetch(`${this.backend}/${this.api}/GetServiceStatus`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[DiagnosticHandler GetServiceStatusAsync]: ${await resp.text()}`)

    return await resp.json()
  }

  async GetServerStatusAsync(): Promise<ServerInfo> {
    const resp = await fetch(`${this.backend}/${this.api}/GetServerStatus`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[DiagnosticHandler GetServerStatusAsync]: ${await resp.text()}`)

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

export default DiagnosticHandler.GetInstance()
