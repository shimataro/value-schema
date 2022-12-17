"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REGEXP_EMAIL = exports.PATTERN_EMAIL = void 0;
var ipv4_1 = require("./ipv4");
var ipv6_1 = require("./ipv6");
// https://tools.ietf.org/html/rfc5321
// https://tools.ietf.org/html/rfc5322
var PATTERN_CHARSET_DOT = "\\w!#$%&'*+\\-\\/=?^`{|}~";
var PATTERN_CHARSET_QUOTED = "".concat(PATTERN_CHARSET_DOT, ". ()<>\\[\\]:;@,");
var PATTERN_CHARSET_TLD = "a-zA-Z";
var PATTERN_CHARSET_SLD = "".concat(PATTERN_CHARSET_TLD, "\\d\\-");
var PATTERN_CLASS_DOT = "[".concat(PATTERN_CHARSET_DOT, "]");
var PATTERN_CLASS_QUOTED = "[".concat(PATTERN_CHARSET_QUOTED, "]");
var PATTERN_CLASS_TLD = "[".concat(PATTERN_CHARSET_TLD, "]");
var PATTERN_CLASS_SLD = "[".concat(PATTERN_CHARSET_SLD, "]");
var PATTERN_COMPONENT_DOT = "".concat(PATTERN_CLASS_DOT, "+");
var PATTERN_COMPONENT_QUOTED = "(".concat(PATTERN_CLASS_QUOTED, "|\\\\[\\\\\"])+");
var PATTERN_COMPONENT_TLD = "".concat(PATTERN_CLASS_TLD, "+");
var PATTERN_COMPONENT_SLD = "".concat(PATTERN_CLASS_SLD, "+");
var PATTERN_LOCAL_DOT = "".concat(PATTERN_COMPONENT_DOT, "(\\.").concat(PATTERN_COMPONENT_DOT, ")*");
var PATTERN_LOCAL_QUOTED = "\"".concat(PATTERN_COMPONENT_QUOTED, "\"");
var PATTERN_LOCAL = "(".concat(PATTERN_LOCAL_DOT, "|").concat(PATTERN_LOCAL_QUOTED, ")");
var PATTERN_DOMAIN_GENERAL = "(".concat(PATTERN_COMPONENT_SLD, "\\.)+").concat(PATTERN_COMPONENT_TLD);
var PATTERN_DOMAIN_IP = "\\[(".concat(ipv4_1.PATTERN_IPV4, "|IPv6:").concat(ipv6_1.PATTERN_IPV6, ")\\]");
var PATTERN_DOMAIN = "(".concat(PATTERN_DOMAIN_GENERAL, "|").concat(PATTERN_DOMAIN_IP, ")");
exports.PATTERN_EMAIL = "".concat(PATTERN_LOCAL, "@").concat(PATTERN_DOMAIN);
exports.REGEXP_EMAIL = new RegExp("^".concat(exports.PATTERN_EMAIL, "$"));