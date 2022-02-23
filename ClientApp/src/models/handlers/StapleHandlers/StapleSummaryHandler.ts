import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo";
import { AgregateState } from "models/types/Agregates/Staples/AgregateState";
import { AgregateSummary } from "models/types/Agregates/Staples/AgregateSummary";
import { AKOSAgregateInfo } from "models/types/Agregates/Staples/AKOSAgregateInfo";
import { CCMAgregateInfo } from "models/types/Agregates/Staples/CCMAgregateInfo";
import { Chemical } from "models/types/Agregates/Staples/Chemical";
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
    const heatTime = dspSummary.filter(s => s.Tag === "HEAT_TIME")[0].Value
    const heatStart = dspSummary.filter(s => s.Tag === "HEAT_START")[0].Value
    const heatEnd = dspSummary.filter(s => s.Tag === "HEAT_END")[0].Value
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


    let state = AgregateState.IDLE                  // Холодный простой
    const stateCode = +dspSummary.filter(s => s.Tag === "STATE")[0].Value

    switch (stateCode) {
      case 1:                                       // Плавление завалки
      case 2:                                       // Плавление первой подвалки
      case 3:                                       // Плавление второй подвалки
      case 4: state = AgregateState.PROCESS; break; // Доводка металла
      case 5: state = AgregateState.HOTIDLE; break; // Горячий простой
      default: break;
    }

    const angle = dspSummary.filter(s => s.Tag === "ANGLE")[0].Value
    const flushSteel = +angle > 5
    const flushSlag = +angle < -5

    const gas = []
    gas.push(dspSummary.filter(s => s.Tag === "GAS_SFG1")[0].Value)
    gas.push(dspSummary.filter(s => s.Tag === "GAS_SFG2")[0].Value)
    gas.push(dspSummary.filter(s => s.Tag === "GAS_SFG3")[0].Value)
    gas.push(dspSummary.filter(s => s.Tag === "GAS_SFG4")[0].Value)
    gas.push(dspSummary.filter(s => s.Tag === "GAS_SFG5")[0].Value)
    gas.push(dspSummary.filter(s => s.Tag === "GAS_MF")[0].Value)
    gas.push(dspSummary.filter(s => s.Tag === "GAS_PK")[0].Value)
    gas.push(dspSummary.filter(s => s.Tag === "GAS_SUMM")[0].Value)

    const chemicalKey = dspSummary.filter(s => s.Tag === "CHEMICAL_KEY")[0].Value
    const chemicalNums = dspSummary.filter(s => s.Tag === "CHEMICAL_NUMS")[0].Value.split(";")
    const chemicalTimes = dspSummary.filter(s => s.Tag === "CHEMICAL_TIMES")[0].Value.split(";")
    const chemicals: Chemical[] = chemicalNums.map((num, idx) => ({
      num,
      time: chemicalTimes[idx],
      elements: dspSummary.filter(s => s.Tag === `CHEMICAL_${idx}`)[0].Value
    }))

    const update = dspSummary.filter(s => s.Tag === "$DateTime")[0]


    return {
      name: "ДСП",
      heatId: heatId.Value,
      steelGrade: steelGrade.Value,
      energy,
      heatStart,
      eeHeatActive,
      heatTime,
      heatEnd,
      heatCurrentTime,
      chemicalKey,
      chemicals,
      state,
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
      flushSteel,
      flushSlag,
      gas,

      dataDelayed: this.isDataDelayed(update),
      lastUpdate: moment().format("YYYY-MM-DD HH:mm:ss"),
    }
  }

  GetAKOSInfo = (): AKOSAgregateInfo => {
    const summary: AgregateSummary[] = this.summary.filter(s => s.Name === "EAKP-2")

    const heatId = summary.filter(s => s.Tag === "HEAT_ID")[0].Value
    const heatTab = summary.filter(s => s.Tag === "HEAT_TAB")[0].Value
    const ladleId = summary.filter(s => s.Tag === "LADLE_ID")[0].Value
    const steelGrade = summary.filter(s => s.Tag === "STEEL_GRADE")[0].Value
    const heatWeight = summary.filter(s => s.Tag === "HEAT_WEIGHT")[0].Value
    const stoikSvod = summary.filter(s => s.Tag === "STOIK_SVOD")[0].Value
    const heatCurrentTime = summary.filter(s => s.Tag === "HEAT_CURRENT_TIME")[0].Value
    const argonTime = summary.filter(s => s.Tag === "ARGON_TIME")[0].Value
    const argonTimeDown = summary.filter(s => s.Tag === "ARGON_TIME_DOWN")[0].Value
    const argonDelay = summary.filter(s => s.Tag === "ARGON_DELAY")[0].Value
    const eeHeatActive = summary.filter(s => s.Tag === "EE_HEAT_ACTIVE")[0].Value
    const argonFlow = summary.filter(s => s.Tag === "ARGON_FLOW")[0].Value
    const argonFlowDown = summary.filter(s => s.Tag === "ARGON_FLOW_DOWN")[0].Value
    const argonPressure = summary.filter(s => s.Tag === "ARGON_PRESSURE")[0].Value
    const argonFlowInst = summary.filter(s => s.Tag === "ARGON_FLOW_INST")[0].Value
    const argonFlowInstPwd = summary.filter(s => s.Tag === "ARGON_FLOW_INST_PWD")[0].Value
    const steamPipeVacuum = summary.filter(s => s.Tag === "STEAM_PIPE_VACUUM")[0].Value
    const currentTemp = summary.filter(s => s.Tag === "CURRENT_TEMP")[0].Value
    const samples = summary.filter(s => s.Tag === "SAMPLES")[0].Value
    const heatEnd = summary.filter(s => s.Tag === "HEAT_END")[0].Value


    // Холодный простой
    let initializer: boolean[] = [false, false, false, true]
    let state = AgregateState.IDLE

    const stateCode = +summary.filter(s => s.Tag === "STATE")[0].Value

    if (stateCode === 1) {  // Горячий простой
      initializer = [false, false, true, false]
      state = AgregateState.HOTIDLE
    }
    if (stateCode === 2) {  // Продувка
      initializer = [false, true, true, false]
      state = AgregateState.PROCESS
    }
    if (stateCode === 3) {  // Под током
      initializer = [true, false, true, false]
      state = AgregateState.PROCESS
    }
    if (stateCode === 4) {  // Ток и продувка
      initializer = [true, true, true, false]
      state = AgregateState.PROCESS
    }

    const [energy, argon, capdown, empty] = initializer


    const chemicalKey = summary.filter(s => s.Tag === "CHEMICAL_KEY")[0].Value
    const chemicalNums = summary.filter(s => s.Tag === "CHEMICAL_NUMS")[0].Value.split(";")
    const chemicalTimes = summary.filter(s => s.Tag === "CHEMICAL_TIMES")[0].Value.split(";")
    const chemicals: Chemical[] = chemicalNums.map((num, idx) => ({
      num,
      time: chemicalTimes[idx],
      elements: summary.filter(s => s.Tag === `CHEMICAL_${idx}`)[0].Value
    }))

    const update = summary.filter(s => s.Tag === "$DateTime")[0]

    return {
      name: "АКОС",
      heatId,
      heatTab,
      heatEnd,
      ladleId,
      steelGrade,
      heatWeight,
      stoikSvod,
      heatCurrentTime,
      argonTime,
      argonTimeDown,
      argonDelay,
      eeHeatActive,
      argonFlow,
      argonFlowDown,
      argonPressure,
      argonFlowInst,
      argonFlowInstPwd,
      steamPipeVacuum,
      currentTemp,
      samples,
      chemicalKey,
      chemicals,
      state,
      argon,
      energy,
      capdown,
      empty,

      dataDelayed: this.isDataDelayed(update),
      lastUpdate: moment().format("YYYY-MM-DD HH:mm:ss"),
    }
  }

  GetAKPInfo = (num: 1 | 2): AgregateInfo => {
    const summary: AgregateSummary[] = this.summary.filter(s => s.Name === `EAKP-1${num}`)

    const update = summary.filter(s => s.Tag === "$DateTime")[0]
    const heatId = summary.filter(s => s.Tag === "HEAT_ID")[0]
    const steelGrade = summary.filter(s => s.Tag === "STEEL_GRADE")[0]
    const activeTank = +summary.filter(s => s.Tag === "TANK_ID")[0].Value
    const argonFlow = summary.filter(s => s.Tag === "ARGON_FLOW_DOWN")[0].Value
    const currentTemp = summary.filter(s => s.Tag === "CURRENT_TEMP")[0].Value
    const heatCurrentTime = summary.filter(s => s.Tag === "HEAT_CURRENT_TIME")[0].Value
    const heatWeight = summary.filter(s => s.Tag === "HEAT_WEIGHT")[0].Value
    const heatStart = summary.filter(s => s.Tag === "HEAT_START")[0].Value
    const ladleId = summary.filter(s => s.Tag === "LADLE_ID")[0].Value
    const heatEnd = summary.filter(s => s.Tag === "HEAT_END")[0].Value


    // Холодный простой
    let initializer: boolean[] = [false, false, false, true]
    let state = AgregateState.IDLE

    const stateCode = +summary.filter(s => s.Tag === "STATE")[0].Value

    if (activeTank === num) {
      if (stateCode === 1) {  // Горячий простой
        initializer = [false, false, true, false]
        state = AgregateState.HOTIDLE
      }
      if (stateCode === 2) {  // Продувка
        initializer = [false, true, true, false]
        state = AgregateState.PROCESS
      }
      if (stateCode === 3) {  // Под током
        initializer = [true, false, true, false]
        state = AgregateState.PROCESS
      }
      if (stateCode === 4) {  // Ток и продувка
        initializer = [true, true, true, false]
        state = AgregateState.PROCESS
      }
    }

    const [energy, argon, capdown, empty] = initializer


    return {
      name: `АКП2-${num}поз`,
      heatId: heatId.Value.replace(/[^a-zA-Zа-яА-Я0-9]/g, ""),
      steelGrade: steelGrade.Value.replace(/[^a-zA-Zа-яА-Я0-9]/g, ""),
      argonFlow,
      currentTemp,
      heatCurrentTime,
      heatWeight,
      heatEnd,
      ladleId,
      empty,
      argon,
      energy,
      capdown,
      state,
      heatStart,

      dataDelayed: this.isDataDelayed(update),
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
    const heatEnd = summary.filter(s => s.Tag === "HEAT_END")[0].Value
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

    // Холодный простой
    let initializer: any[] = ["s00", false]
    let state = AgregateState.IDLE

    const stateCode = +summary.filter(s => s.Tag === "STATE")[0].Value

    if (stateCode === 1) {  // Начало разливки
      initializer = ["s10", false]
      state = AgregateState.HOTIDLE
    }
    if (stateCode === 2) {  // Разливка
      initializer = ["s10", true]
      state = AgregateState.PROCESS
    }
    if (stateCode === 3) {  // Смена СК
      initializer = ["s01", true]
      state = AgregateState.PROCESS
    }
    if (stateCode === 4) {  // Смена СК
      initializer = ["s11", true]
      state = AgregateState.PROCESS
    }

    const [tgs, streamCast] = initializer

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
      heatEnd,
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
      state,
      steelGrade,
      //streamCast: +flowSpeed > 0.05 && +castingSpeed > 0.05,
      streamCast,
      tgs,
      teamId,
      tundishCar,
      tundishId: `${tundishId} (${tundishStoik})`,
      tundishShos,
      tundishStoik,

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
    const heatEnd = summary.filter(s => s.Tag === "HEAT_END")[0].Value
    const steelGrade = summary.filter(s => s.Tag === "STEEL_GRADE")[0].Value
    const heatWeight = summary.filter(s => s.Tag === "HEAT_WEIGHT")[0].Value
    const castedMeters = summary.filter(s => s.Tag === "CASTED_METERS")[0].Value
    const castedTonns = summary.filter(s => s.Tag === "CASTED_TONNS")[0].Value
    const slabThickness = summary.filter(s => s.Tag === "SLAB_THICKNESS")[0].Value
    const slabWidth = summary.filter(s => s.Tag === "SLAB_WIDTH")[0].Value
    const currentTemp = summary.filter(s => s.Tag === "CURRENT_TEMP")[0].Value

    // Холодный простой
    let initializer: any[] = ["s00", false]
    let state = AgregateState.IDLE

    const stateCode = +summary.filter(s => s.Tag === "STATE")[0].Value

    if (stateCode === 1) {  // Начало разливки
      initializer = ["s10", false]
      state = AgregateState.HOTIDLE
    }
    if (stateCode === 2) {  // Разливка
      initializer = ["s10", true]
      state = AgregateState.PROCESS
    }
    if (stateCode === 3) {  // Смена СК
      initializer = ["s01", true]
      state = AgregateState.PROCESS
    }
    if (stateCode === 4) {  // Смена СК
      initializer = ["s11", true]
      state = AgregateState.PROCESS
    }

    const [tgs, streamCast] = initializer

    const mldTk = +summary.filter(s => s.Tag === "L2S_WM_COM_MLD_TK")[0].Value
    const exitWidth = +summary.filter(s => s.Tag === "MWA_WS_EXIT_WIDTH")[0].Value
    const stlHot = +summary.filter(s => s.Tag === "L2S_WM_TRK_STL_HOT")[0].Value

    //const LD_1 = summary.filter(s => s.Tag === "TGS_BS_ARM1_LD_PRE")[0].Value === "1"
    //const LD_2 = summary.filter(s => s.Tag === "TGS_BS_ARM2_LD_PRE")[0].Value === "1"
    //const CAST_1 = summary.filter(s => s.Tag === "TGS_BS_A1_CAST_POS")[0].Value === "1"
    //const CAST_2 = summary.filter(s => s.Tag === "TGS_BS_A2_CAST_POS")[0].Value === "1"

    //let tgs
    //if (LD_1 && LD_2) tgs = "s11"
    //else if ((LD_1 && !LD_2 && CAST_1) || (!LD_1 && LD_2 && CAST_2)) tgs = "s10"
    //else if ((!LD_1 && LD_2 && CAST_1) || (LD_1 && !LD_2 && CAST_2)) tgs = "s01"
    //else if ((LD_1 && !LD_2)) tgs = "s10"
    //else if ((!LD_1 && LD_2)) tgs = "s01"
    //else tgs = "s00"


    return {
      name: "МНЛЗ-2",
      flowSpeed: Math.round(((mldTk * exitWidth * stlHot) / 1000000000) * + castingSpeed.Value * 60) + "",
      heatId: heatId.Value,
      series: series.Value,
      heatStart,
      heatTime,
      heatEnd,
      heatWeight,
      castingSpeed: Math.round(+castingSpeed.Value * 100) / 100 + "",
      steelGrade,
      castedMeters,
      castedTonns,
      slabWidth,
      slabThickness,
      currentTemp,
      //streamCast: summary.filter(s => s.Tag === "COM_BS_CAST_MODE")[0].Value !== "0",
      streamCast,
      tgs,
      state,

      dataDelayed: this.isDataDelayed(update),
      lastUpdate: update.UpdatePoint,
    }
  }

  GetVDInfo = (num: 1 | 2): AgregateInfo => {
    const summary: AgregateSummary[] = this.summary.filter(s => s.Name === `VD-2${num}`)

    const update = summary.filter(s => s.Tag === "$DateTime")[0]
    const heatId = summary.filter(s => s.Tag === "HEAT_ID")[0]
    const steelGrade = summary.filter(s => s.Tag === "STEEL_GRADE")[0]
    const activeTank = +summary.filter(s => s.Tag === "TANK_ID")[0].Value
    const currentTemp = summary.filter(s => s.Tag === "CURRENT_TEMP")[0].Value
    const heatWeight = summary.filter(s => s.Tag === "HEAT_WEIGHT")[0].Value
    const heatStart = summary.filter(s => s.Tag === "HEAT_START")[0].Value
    const ladleId = summary.filter(s => s.Tag === "LADLE_ID")[0].Value
    const vacuumTime = summary.filter(s => s.Tag === "VACUUM_TIME")[0].Value
    const vacuumPressure = summary.filter(s => s.Tag === "VACUUM_PRESSURE")[0].Value
    const heatEnd = summary.filter(s => s.Tag === "HEAT_END")[0].Value

    // Холодный простой
    let initializer: boolean[] = [false, false, false, true]
    let state = AgregateState.IDLE

    const stateCode = +summary.filter(s => s.Tag === "STATE")[0].Value

    if (activeTank === num) {
      if (stateCode === 1) {  // Горячий простой
        initializer = [false, false, true, false]
        state = AgregateState.HOTIDLE
      }
      if (stateCode === 2) {  // Продувка
        initializer = [false, true, true, false]
        state = AgregateState.PROCESS
      }
      if (stateCode === 3) {  // Вакуум
        initializer = [true, false, true, false]
        state = AgregateState.PROCESS
      }
      if (stateCode === 4) {  // Вакуум и продувка
        initializer = [true, true, true, false]
        state = AgregateState.PROCESS
      }
    }

    const [vacuum, argon, capdown, empty] = initializer


    return {
      name: `ВД-${num}поз`,
      heatId: heatId.Value.replace(/[^a-zA-Zа-яА-Я0-9]/g, ""),
      steelGrade: steelGrade.Value.replace(/[^a-zA-Zа-яА-Я0-9]/g, ""),
      currentTemp,
      heatWeight,
      ladleId,
      vacuumTime,
      vacuumPressure,
      argon,
      capdown,
      vacuum,
      empty,
      state,
      heatStart,
      heatEnd,

      dataDelayed: this.isDataDelayed(update),
      lastUpdate: moment().format("YYYY-MM-DD HH:mm:ss"),
    }
  }
}