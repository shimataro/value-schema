import { NumberSchema } from "../schemaClasses/NumberSchema.mjs";
export { NUMBER } from "../schemaClasses/NumberSchema.mjs";
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function number(rules = {}) {
  return new NumberSchema(rules);
}