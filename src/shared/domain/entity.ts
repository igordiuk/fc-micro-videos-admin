import { ValueObject } from "./value-objetc";

export abstract class Entity {
  abstract get entity_id(): ValueObject;
  abstract toJSON(): any;
}
