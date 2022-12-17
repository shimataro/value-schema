import { isObject } from "../../libs/types.mjs";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param _rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, _rules, keyStack) {
  if (isObject(values.output)) {
    // already object
    return false;
  }
  return ValueSchemaError.raise(RULE.TYPE, values, keyStack);
}