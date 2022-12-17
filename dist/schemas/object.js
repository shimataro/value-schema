"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.object = void 0;
var ObjectSchema_1 = require("../schemaClasses/ObjectSchema");
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
function object(rules) {
  if (rules === void 0) {
    rules = {};
  }
  return new ObjectSchema_1.ObjectSchema(rules);
}
exports.object = object;