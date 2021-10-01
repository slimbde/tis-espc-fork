import { DryerRuntimeSensor } from "models/types/Sensors/Dryers/DryerRuntimeSensor";
import { SummaryAnalogSensors } from "models/types/Sensors/Dryers/SummarySensors";
import moment from "moment";
import { ISensorHandler } from "../ISensorHandler";


export class DryerSummarySensorHandler implements ISensorHandler<DryerRuntimeSensor> {
  private sensors: DryerRuntimeSensor[] = []


  Initialize(params: any): void {
    throw new Error("Method not implemented.");
  }

  Handle(sensors: DryerRuntimeSensor[]): void {
    if (sensors.length === 0)
      throw new Error("[DryerSummarySensorHandler]: sensor list is empty!")

    this.sensors = sensors
    this.handleAnalogSensors()
    this.handleDiscrSensors()
  }



  private handleAnalogSensors(): void {
    const analogSensors = this.sensors.filter(s => Object.keys(SummaryAnalogSensors).some(key => key === s.TagName))

    analogSensors.forEach(one => {
      const value = +one.ValueString.replace(/[^0-9.]/g, '')
      const element = document.getElementById(one.TagName) as HTMLDivElement

      if (element) {
        element.innerHTML = ""

        const hint = document.createElement("div")
        hint.textContent = one.Description

        const content = document.createElement("div")
        content.textContent = `${Math.round(value * 1000) / 1000}`
        content.title = one.RevisionTime
        moment().diff(moment(one.RevisionTime, "DD.MM.YYYY HH:mm:ss"), "hours") > 1 && (content.style.color = "lightgray")

        element.appendChild(hint)
        element.appendChild(content)
      }
    })
  }

  private handleDiscrSensors(): void {
    this.setArmPosition()
    this.setMode()
    this.setGasCutValve()
  }


  private setMode(): void {
    let mode = ""
    let revisionTime
    try {
      const cooling = this.sensors.filter(s => s.TagName === "MODE_CTR.EVENTS.EVN_8")[0]
      const blow = this.sensors.filter(s => s.TagName === "MODE_CTR.EVENTS.EVN_9")[0]
      const ignition = this.sensors.filter(s => s.TagName === "MODE_CTR.EVENTS.EVN_10")[0]

      const revisionTimeCooling = moment(cooling.RevisionTime, "DD.MM.YYYY HH:mm:ss")
      const revisionTimeBlow = moment(blow.RevisionTime, "DD.MM.YYYY HH:mm:ss")
      const revisionTimeIgnition = moment(ignition.RevisionTime, "DD.MM.YYYY HH:mm:ss")
      revisionTime = moment.min(revisionTimeCooling, revisionTimeBlow, revisionTimeIgnition)

      mode = cooling.ValueString === "true"
        ? "Охлажд."
        : blow.ValueString === "true"
          ? "Проветр."
          : ignition.ValueString === "true"
            ? "Розжиг"
            : "Нагрев"

    } catch (error) {
      mode = "Неопр."
      revisionTime = moment().subtract(1, "year")
    }

    this.updateElement("Actual_Mode", "Режим установки", mode, revisionTime)
  }
  private setArmPosition(): void {
    let position = ""
    let revisionTime
    try {
      const down = this.sensors.filter(s => s.TagName === "MODE_CTR.EVENTS.EVN_14")[0]
      const middle = this.sensors.filter(s => s.TagName === "MODE_CTR.EVENTS.EVN_15")[0]
      const up = this.sensors.filter(s => s.TagName === "MODE_CTR.EVENTS.EVN_16")[0]

      const revisionTimeDown = moment(down.RevisionTime, "DD.MM.YYYY HH:mm:ss")
      const revisionTimeMiddle = moment(middle.RevisionTime, "DD.MM.YYYY HH:mm:ss")
      const revisionTimeUp = moment(up.RevisionTime, "DD.MM.YYYY HH:mm:ss")
      revisionTime = moment.min(revisionTimeDown, revisionTimeMiddle, revisionTimeUp)

      position = up.ValueString === "true"
        ? "Поднята"
        : middle.ValueString === "true"
          ? "Среднее"
          : down.ValueString === "true"
            ? "Закрыта"
            : "Неопр."

    } catch (error) {
      position = "Неопр."
      revisionTime = moment().subtract(1, "year")
    }

    this.updateElement("Arm_Position", "Положение крышки", position, revisionTime)
  }
  private setGasCutValve(): void {
    let position = ""
    let revisionTime
    try {
      const closed = this.sensors.filter(s => s.TagName === "MODE_CTR.EVENTS.EVN_11")[0]
      const opened = this.sensors.filter(s => s.TagName === "MODE_CTR.EVENTS.EVN_12")[0]

      const revisionTimeClosed = moment(closed.RevisionTime, "DD.MM.YYYY HH:mm:ss")
      const revisionTimeOpened = moment(opened.RevisionTime, "DD.MM.YYYY HH:mm:ss")
      revisionTime = moment.min(revisionTimeClosed, revisionTimeOpened)

      position = closed.ValueString === "true"
        ? "Закрыт"
        : opened.ValueString === "true"
          ? "Открыт"
          : "Неопр."

    } catch (error) {
      position = "Неопр."
      revisionTime = moment().subtract(1, "year")
    }

    this.updateElement("Gas_Cut_Valve", "Отсечной клапан", position, revisionTime)
  }


  private updateElement(id: string, hintText: string, value: string, revisionTime: moment.Moment): void {
    const element = document.getElementById(id)
    if (element) {
      element.innerHTML = ""

      const hint = document.createElement("div")
      hint.textContent = hintText

      const content = document.createElement("div")
      content.textContent = value
      content.title = revisionTime.format("DD.MM.YYYY HH:mm:ss")
      moment().diff(revisionTime, "hours") > 1 && (content.style.color = "lightgray")

      element.appendChild(hint)
      element.appendChild(content)
    }
  }
}