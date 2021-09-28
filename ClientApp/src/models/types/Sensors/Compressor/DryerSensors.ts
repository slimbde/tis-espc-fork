
export enum DryerAnalogCompressorSensors {
  CMP_WS_Des_Pres_col_A,
  CMP_WS_Des_Pres_col_B,
  CMP_WS_Des_Temp_UP_col_A,
  CMP_WS_Des_Temp_UP_col_B,
  CMP_WS_Des_Temp_OUT_air,
  CMP_WS_Des_Pres_OUT_air,

  CMP_WS_Des_Time_work,
  CMP_WS_Des_Time_work_REG,
  CMP_WS_Des_Time_program,
  CMP_WS_Des_Program_time,
  CMP_WS_Des_Halftime_work,
  CMP_WS_Des_Halftime_work_Prog,
  CMP_WS_Des_Regen_cycle_A,
  CMP_WS_Des_Regen_cycle_B,
  CMP_WS_Des_Status_compr_coded,
}

export enum DryerDiskrCompressorSensors {
  CMP_BS_Des_LOW_IN_pressure,
  CMP_BS_Des_Warning_compress_OUT,
  CMP_BS_Des_Failure_compress_OUT,

  CMP_BS_Des_Compressor_STOP,
  CMP_BS_Des_EMG_STOP,
  CMP_BS_Des_Compressor_MANUAL,
  CMP_BS_Des_Compressor_AUTO,
  CMP_BS_Des_Compressor_LOCAL,
  CMP_BS_Des_Compressor_REMOTE,
  CMP_BS_Des_Compressor_UNLOAD,
  CMP_BS_Des_Compressor_LOAD,

  CMP_BS_Des_Reg_valv_A_OPN,
  CMP_BS_Des_Reg_valv_B_OPN,
  CMP_BS_Des_In_valv_B_OPN,
  CMP_BS_Des_In_valv_A_OPN,
}

export enum DryerOnOffCompressorSensors {
  CMP_BS_Des_Remote_STR_STP,
  CMP_BS_Des_Fuse_heater,
  CMP_BS_Des_Fuse_Motor,
  CMP_BS_Des_FAULT_blowoff_A,
  CMP_BS_Des_FAULT_blowoff_B,
  CMP_BS_Des_FAULT_pressurize,
  CMP_BS_Des_OverHeat_A,
  CMP_BS_Des_OverHeat_B,
}