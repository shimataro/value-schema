import { isArray } from "../../libs/types.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, _keyStack) {
  const normalizedRules = {
    joinsArray: false,
    ...rules
  };
  if (!normalizedRules.joinsArray) {
    return false;
  }
  // istanbul ignore next
  if (!isArray(values.output)) {
    return false;
  }
  values.output = values.output.join("");
  return false;
}