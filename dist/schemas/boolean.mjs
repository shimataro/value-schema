import { BooleanSchema } from "../schemaClasses/BooleanSchema.mjs";
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function boolean(rules = {}) {
  return new BooleanSchema(rules);
}