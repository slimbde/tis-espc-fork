import { Idle } from "models/types/Idle";


export default class IdleHandler {

  static async GetIdlesForAsync(bDate: string, eDate: string): Promise<Idle[]> {
    const resp = await fetch(`http://10.2.59.133:90/Home/Idles?StartDate=${bDate}&EndDate=${eDate}`)

    if (resp.status >= 400)
      throw new Error(`[IdleHandler GetIdlesForAsync]: ${await resp.text()}`)

    const data = await resp.json() as Idle[]
    return data.sort((a, b) => a.IMMName > b.IMMName ? 1 : a.IMMName < b.IMMName ? -1 : 0)
  }
}