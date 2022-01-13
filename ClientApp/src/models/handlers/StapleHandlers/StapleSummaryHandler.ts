import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo";
import { AgregateSummary } from "models/types/Agregates/Staples/AgregateSummary";
import { CCMAgregateInfo } from "models/types/Agregates/Staples/CCMAgregateInfo";
import { DSPAgregateInfo } from "models/types/Agregates/Staples/DSPAgregateInfo";
import moment from "moment";


export class StapleSummaryHandler {
  private summary: AgregateSummary[]

  private isDataDelayed = (delayControlField: AgregateSummary) => moment()
    .diff(moment(delayControlField.UpdatePoint, "DD.MM.YYYY HH:mm:ss"), "minute") > 2

  constructor(summary: AgregateSummary[]) { this.summary = summary }

  GetDSPInfo = (): DSPAgregateInfo => {
    const dspSummary: AgregateSummary[] = this.summary.filter(s => s.Name === "AF")
    const steelGrade = dspSummary.filter(s => s.Tag === "STEEL_GRADE")[0]
    const heatId = dspSummary.filter(s => s.Tag === "HEAT_ID")[0]
    const energy = dspSummary.filter(s => s.Tag === "ENERGY_ON")[0].Value !== "0"
    const eeHeatActive = dspSummary.filter(s => s.Tag === "EE_HEAT_ACTIVE")[0].Value
    const refining = dspSummary.filter(s => s.Tag === "REFINING")[0].Value !== "0"
    const heatTime = dspSummary.filter(s => s.Tag === "HEAT_TIME")[0].Value
    const heatStart = dspSummary.filter(s => s.Tag === "HEAT_START")[0].Value
    const heatCurrentTime = dspSummary.filter(s => s.Tag === "HEAT_CURRENT_TIME")[0].Value

    const eeHeatReactive = dspSummary.filter(s => s.Tag === "EE_HEAT_REACTIVE")[0].Value
    const eeTodayActive = dspSummary.filter(s => s.Tag === "EE_TODAY_ACTIVE")[0].Value
    const eeTodayReactive = dspSummary.filter(s => s.Tag === "EE_TODAY_REACTIVE")[0].Value
    const eeYestActive = dspSummary.filter(s => s.Tag === "EE_YEST_ACTIVE")[0].Value
    const eeYestReactive = dspSummary.filter(s => s.Tag === "EE_YEST_REACTIVE")[0].Value
    const heatTab = dspSummary.filter(s => s.Tag === "HEAT_TAB")[0].Value
    const ladleId = dspSummary.filter(s => s.Tag === "LADLE_ID")[0].Value
    const psn = dspSummary.filter(s => s.Tag === "PSN")[0].Value
    const stoikCaseFrmw = dspSummary.filter(s => s.Tag === "STOIK_CASE_FRMW")[0].Value
    const stoikErk = dspSummary.filter(s => s.Tag === "STOIK_ERK")[0].Value
    const stoikFloor = dspSummary.filter(s => s.Tag === "STOIK_FLOOR")[0].Value
    const stoikQ1 = dspSummary.filter(s => s.Tag === "STOIK_Q1")[0].Value
    const stoikQ2 = dspSummary.filter(s => s.Tag === "STOIK_Q2")[0].Value
    const stoikSvodFrmw = dspSummary.filter(s => s.Tag === "STOIK_SVOD_FRMW")[0].Value
    const stoikSvodLg = dspSummary.filter(s => s.Tag === "STOIK_SVOD_LG")[0].Value
    const stoikSvodSm = dspSummary.filter(s => s.Tag === "STOIK_SVOD_SM")[0].Value
    const stoikWall = dspSummary.filter(s => s.Tag === "STOIK_WALL")[0].Value

    const update = dspSummary.filter(s => s.Tag === "$DateTime")[0]


    return {
      name: "ДСП",
      heatId: heatId.Value,
      steelGrade: steelGrade.Value,
      energy,
      eeHeatActive,
      refining,
      heatTime,
      heatStart,
      heatCurrentTime,

      eeHeatReactive,
      eeTodayActive,
      eeTodayReactive,
      eeYestActive,
      eeYestReactive,
      heatTab,
      ladleId,
      psn,
      stoikCaseFrmw,
      stoikErk,
      stoikFloor,
      stoikQ1,
      stoikQ2,
      stoikSvodFrmw,
      stoikSvodLg,
      stoikSvodSm,
      stoikWall,

      dataDelayed: this.isDataDelayed(update),
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
      name: `АКП2-${num}поз`,
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

  GetMNLZ1Info = (): CCMAgregateInfo => {
    const summary: AgregateSummary[] = this.summary.filter(s => s.Name === "CCM-1")

    const castedMeters = summary.filter(s => s.Tag === "CASTED_METERS")[0].Value
    const castedTonns = summary.filter(s => s.Tag === "CASTED_TONNS")[0].Value
    const castingSpeed = summary.filter(s => s.Tag === "CASTING_SPEED")[0].Value
    const crystFlow = summary.filter(s => s.Tag === "CRYST_FLOW")[0].Value
    const crystFreq = summary.filter(s => s.Tag === "CRYST_FREQ")[0].Value
    const crystFLeft = summary.filter(s => s.Tag === "CRYST_F_LEFT")[0].Value
    const crystFRight = summary.filter(s => s.Tag === "CRYST_F_RIGHT")[0].Value
    const crystPullEffort = summary.filter(s => s.Tag === "CRYST_PULL_EFFORT")[0].Value
    const crystShos = summary.filter(s => s.Tag === "CRYST_SHOS")[0].Value
    const crystStoik = summary.filter(s => s.Tag === "CRYST_STOIK")[0].Value
    const crystTbefore = summary.filter(s => s.Tag === "CRYST_T_BEFORE")[0].Value
    const crystTdelta = summary.filter(s => s.Tag === "CRYST_T_DELTA")[0].Value
    const crystTshears = summary.filter(s => s.Tag === "CRYST_T_SHEARS")[0].Value
    const currentTemp = summary.filter(s => s.Tag === "CURRENT_TEMP")[0].Value
    const cutId = summary.filter(s => s.Tag === "CUT_ID")[0].Value
    const flowSpeed = summary.filter(s => s.Tag === "FLOW_SPEED")[0].Value
    const heatId = summary.filter(s => s.Tag === "HEAT_ID")[0].Value
    const heatStart = summary.filter(s => s.Tag === "HEAT_START")[0].Value
    const heatTime = summary.filter(s => s.Tag === "HEAT_TIME")[0].Value
    const heatWeight = summary.filter(s => s.Tag === "HEAT_WEIGHT")[0].Value
    const ladleArm = summary.filter(s => s.Tag === "LADLE_ARM")[0].Value
    const ladleId = summary.filter(s => s.Tag === "LADLE_ID")[0].Value
    const ladleShib = summary.filter(s => s.Tag === "LADLE_SHIB")[0].Value
    const ladleStoik = summary.filter(s => s.Tag === "LADLE_STOIK")[0].Value
    const optimalSpeed = summary.filter(s => s.Tag === "OPTIMAL_SPEED")[0].Value
    const samples = summary.filter(s => s.Tag === "SAMPLES")[0].Value
    const series = summary.filter(s => s.Tag === "SEQ_NO")[0].Value
    const shiftCode = summary.filter(s => s.Tag === "SHIFT_CODE")[0].Value
    const shiftResponsible = summary.filter(s => s.Tag === "SHIFT_RESPONSIBLE")[0].Value
    const slabThickness = summary.filter(s => s.Tag === "SLAB_THICKNESS")[0].Value
    const slabWidth = summary.filter(s => s.Tag === "SLAB_WIDTH")[0].Value
    const steelGrade = summary.filter(s => s.Tag === "STEEL_GRADE")[0].Value
    const teamId = summary.filter(s => s.Tag === "TEAM_ID")[0].Value
    const tundishCar = summary.filter(s => s.Tag === "TUNDISH_CAR")[0].Value
    const tundishId = summary.filter(s => s.Tag === "TUNDISH_ID")[0].Value
    const tundishShos = summary.filter(s => s.Tag === "TUNDISH_SHOS")[0].Value
    const tundishStoik = summary.filter(s => s.Tag === "TUNDISH_STOIK")[0].Value

    const update = summary.filter(s => s.Tag === "$DateTime")[0]


    return {
      name: "МНЛЗ-1",
      castedMeters,
      castedTonns,
      castingSpeed,
      crystFlow,
      crystFreq,
      crystFLeft,
      crystFRight,
      crystPullEffort,
      crystShos,
      crystStoik,
      crystTbefore,
      crystTdelta,
      crystTshears,
      currentTemp,
      cutId,
      flowSpeed,
      heatId,
      heatStart,
      heatTime,
      heatWeight,
      ladleArm,
      ladleId: `${ladleId} (${ladleStoik})`,
      ladleShib,
      ladleStoik,
      optimalSpeed,
      samples,
      series,
      shiftCode,
      shiftResponsible,
      slabThickness,
      slabWidth,
      steelGrade,
      streamCast: +flowSpeed > 0.05 && +castingSpeed > 0.05,
      teamId,
      tundishCar,
      tundishId: `${tundishId} (${tundishStoik})`,
      tundishShos,
      tundishStoik,

      tgs: "s10",

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
    const heatStart = summary.filter(s => s.Tag === "TRK_WS_TIME_OPN")[0].Value
    const heatTime = moment.utc(moment().diff(moment(heatStart, "HH:mm:ss"))).format("HH:mm:ss")

    const mldTk = +summary.filter(s => s.Tag === "L2S_WM_COM_MLD_TK")[0].Value
    const exitWidth = +summary.filter(s => s.Tag === "MWA_WS_EXIT_WIDTH")[0].Value
    const stlHot = +summary.filter(s => s.Tag === "L2S_WM_TRK_STL_HOT")[0].Value

    const LD_1 = summary.filter(s => s.Tag === "TGS_BS_ARM1_LD_PRE")[0].Value === "1"
    const LD_2 = summary.filter(s => s.Tag === "TGS_BS_ARM2_LD_PRE")[0].Value === "1"
    const CAST_1 = summary.filter(s => s.Tag === "TGS_BS_A1_CAST_POS")[0].Value === "1"
    const CAST_2 = summary.filter(s => s.Tag === "TGS_BS_A2_CAST_POS")[0].Value === "1"

    let tgs
    if (LD_1 && LD_2) tgs = "s11"
    else if ((LD_1 && !LD_2 && CAST_1) || (!LD_1 && LD_2 && CAST_2)) tgs = "s10"
    else if ((!LD_1 && LD_2 && CAST_1) || (LD_1 && !LD_2 && CAST_2)) tgs = "s01"
    else if ((LD_1 && !LD_2)) tgs = "s10"
    else if ((!LD_1 && LD_2)) tgs = "s01"
    else tgs = "s00"


    return {
      name: "МНЛЗ-2",
      flowSpeed: Math.round(((mldTk * exitWidth * stlHot) / 1000000000) * + castingSpeed.Value * 60) + "",
      heatId: heatId.Value,
      series: series.Value,
      heatStart,
      heatTime,
      castingSpeed: Math.round(+castingSpeed.Value * 100) / 100 + "",
      streamCast: summary.filter(s => s.Tag === "COM_BS_CAST_MODE")[0].Value !== "0",
      tgs,

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
      name: `ВД-${num}поз`,
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