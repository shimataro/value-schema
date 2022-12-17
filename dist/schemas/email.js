"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.email = void 0;
var EmailSchema_1 = require("../schemaClasses/EmailSchema");
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
function email(rules) {
  if (rules === void 0) {
    rules = {};
  }
  return new EmailSchema_1.EmailSchema(rules);
}
exports.email = email;