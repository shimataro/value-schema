"use strict";

var __spreadArray = this && this.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applySchemaObjectCore = void 0;
var types_1 = require("./types");
var ValueSchemaError_1 = require("./ValueSchemaError");
/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param onError error handler
 * @param onFinishWithError finish handler
 * @param keyStack path to key that caused error
 * @returns applied data
 */
function applySchemaObjectCore(schemaObject, data, onError, onFinishWithError, keyStack) {
  if (!(0, types_1.isObject)(data)) {
    var err = new ValueSchemaError_1.ValueSchemaError(ValueSchemaError_1.RULE.TYPE, data, keyStack);
    var result = onError(err);
    if (!(0, types_1.isObject)(result)) {
      throw err;
    }
    return result;
  }
  var appliedObject = {};
  var hasError = false;
  for (var _i = 0, _a = Object.keys(schemaObject); _i < _a.length; _i++) {
    var key = _a[_i];
    // A trick in order to call _applyTo() private method from the outside (like "friend")
    appliedObject[key] = schemaObject[key]["_applyTo"](data[key], errorHandler, __spreadArray(__spreadArray([], keyStack, true), [key], false));
  }
  if (hasError) {
    onFinishWithError();
  }
  return appliedObject;
  /**
   * error handler (to avoid "no-loop-func" error on eslint)
   * @param err error object
   * @returns error handler
   */
  function errorHandler(err) {
    hasError = true;
    return onError(err);
  }
}
exports.applySchemaObjectCore = applySchemaObjectCore;