import { NumericStringSchema } from "../schemaClasses/NumericStringSchema.mjs";
export { NUMERIC_STRING } from "../schemaClasses/NumericStringSchema.mjs";
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function numericString(rules = {}) {
  return new NumericStringSchema(rules);
}