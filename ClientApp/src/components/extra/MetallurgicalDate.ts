import moment from "moment";

export const MetallurgicalDate = () => moment().isAfter(moment().format("YYYY-MM-DD") + " 19:30:00") ? moment().startOf("day").add(1, "day").format("YYYY-MM-DD") : moment().startOf("day").format("YYYY-MM-DD")


export const MetallurgicalRange = (date: string) => {
  const dt = date.slice(0, 19)
  const start = moment(dt).startOf("day").subtract(4.5, "hours")
  const middle = moment(dt).startOf("day").add(7.5, "hours")
  const end = moment(dt).startOf("day").add(19.5, "hours")

  return [start, middle, end]
}