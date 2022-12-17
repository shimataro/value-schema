"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.boolean = void 0;
var BooleanSchema_1 = require("../schemaClasses/BooleanSchema");
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
function boolean(rules) {
  if (rules === void 0) {
    rules = {};
  }
  return new BooleanSchema_1.BooleanSchema(rules);
}
exports.boolean = boolean;