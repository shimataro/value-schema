import { EmailSchema } from "../schemaClasses/EmailSchema.mjs";
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function email(rules = {}) {
  return new EmailSchema(rules);
}