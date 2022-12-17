import { ObjectSchema } from "../schemaClasses/ObjectSchema.mjs";
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function object(rules = {}) {
  return new ObjectSchema(rules);
}