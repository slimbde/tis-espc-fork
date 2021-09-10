import { Param } from "models/types/Param"
import ParamDbHandler from "./ParamDbHandler"


/**
 *  Staple generic DB interface
 */
export interface IDbHandler<T> {

  /**
   * retrieves a backend entity
   * @param id entity id
   */
  GetSingleAsync(id: number): Promise<T>
  /**
   * retrieves all entities from the backend
   */
  ListForAsync(report_counter: number): Promise<T[]>
  /**
   * alters an entity at the backend
   * @param obj the entity to alter
   */
  PutAsync(obj: T): Promise<number>
  /**
   * deletes backend entity by id
   * @param id entity id
   */
  DeleteAsync(obj: T): Promise<number>
  /**
   * creates a new backend entity
   * @param obj entity to create
   */
  PostAsync(obj: T): Promise<number>
}




const parHandler = new ParamDbHandler() as IDbHandler<Param>


export {
  parHandler,
}