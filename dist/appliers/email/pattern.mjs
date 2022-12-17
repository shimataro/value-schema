import { REGEXP_EMAIL } from "../../libs/regexp/email.mjs";
import * as pattern from "../string/pattern.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  const normalizedRules = {
    pattern: REGEXP_EMAIL,
    ...rules
  };
  return pattern.applyTo(values, normalizedRules, keyStack);
}