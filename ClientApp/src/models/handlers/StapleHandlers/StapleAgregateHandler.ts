import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo";
import { AgregateSummary } from "models/types/Agregates/Staples/AgregateSummary";
import moment from "moment";

export class StapleAgregateHandler {
  private summary: AgregateSummary[] = []

  SetAgregateSummary = (summary: AgregateSummary[]) => this.summary = summary

  GetDSPInfo = (): AgregateInfo => {
    const dspSummary: AgregateSummary[] = this.summary.filter(s => s.Name === "AF")
    const steelGrade = dspSummary.filter(s => s.Tag === "mark")[0]
    const heatId = dspSummary.filter(s => s.Tag === "heatID")[0]

    return {
      name: "ДСП",
      heatId: heatId.Value,
      steelGrade: steelGrade.Value,

      //steelGradeDelayed: moment().diff(moment(steelGrade.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "hour") > 4,
      heatIdDelayed: moment().diff(moment(heatId.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "hour") > 5,
    }
  }

  GetAKOSInfo = (): AgregateInfo => {
    const summary: AgregateSummary[] = this.summary.filter(s => s.Name === "EAKP-2")
    const svodVertical = summary.filter(s => s.Tag === "SVOD_VERTICAL")[0]
    const heatId = summary.filter(s => s.Tag === "HEAT_ID")[0]
    const steelGrade = summary.filter(s => s.Tag === "STEEL_GRD")[0]

    return {
      name: "АКОС",
      heatId: heatId.Value,
      steelGrade: steelGrade.Value,
      argonOn: summary.filter(s => s.Tag === "ARGON_ON")[0].Value === "1",
      energy: summary.filter(s => s.Tag === "ENERG_ARC_ON")[0].Value === "1",
      capdown: svodVertical.Value === "2" || svodVertical.Value === "0",

      heatIdDelayed: moment().diff(moment(heatId.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "hour") > 3,
      steelGradeDelayed: moment().diff(moment(steelGrade.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "hour") > 3,
    }
  }

  GetAKPInfo = (num: 1 | 2): AgregateInfo => {
    const summary: AgregateSummary[] = this.summary.filter(s => s.Name === `EAKP-1${num}`)

    const heatId = summary.filter(s => s.Tag === "HEAT_ID")[0]
    const steelGrade = summary.filter(s => s.Tag === "STEEL_GRD")[0]
    const energyOn = summary.filter(s => s.Tag === "SVOD_ARGON_ENERGY_ON")[0].Value === "True"
    const capdown = summary.filter(s => s.Tag === "SVOD_LOW")[0].Value === "True"

    return {
      name: `АКП-${num}`,
      heatId: heatId.Value.replace(/[^a-zA-Zа-яА-Я0-9]/g, ""),
      steelGrade: steelGrade.Value.replace(/[^a-zA-Zа-яА-Я0-9]/g, ""),
      empty: summary.filter(s => s.Tag === "LRF_ON")[0].Value === "False",
      argonOn: summary.filter(s => s.Tag === "ARGON_ON")[0].Value === "True",
      energy: energyOn && capdown,
      capdown,

      heatIdDelayed: moment().diff(moment(heatId.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "hour") > 1,
      steelGradeDelayed: moment().diff(moment(steelGrade.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "hour") > 1,
    }
  }

  GetMNLZ1Info = (): AgregateInfo => {
    const summary: AgregateSummary[] = this.summary.filter(s => s.Name === "CCM-1")
    const heatId = summary.filter(s => s.Tag === "HEAT_ID")[0]
    const steelGrade = summary.filter(s => s.Tag === "STEEL_GRADE")[0]
    const flow = summary.filter(s => s.Tag === "FLOW_SPEED")[0]
    const series = summary.filter(s => s.Tag === "SEQ_NO")[0]
    const castingSpeed = summary.filter(s => s.Tag === "STREAM_SPEED1")[0]
    const start = moment(summary.filter(s => s.Tag === "START")[0].Value, "YYYY-MM-DD HH:mm:ss")

    const castingHours = moment().diff(start, "hour")
    const castingMinutes = moment().diff(start, "minutes") - castingHours * 60
    const castingSeconds = moment().diff(start, "second") - castingHours * 3600 - castingMinutes * 60

    return {
      name: "МНЛЗ-1",
      flow: Math.round(+flow.Value * 100) / 100 + "",
      heatId: heatId.Value,
      series: series.Value,
      castingStart: `${castingHours < 10 ? "0" + castingHours : castingHours}:${castingMinutes < 10 ? "0" + castingMinutes : castingMinutes}:${castingSeconds < 10 ? "0" + castingSeconds : castingSeconds}`,
      steelGrade: steelGrade.Value,
      castingSpeed: Math.round(+castingSpeed.Value * 100) / 100 + "",
      streamCast: summary.filter(s => s.Tag === "STREAM_CAST")[0].Value === "True",

      heatIdDelayed: moment().diff(moment(heatId.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "hour") > 5,
      steelGradeDelayed: moment().diff(moment(steelGrade.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "day") > 1,
      flowDelayed: moment().diff(moment(flow.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "minute") > 1,
      seriesDelayed: moment().diff(moment(series.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "minute") > 1,
      castingSpeedDelayed: moment().diff(moment(castingSpeed.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "minute") > 1,
    }
  }

  GetMNLZ2Info = (): AgregateInfo => {
    const summary: AgregateSummary[] = this.summary.filter(s => s.Name === "CCM-2")
    const heatId = summary.filter(s => s.Tag === "TRK_MS_GEN_HT_ID")[0]
    const flow = summary.filter(s => s.Tag === "COM_BS_CAST_MODE")[0]
    const series = summary.filter(s => s.Tag === "TRK_WS_SEQ_NO")[0]
    const castingSpeed = summary.filter(s => s.Tag === "GERM_WS_SP")[0]

    const mldTk = +summary.filter(s => s.Tag === "L2S_WM_COM_MLD_TK")[0].Value
    const exitWidth = +summary.filter(s => s.Tag === "MWA_WS_EXIT_WIDTH")[0].Value
    const stlHot = +summary.filter(s => s.Tag === "L2S_WM_TRK_STL_HOT")[0].Value

    return {
      name: "МНЛЗ-2",
      flow: Math.round(((mldTk * exitWidth * stlHot) / 1000000000) * +castingSpeed.Value * 60) + "",
      heatId: heatId.Value,
      series: series.Value,
      castingStart: summary.filter(s => s.Tag === "TRK_WS_TIME_OPN")[0].Value,
      castingSpeed: Math.round(+castingSpeed.Value * 100) / 100 + "",
      streamCast: summary.filter(s => s.Tag === "COM_BS_CAST_MODE")[0].Value !== "0",

      heatIdDelayed: moment().diff(moment(heatId.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "hour") > 5,
      flowDelayed: moment().diff(moment(flow.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "minute") > 1,
      seriesDelayed: moment().diff(moment(series.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "minute") > 1,
      castingSpeedDelayed: moment().diff(moment(castingSpeed.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "minute") > 1,
    }
  }

  GetVDInfo = (num: 1 | 2): AgregateInfo => {
    const summary: AgregateSummary[] = this.summary.filter(s => s.Name === `VD-2${num}`)

    const heatId = summary.filter(s => s.Tag === "HEAT_ID")[0]
    const steelGrade = summary.filter(s => s.Tag === "STEEL_GRD")[0]
    const vacuumOn = summary.filter(s => s.Tag === "VACUUM_ON")[0].Value === "True"
    const capdown = summary.filter(s => s.Tag === "SVOD_LOW")[0].Value === "True"

    return {
      name: `ВД-${num}`,
      heatId: heatId.Value.replace(/[^a-zA-Zа-яА-Я0-9]/g, ""),
      steelGrade: steelGrade.Value.replace(/[^a-zA-Zа-яА-Я0-9]/g, ""),
      argonOn: summary.filter(s => s.Tag === "ARGON_ON")[0].Value === "True",
      energy: vacuumOn && capdown,
      capdown,

      heatIdDelayed: moment().diff(moment(heatId.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "day") > 1,
      steelGradeDelayed: moment().diff(moment(steelGrade.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "day") > 1,
    }
  }
}