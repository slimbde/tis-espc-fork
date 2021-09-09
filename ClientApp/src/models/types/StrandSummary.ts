export type StrandsInfo = {
  [key: string]: StrandSummary
}


export type StrandSummary = {
  STRAND_NO: string
  TECH_PROGRAM_ID: string
  COOL_PROGRAM_ID: string
  QCS_PROGRAM_ID: string
  MLD_ID: string
  START_DATE: string
  STOP_DATE: string
  TUNDISH_STRAND_START_WGT: string
  TUNDISH_STRAND_STOPPING_WGT: string
  MOULD_CAST_POWDER_TYPE: string
  TOT_PROD: string
  TOT_PROD_LEN: string
  HEAT_CROP_LENGHT: string
  HEAT_CROP_WEIGHT: string
  TAIL_CROP_LENGHT: string
  TAIL_CROP_WEIGHT: string
}


const decoder = (param: keyof StrandSummary) => {
  switch (param) {
    case "STRAND_NO": return "Номер ручья"
    case "TECH_PROGRAM_ID": return "Техническая программа"
    case "COOL_PROGRAM_ID": return "Программа охлаждения"
    case "QCS_PROGRAM_ID": return "Программа качества"
    case "MLD_ID": return "Кристаллизатор"
    case "START_DATE": return "Время начала разливки"
    case "STOP_DATE": return "Время окончания порезки"
    case "TUNDISH_STRAND_START_WGT": return "Вес пром-ковша при старте разливки [тонн]"
    case "TUNDISH_STRAND_STOPPING_WGT": return "Вес пром-ковша при окончании разливки [тонн]"
    case "MOULD_CAST_POWDER_TYPE": return "Тип ШОС"
    case "TOT_PROD": return "Количество заготовок"
    case "TOT_PROD_LEN": return "Вес заготовок [тонн]"
    case "HEAT_CROP_LENGHT": return "Головная обрезь [мм]"
    case "HEAT_CROP_WEIGHT": return "Головная обрезь [кг]"
    case "TAIL_CROP_LENGHT": return "Хвостовая обрезь [мм]"
    case "TAIL_CROP_WEIGHT": return "Хвостовая обрезь [кг]"
    default: return param
  }
}

export default decoder