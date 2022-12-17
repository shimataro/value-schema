"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTo = exports.PATTERN = void 0;
var types_1 = require("../../libs/types");
var ValueSchemaError_1 = require("../../libs/ValueSchemaError");
var email_1 = require("../../libs/regexp/email");
var ipv4_1 = require("../../libs/regexp/ipv4");
var ipv6_1 = require("../../libs/regexp/ipv6");
var uri_1 = require("../../libs/regexp/uri");
exports.PATTERN = {
  /** email address; compliant with RFC-5321/5322 */
  EMAIL: email_1.REGEXP_EMAIL,
  /** HTTP URI; compliant with RFC-3986 */
  HTTP: uri_1.REGEXP_HTTP,
  /** IPv4 format */
  IPV4: ipv4_1.REGEXP_IPV4,
  /** IPv6 format */
  IPV6: ipv6_1.REGEXP_IPV6,
  /** URI; compliant with RFC-3986 */
  URI: uri_1.REGEXP_URI,
  /** UUID format */
  UUID: /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i
};
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, keyStack) {
  if (rules.pattern === undefined) {
    return false;
  }
  // istanbul ignore next
  if (!(0, types_1.isString)(values.output)) {
    return false;
  }
  if (rules.pattern.test(values.output)) {
    return false;
  }
  return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.PATTERN, values, keyStack);
}
exports.applyTo = applyTo;