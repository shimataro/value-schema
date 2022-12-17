"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numericString = exports.NUMERIC_STRING = void 0;
var NumericStringSchema_1 = require("../schemaClasses/NumericStringSchema");
var NumericStringSchema_2 = require("../schemaClasses/NumericStringSchema");
Object.defineProperty(exports, "NUMERIC_STRING", {
  enumerable: true,
  get: function () {
    return NumericStringSchema_2.NUMERIC_STRING;
  }
});
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
function numericString(rules) {
  if (rules === void 0) {
    rules = {};
  }
  return new NumericStringSchema_1.NumericStringSchema(rules);
}
exports.numericString = numericString;