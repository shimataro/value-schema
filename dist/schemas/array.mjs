import { ArraySchema } from "../schemaClasses/ArraySchema.mjs";
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function array(rules = {}) {
  return new ArraySchema(rules);
}