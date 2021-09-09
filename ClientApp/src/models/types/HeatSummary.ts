
export type HeatSummary = {
  HEAT_ID: string
  PO_ID: string
  STEEL_GRADE_ID: string
  PRACTICE_ID: string
  SEQ: string
  LADLE_ARRIVAL_TIME: string
  LADLE_OPEN_TIME: string
  LADLE_CLOSE_TIME: string
  HEAT_STOP_TIME: string
  LADLE_ID: string
  LADLE_TURRET_ARM_CODE: string
  //LADLE_LIFE: string
  LADLE_OPEN_WGT: string
  LADLE_CLOSE_WGT: string
  TUNDISH_ID: string
  TUNDISH_CAR_CODE: string
  //TUNDISH_LIFE: string
  TUNDISH_WGT_AT_LADLE_OPEN: string
  TUNDISH_SKULL_WGT: string
  TUNDISH_POWDER_TYPE: string
  TUNDISH_POWDER_WGT: string
  CAST_WGT: string
  TOTAL_BILLETS: string
  TOTAL_BILLETS_WGT: string
  CROP_WGT: string
  SAMPLES_WGT: string
  //YIELD: string
}


const decoder = (param: keyof HeatSummary) => {
  switch (param) {
    case "HEAT_ID": return "Номер плавки"
    case "PO_ID": return "Номер заказа"
    case "STEEL_GRADE_ID": return "Марка стали"
    case "PRACTICE_ID": return "Практика"
    case "SEQ": return "Номер в серии"
    case "LADLE_ARRIVAL_TIME": return "Время прибытия сталь-ковша"
    case "LADLE_OPEN_TIME": return "Время открытия сталь-ковша"
    case "LADLE_CLOSE_TIME": return "Время закрытия сталь-ковша"
    case "HEAT_STOP_TIME": return "Время окончания порезки"
    case "LADLE_ID": return "Номер стали ковша"
    case "LADLE_TURRET_ARM_CODE": return "Позиция поворотного стенда"
    case "LADLE_OPEN_WGT": return "Вес сталь-ковша при открытии [тонн]"
    case "LADLE_CLOSE_WGT": return "Вес сталь-ковша при закрытии [тонн]"
    case "TUNDISH_ID": return "Номер пром-ковша"
    case "TUNDISH_CAR_CODE": return "Номер тележки пром-ковша"
    case "TUNDISH_WGT_AT_LADLE_OPEN": return "Вес в ПК при открытии сталь-ковша [тонн]"
    case "TUNDISH_POWDER_TYPE": return "Тип ШОС для пром-ковша"
    case "TUNDISH_POWDER_WGT": return "Вес ШОС пром-ковша [кг]"
    case "CAST_WGT": return "Вес отлитого металла [тонн]"
    case "TOTAL_BILLETS": return "Всего заготовок"
    case "TOTAL_BILLETS_WGT": return "Вес заготовок [тонн]"
    case "CROP_WGT": return "Вес обрези [тонн]"
    case "SAMPLES_WGT": return "Вес темплетов [тонн]"
    default: return param
  }
}

export default decoder