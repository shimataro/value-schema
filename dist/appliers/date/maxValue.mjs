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
  if (rules.maxValue === undefined) {
    return false;
  }
  const maxValue = normalizeRules(rules.maxValue);
  if (!isDate(values.output)) {
    return false;
  }
  if (values.output.getTime() <= maxValue.value.getTime()) {
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
 * @param maxValueLike maximum value
 * @returns normalized rules
 */
function normalizeRules(maxValueLike) {
  if (isDate(maxValueLike)) {
    return {
      adjusts: false,
      value: maxValueLike
    };
  }
  return maxValueLike;
}