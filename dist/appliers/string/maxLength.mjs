import { isNumber, isString } from "../../libs/types.mjs";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  const maxLength = normalizeRules(rules.maxLength);
  // istanbul ignore next
  if (!isString(values.output)) {
    return false;
  }
  if (values.output.length <= maxLength.length) {
    return false;
  }
  if (maxLength.trims !== undefined && maxLength.trims) {
    values.output = values.output.substr(0, maxLength.length);
    return false;
  }
  return ValueSchemaError.raise(RULE.MAX_LENGTH, values, keyStack);
}
/**
 * normalize rules
 * @param maxLength maximum length
 * @returns normalized rules
 */
function normalizeRules(maxLength) {
  const defaultRules = {
    length: Number.MAX_SAFE_INTEGER,
    trims: false
  };
  if (maxLength === undefined) {
    return defaultRules;
  }
  if (isNumber(maxLength)) {
    return {
      ...defaultRules,
      length: maxLength
    };
  }
  return {
    ...defaultRules,
    ...maxLength
  };
}