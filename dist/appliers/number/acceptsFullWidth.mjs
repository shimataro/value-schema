import * as string from "../../libs/string.mjs";
import { isString } from "../../libs/types.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, _keyStack) {
  const normalizedRules = {
    acceptsFullWidth: false,
    ...rules
  };
  if (!normalizedRules.acceptsFullWidth) {
    return false;
  }
  // istanbul ignore next
  if (!isString(values.output)) {
    return false;
  }
  values.output = string.toHalfWidth(values.output, /[０-９ａ-ｚＡ-Ｚ．＋－]+/g);
  return false;
}