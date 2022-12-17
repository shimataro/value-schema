import { isString } from "../../libs/types.mjs";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.mjs";
const PATTERN_WITH_TZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const PATTERN_WITHOUT_TZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(.\d+)?)?$/;
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  const normalizedRules = {
    iso8601: {
      defaultTimezone: ""
    },
    ...rules
  };
  if (!isString(values.output)) {
    return false;
  }
  const normalizedValue = normalize(values.output, normalizedRules.iso8601);
  if (normalizedValue === null) {
    // failed to normalize
    return ValueSchemaError.raise(RULE.PATTERN, values, keyStack);
  }
  values.output = new Date(normalizedValue);
  return false;
}
/**
 * normalize date format
 * @param value value to normalize
 * @param iso8601 rules
 * @returns normalized value
 */
function normalize(value, iso8601) {
  if (PATTERN_WITH_TZ.test(value)) {
    // valid format!
    return value;
  }
  const normalizedIso8601 = {
    defaultTimezone: "",
    ...iso8601
  };
  if (normalizedIso8601.defaultTimezone === "") {
    // fails if default timezone is NOT specified
    return null;
  }
  if (!PATTERN_WITHOUT_TZ.test(value)) {
    // fails if not match with "no-timezone format"
    return null;
  }
  // append default timezone
  return `${value}${normalizedIso8601.defaultTimezone}`;
}