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
  const minValue = normalizeRules(rules.minValue);
  // istanbul ignore next
  if (!isNumber(values.output)) {
    return false;
  }
  if (values.output >= minValue.value) {
    return false;
  }
  if (minValue.adjusts) {
    values.output = minValue.value;
    return false;
  }
  return ValueSchemaError.raise(RULE.MIN_VALUE, values, keyStack);
}
/**
 * normalize rules
 * @param minValue minimum value
 * @returns normalized rules
 */
function normalizeRules(minValue) {
  const defaultRules = {
    value: Number.MIN_SAFE_INTEGER,
    adjusts: false
  };
  if (minValue === undefined) {
    return defaultRules;
  }
  if (isNumber(minValue)) {
    return {
      ...defaultRules,
      value: minValue
    };
  }
  return {
    ...defaultRules,
    ...minValue
  };
}