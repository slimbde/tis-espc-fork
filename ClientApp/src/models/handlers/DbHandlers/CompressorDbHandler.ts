import { CompressorSensor } from "models/types/Sensors/Compressor/CompressorSensor"



export class CompressorDbHandler {
  protected backend = (window as any).config.backendHost
  protected api = "Screenshots"

  private static instance: CompressorDbHandler
  private constructor() { }

  static GetInstance() {
    if (!this.instance)
      this.instance = new CompressorDbHandler()

    return this.instance
  }


  async ReadCompressorAsync(): Promise<CompressorSensor[]> {
    const resp = await fetch(`${this.backend}/${this.api}/ReadCompressorAsync`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[${this.api}DbHandler]: ${await resp.text()}`)

    return await resp.json()
  }
}

export default CompressorDbHandler.GetInstance()
