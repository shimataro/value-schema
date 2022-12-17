import { applySchemaObjectCore } from "../../libs/applySchemaObjectCore.mjs";
import { onErrorDefault, onFinishDefault } from "../../schemaClasses/BaseSchema.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack path to key that caused error
 * @returns ends applying
 * @throws {ValueSchemaError}
 */
export function applyTo(values, rules, keyStack) {
  if (rules.schemaObject === undefined) {
    return false;
  }
  values.output = applySchemaObjectCore(rules.schemaObject, values.output, onErrorDefault, onFinishDefault, keyStack);
  return false;
}