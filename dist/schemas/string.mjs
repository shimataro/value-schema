import { StringSchema } from "../schemaClasses/StringSchema.mjs";
export { STRING } from "../schemaClasses/StringSchema.mjs";
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function string(rules = {}) {
  return new StringSchema(rules);
}