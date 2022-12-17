import { isNumber } from "../../libs/types.mjs";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  const maxValue = normalizeRules(rules.maxValue);
  // istanbul ignore next
  if (!isNumber(values.output)) {
    return false;
  }
  if (values.output <= maxValue.value) {
    return false;
  }
  if (maxValue.adjusts) {
    values.output = maxValue.value;
    return false;
  }
  return ValueSchemaError.raise(RULE.MAX_VALUE, values, keyStack);
}
/**
 * normalize rules
 * @param maxValue maximum value
 * @returns normalized rules
 */
function normalizeRules(maxValue) {
  const defaultRules = {
    value: Number.MAX_SAFE_INTEGER,
    adjusts: false
  };
  if (maxValue === undefined) {
    return defaultRules;
  }
  if (isNumber(maxValue)) {
    return {
      ...defaultRules,
      value: maxValue
    };
  }
  return {
    ...defaultRules,
    ...maxValue
  };
}