import moment from "moment";

export const MinToTime = (min: string) => moment().startOf("day").add(min, "minutes").format("HH:mm:ss")