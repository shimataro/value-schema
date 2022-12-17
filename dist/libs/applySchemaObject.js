"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applySchemaObject = void 0;
var applySchemaObjectCore_1 = require("./applySchemaObjectCore");
var BaseSchema_1 = require("../schemaClasses/BaseSchema");
/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param onError error handler
 * @param onFinishWithError finish handler
 * @returns applied data
 */
function applySchemaObject(schemaObject, data, onError, onFinishWithError) {
  if (onError === void 0) {
    onError = BaseSchema_1.onErrorDefault;
  }
  if (onFinishWithError === void 0) {
    onFinishWithError = BaseSchema_1.onFinishDefault;
  }
  return (0, applySchemaObjectCore_1.applySchemaObjectCore)(schemaObject, data, onError, onFinishWithError, []);
}
exports.applySchemaObject = applySchemaObject;