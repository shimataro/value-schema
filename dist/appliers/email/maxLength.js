"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTo = void 0;
var types_1 = require("../../libs/types");
var ValueSchemaError_1 = require("../../libs/ValueSchemaError");
var MAX_LENGTH_LOCAL = 64;
var MAX_LENGTH_DOMAIN = 255;
var MAX_LENGTH = MAX_LENGTH_LOCAL + 1 + MAX_LENGTH_DOMAIN; // local-part + "@" + domain-part
/**
 * apply schema
 * @param values input/output values
 * @param _rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, _rules, keyStack) {
  // istanbul ignore next
  if (!(0, types_1.isString)(values.output)) {
    return false;
  }
  if (values.output.length > MAX_LENGTH) {
    ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.MAX_LENGTH, values, keyStack);
  }
  var atPosition = values.output.lastIndexOf("@");
  if (atPosition > MAX_LENGTH_LOCAL) {
    // local-part length error
    ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.MAX_LENGTH, values, keyStack);
  }
  if (values.output.length - atPosition - 1 > MAX_LENGTH_DOMAIN) {
    // domain-part length error
    ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.MAX_LENGTH, values, keyStack);
  }
  return false;
}
exports.applyTo = applyTo;