import { DateSchema } from "../schemaClasses/DateSchema.mjs";
export { DATE } from "../schemaClasses/DateSchema.mjs";
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function date(rules = {}) {
  return new DateSchema(rules);
}