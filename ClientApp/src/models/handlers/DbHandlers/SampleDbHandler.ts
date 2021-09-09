import { Sample } from "models/types/Sample";
import TDbHandler from "./TDbHandler";


export default class SampleDbHandler extends TDbHandler<Sample> {

  constructor() { super("Sample") }

}
