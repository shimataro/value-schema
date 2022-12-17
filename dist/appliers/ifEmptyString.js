"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTo = void 0;
var ValueSchemaError_1 = require("../libs/ValueSchemaError");
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, keyStack) {
  if (values.output !== "") {
    return false;
  }
  if (rules.ifEmptyString !== undefined) {
    values.output = rules.ifEmptyString;
    return true;
  }
  return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.EMPTY_STRING, values, keyStack);
}
exports.applyTo = applyTo;