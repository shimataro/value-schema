import { EnumerationSchema } from "../schemaClasses/EnumerationSchema.mjs";
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function enumeration(rules) {
  return new EnumerationSchema(rules);
}