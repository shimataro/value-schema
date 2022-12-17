import { isArray, isString } from "../../libs/types.mjs";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  if (isArray(values.output)) {
    // already array
    return false;
  }
  if (isString(values.output) && rules.separatedBy !== undefined) {
    values.output = values.output.split(rules.separatedBy);
    return false;
  }
  if (rules.toArray !== undefined && rules.toArray) {
    values.output = [values.output];
    return false;
  }
  return ValueSchemaError.raise(RULE.TYPE, values, keyStack);
}