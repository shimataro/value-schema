"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTo = void 0;
var applySchemaObjectCore_1 = require("../../libs/applySchemaObjectCore");
var BaseSchema_1 = require("../../schemaClasses/BaseSchema");
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack path to key that caused error
 * @returns ends applying
 * @throws {ValueSchemaError}
 */
function applyTo(values, rules, keyStack) {
  if (rules.schemaObject === undefined) {
    return false;
  }
  values.output = (0, applySchemaObjectCore_1.applySchemaObjectCore)(rules.schemaObject, values.output, BaseSchema_1.onErrorDefault, BaseSchema_1.onFinishDefault, keyStack);
  return false;
}
exports.applyTo = applyTo;