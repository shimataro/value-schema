"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.number = exports.NUMBER = void 0;
var NumberSchema_1 = require("../schemaClasses/NumberSchema");
var NumberSchema_2 = require("../schemaClasses/NumberSchema");
Object.defineProperty(exports, "NUMBER", {
  enumerable: true,
  get: function () {
    return NumberSchema_2.NUMBER;
  }
});
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
function number(rules) {
  if (rules === void 0) {
    rules = {};
  }
  return new NumberSchema_1.NumberSchema(rules);
}
exports.number = number;