import moment from "moment";

export const MetallurgicalDate = () => moment().isAfter(moment().format("YYYY-MM-DD") + " 19:30:00") ? moment().startOf("day").add(1, "day").format("YYYY-MM-DD") : moment().startOf("day").format("YYYY-MM-DD")