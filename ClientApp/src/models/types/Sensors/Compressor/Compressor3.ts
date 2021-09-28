
export enum Compressor3AnalogCompressorSensors {
  CMP_WS_C3_Act_pressure,
  CMP_WS_C3_Temp_of_air,

  CMP_WS_C3_Time_work,
  CMP_WS_C3_Time_work_LOAD,
  CMP_WS_C3_Num_motor_start,
  CMP_WS_C3_Time_work_REG,
  CMP_WS_C3_Relay_load,
  CMP_WS_C3_Status_compr_coded,

  CMP_WS_C3_dP_oil_separator1,
  CMP_WS_C3_dP_oil_separator2,
  CMP_WS_C3_dP_air_filter,
  CMP_WS_C3_Temp_of_ambient1,
  CMP_WS_C3_Temp_of_ambient2,
  CMP_WS_C3_Temp_separator1,
  CMP_WS_C3_Temp_separator2,
  CMP_WS_C3_P_oil_Step1,
  CMP_WS_C3_P_oil_Step2,
  CMP_WS_C3_dP_oil_injection
}

export enum Compressor3DiskrCompressorSensors {
  CMP_BS_C3_Compressor_STOP,
  CMP_BS_C3_EMG_STOP,

  CMP_BS_C3_Compressor_MANUAL,
  CMP_BS_C3_Compressor_AUTO,
  CMP_BS_C3_Compressor_LOCAL,
  CMP_BS_C3_Compressor_REMOTE,
  CMP_BS_C3_Compressor_UNLOAD,
  CMP_BS_C3_Compressor_LOAD,
  CMP_BS_C3_Failure_compress_OUT,
  CMP_BS_C3_Warning_compress_OUT,
}

export enum Compressor3OnOffCompressorSensors {
  CMP_BS_C3_Remote_STR_STP,
  CMP_BS_C3_Remote_Load_Unload,
  CMP_BS_C3_Remote_change_pres,
  CMP_BS_C3_Overload_motor,
  CMP_BS_C3_KM_ON,
  CMP_BS_C3_DD1_DD2,
}
