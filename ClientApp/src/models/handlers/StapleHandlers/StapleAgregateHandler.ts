import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo";
import { AgregateSummary } from "models/types/Agregates/Staples/AgregateSummary";
import moment from "moment";

export class StapleAgregateHandler {
  private summary: AgregateSummary[] = []

  private isDataDelayed = (delayControlField: AgregateSummary) => moment()
    .diff(moment(delayControlField.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "minute") > 2

  SetAgregateSummary = (summary: AgregateSummary[]) => this.summary = summary

  GetDSPInfo = (): AgregateInfo => {
    const dspSummary: AgregateSummary[] = this.summary.filter(s => s.Name === "AF")
    const steelGrade = dspSummary.filter(s => s.Tag === "mark")[0]
    const heatId = dspSummary.filter(s => s.Tag === "heatID")[0]
    const energy = dspSummary.filter(s => s.Tag === "ee_input")[0].Value !== "0"
    const refining = dspSummary.filter(s => s.Tag === "refining")[0].Value !== "0"
    const smeltTime = dspSummary.filter(s => s.Tag === "smelt_time")[0].Value
    const smeltStart = dspSummary.filter(s => s.Tag === "smelt_start")[0].UpdatePoint

    return {
      name: "ДСП",
      heatId: heatId.Value,
      steelGrade: steelGrade.Value,
      energy,
      refining,
      smeltTime,
      smeltStart,

      dataDelayed: false,
      lastUpdate: moment().format("YYYY-MM-DD HH:mm:ss"),
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
      argon: summary.filter(s => s.Tag === "ARGON_ON")[0].Value === "1",
      energy: summary.filter(s => s.Tag === "ENERG_ARC_ON")[0].Value === "1",
      capdown: svodVertical.Value === "2" || svodVertical.Value === "0",
      empty: false,

      dataDelayed: false,
      lastUpdate: moment().format("YYYY-MM-DD HH:mm:ss"),
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
      argon: summary.filter(s => s.Tag === "ARGON_ON")[0].Value === "True",
      energy: energyOn && capdown,
      capdown,

      dataDelayed: false,
      lastUpdate: moment().format("YYYY-MM-DD HH:mm:ss"),
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
    const update = summary.filter(s => s.Tag === "$DateTime")[0]

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
      streamCast: +flow.Value > 0.05 && +castingSpeed.Value > 0.05,
      tsg: "10",

      dataDelayed: this.isDataDelayed(update),
      lastUpdate: update.UpdatePoint,
    }
  }

  GetMNLZ2Info = (): AgregateInfo => {
    const summary: AgregateSummary[] = this.summary.filter(s => s.Name === "CCM-2")
    const heatId = summary.filter(s => s.Tag === "TRK_MS_GEN_HT_ID")[0]
    const series = summary.filter(s => s.Tag === "TRK_WS_SEQ_NO")[0]
    const castingSpeed = summary.filter(s => s.Tag === "GERM_WS_SP")[0]
    const update = summary.filter(s => s.Tag === "$DateTime")[0]

    const mldTk = +summary.filter(s => s.Tag === "L2S_WM_COM_MLD_TK")[0].Value
    const exitWidth = +summary.filter(s => s.Tag === "MWA_WS_EXIT_WIDTH")[0].Value
    const stlHot = +summary.filter(s => s.Tag === "L2S_WM_TRK_STL_HOT")[0].Value

    const a = summary.filter(s => s.Tag === "TGS_BS_A1_CAST_POS")[0].Value === "1"
    const b = summary.filter(s => s.Tag === "TGS_BS_A2_CAST_POS")[0].Value === "1"
    const c = summary.filter(s => s.Tag === "TGS_BS_ARM1_LD_PRE")[0].Value === "1"
    const d = summary.filter(s => s.Tag === "TGS_BS_ARM2_LD_PRE")[0].Value === "1"

    const tsg = a && b
      ? "s11"
      : (a && !b && c) || (!a && b && d)
        ? "s10"
        : ((!a && b && c) || (a && !b && d))
          ? "s01"
          : "s00"


    return {
      name: "МНЛЗ-2",
      flow: Math.round(((mldTk * exitWidth * stlHot) / 1000000000) * +castingSpeed.Value * 60) + "",
      heatId: heatId.Value,
      series: series.Value,
      castingStart: summary.filter(s => s.Tag === "TRK_WS_TIME_OPN")[0].Value,
      castingSpeed: Math.round(+castingSpeed.Value * 100) / 100 + "",
      streamCast: summary.filter(s => s.Tag === "COM_BS_CAST_MODE")[0].Value !== "0",
      tsg,

      dataDelayed: this.isDataDelayed(update),
      lastUpdate: update.UpdatePoint,
    }
  }

  GetVDInfo = (num: 1 | 2): AgregateInfo => {
    const summary: AgregateSummary[] = this.summary.filter(s => s.Name === `VD-2${num}`)

    const heatId = summary.filter(s => s.Tag === "HEAT_ID")[0]
    const steelGrade = summary.filter(s => s.Tag === "STEEL_GRD")[0]
    const vacuum = summary.filter(s => s.Tag === "VACUUM_ON")[0].Value === "True"
    const capdown = summary.filter(s => s.Tag === "SVOD_LOW")[0].Value === "True"

    return {
      name: `ВД-${num}`,
      heatId: heatId.Value.replace(/[^a-zA-Zа-яА-Я0-9]/g, ""),
      steelGrade: steelGrade.Value.replace(/[^a-zA-Zа-яА-Я0-9]/g, ""),
      argon: summary.filter(s => s.Tag === "ARGON_ON")[0].Value === "True",
      energy: vacuum && capdown,
      capdown,
      vacuum,

      dataDelayed: false,
      lastUpdate: moment().format("YYYY-MM-DD HH:mm:ss"),
    }
  }
}