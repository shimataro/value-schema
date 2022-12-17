"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REGEXP_IPV4 = exports.PATTERN_IPV4 = void 0;
var rfc_1 = require("./rfc");
var IPV4ADDRESS = "".concat(rfc_1.DEC_OCTET, "(\\.").concat(rfc_1.DEC_OCTET, "){3}");
exports.PATTERN_IPV4 = IPV4ADDRESS;
exports.REGEXP_IPV4 = new RegExp("^".concat(exports.PATTERN_IPV4, "$"));