import backendHost from "../backendHost";
import { IDbHandler } from "./IDbHandler";


/**
 * Staple generic DB class
 */
export default class TDbHandler<T> implements IDbHandler<T> {
  protected backend = backendHost
  protected api: string

  constructor(api: string) { this.api = api }


  async GetSingleAsync(id: number): Promise<T> {
    throw new Error("Not implemented")
  }
  async ListForAsync(report_counter: number): Promise<T[]> {
    const resp = await fetch(`${this.backend}/${this.api}/ListForAsync?report_counter=${report_counter}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }
  async PutAsync(obj: T): Promise<number> {
    const resp = await fetch(`${this.backend}/${this.api}/PutAsync`, {
      method: "POST",
      headers: {
        "Accept": "text/plain",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(obj),
      credentials: "include",
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }
  async DeleteAsync(obj: T): Promise<number> {
    const resp = await fetch(`${this.backend}/${this.api}/DeleteAsync`, {
      method: "POST",
      headers: {
        "Accept": "text/plain",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(obj),
      credentials: "include",
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }
  async PostAsync(obj: T): Promise<number> {
    const resp = await fetch(`${this.backend}/${this.api}/PostAsync`, {
      method: "POST",
      headers: {
        "Accept": "text/plain",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(obj),
      credentials: "include",
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }
}

