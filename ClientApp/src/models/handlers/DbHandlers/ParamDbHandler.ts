import { Param } from "models/types/Param";
import TDbHandler from "./TDbHandler";


export default class ParamDbHandler extends TDbHandler<Param> {

  constructor() { super("Param") }

}
