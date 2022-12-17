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
exports.applyTo = void 0;
var types_1 = require("../../libs/types");
var ValueSchemaError_1 = require("../../libs/ValueSchemaError");
var BaseSchema_1 = require("../../schemaClasses/BaseSchema");
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, keyStack) {
  var each = normalizeRules(rules.each);
  if (each === undefined) {
    return false;
  }
  // istanbul ignore next
  if (!(0, types_1.isArray)(values.output)) {
    return false;
  }
  var adjustedValues = [];
  for (var idx = 0; idx < values.output.length; idx++) {
    var element = values.output[idx];
    // A trick in order to call _applyTo() private method from the outside (like "friend")
    try {
      var adjustedValue = each.schema["_applyTo"](element, function (err) {
        if (each.ignoresErrors) {
          throw Error("!IGNORE!");
        }
        return ValueSchemaError_1.ValueSchemaError.raise(err.rule, values, err.keyStack);
      }, __spreadArray(__spreadArray([], keyStack, true), [idx], false));
      adjustedValues.push(adjustedValue);
    } catch (err) {
      if (err instanceof Error && err.message === "!IGNORE!") {
        // ignore
        continue;
      }
      throw err;
    }
  }
  // replace with adjusted values
  values.output = adjustedValues;
  return false;
}
exports.applyTo = applyTo;
/**
 * normalize rules
 * @param each each
 * @returns normalized rules
 */
function normalizeRules(each) {
  if (each === undefined) {
    return;
  }
  if (each instanceof BaseSchema_1.BaseSchema) {
    return {
      schema: each,
      ignoresErrors: false
    };
  }
  return each;
}