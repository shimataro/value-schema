import { isDate } from "../../libs/types.mjs";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  if (rules.minValue === undefined) {
    return false;
  }
  const minValue = normalizeRules(rules.minValue);
  if (!isDate(values.output)) {
    return false;
  }
  if (values.output.getTime() >= minValue.value.getTime()) {
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
 * @param minValueLike minimum value
 * @returns normalized rules
 */
function normalizeRules(minValueLike) {
  if (isDate(minValueLike)) {
    return {
      adjusts: false,
      value: minValueLike
    };
  }
  return minValueLike;
}