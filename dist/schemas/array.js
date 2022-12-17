"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.array = void 0;
var ArraySchema_1 = require("../schemaClasses/ArraySchema");
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
function array(rules) {
  if (rules === void 0) {
    rules = {};
  }
  return new ArraySchema_1.ArraySchema(rules);
}
exports.array = array;