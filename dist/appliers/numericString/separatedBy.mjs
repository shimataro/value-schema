import { isString } from "../../libs/types.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, _keyStack) {
  if (rules.separatedBy === undefined) {
    return false;
  }
  // istanbul ignore next
  if (!isString(values.output)) {
    return false;
  }
  values.output = values.output.split(rules.separatedBy).join("");
  return false;
}