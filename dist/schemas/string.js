"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = exports.STRING = void 0;
var StringSchema_1 = require("../schemaClasses/StringSchema");
var StringSchema_2 = require("../schemaClasses/StringSchema");
Object.defineProperty(exports, "STRING", {
  enumerable: true,
  get: function () {
    return StringSchema_2.STRING;
  }
});
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
function string(rules) {
  if (rules === void 0) {
    rules = {};
  }
  return new StringSchema_1.StringSchema(rules);
}
exports.string = string;