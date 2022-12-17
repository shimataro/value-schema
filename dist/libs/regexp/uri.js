"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REGEXP_HTTP = exports.PATTERN_HTTP = exports.REGEXP_URI = exports.PATTERN_URI = void 0;
// URI pattern follows RFC3986: https://tools.ietf.org/html/rfc3986
var rfc_1 = require("./rfc");
var ipv4_1 = require("./ipv4");
var ipv6_1 = require("./ipv6");
// Percent-Encoding: https://tools.ietf.org/html/rfc3986#section-2.1
var PCT_ENCODED = "%".concat(rfc_1.HEXDIG).concat(rfc_1.HEXDIG);
// Reserved Characters: https://tools.ietf.org/html/rfc3986#section-2.2
// const GEN_DELIMS = `[:/?#\\[]@]`;
var SUB_DELIMS = "[!$&'()*+,;=]";
// const RESERVED = `(${GEN_DELIMS}|${SUB_DELIMS})`;
// Unreserved Characters: https://tools.ietf.org/html/rfc3986#section-2.3
var UNRESERVED = "(".concat(rfc_1.ALPHA, "|").concat(rfc_1.DIGIT, "|[-._~])");
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
var SCHEME = "".concat(rfc_1.ALPHA, "(").concat(rfc_1.ALPHA, "|").concat(rfc_1.DIGIT, "|[+\\-.])*");
// User Information: https://tools.ietf.org/html/rfc3986#section-3.2.1
var USERINFO = "(".concat(UNRESERVED, "|").concat(PCT_ENCODED, "|").concat(SUB_DELIMS, "|:)*");
// Host: https://tools.ietf.org/html/rfc3986#section-3.2.2
var IPVFUTURE = "v".concat(rfc_1.HEXDIG, "+\\.(").concat(UNRESERVED, "|").concat(SUB_DELIMS, "|:)+");
var IP_LITERAL = "\\[(".concat(ipv6_1.PATTERN_IPV6, "|").concat(IPVFUTURE, ")]");
var REG_NAME = "(".concat(UNRESERVED, "|").concat(PCT_ENCODED, "|").concat(SUB_DELIMS, ")*");
var HOST = "(".concat(IP_LITERAL, "|").concat(ipv4_1.PATTERN_IPV4, "|").concat(REG_NAME, ")");
// Port: https://tools.ietf.org/html/rfc3986#section-3.2.3
var PORT = "\\d*";
// Authority: https://tools.ietf.org/html/rfc3986#section-3.2
var AUTHORITY = "(".concat(USERINFO, "@)?").concat(HOST, "(:").concat(PORT, ")?");
// Path: https://tools.ietf.org/html/rfc3986#section-3.3
var PCHAR = "(".concat(UNRESERVED, "|").concat(PCT_ENCODED, "|").concat(SUB_DELIMS, "|[:@])");
var SEGMENT = "(".concat(PCHAR, ")*");
var SEGMENT_NZ = "(".concat(PCHAR, ")+");
// const SEGMENT_NZ_NC = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS}|@)+`; // non-zero-length segment without any colon ":"
var PATH_EMPTY = ""; // zero characters
var PATH_ROOTLESS = "".concat(SEGMENT_NZ, "(/").concat(SEGMENT, ")*"); // begins with a segment
// const PATH_NOSCHEME = `${SEGMENT_NZ_NC}(/${SEGMENT})*`; // begins with a non-colon segment
var PATH_ABSOLUTE = "/(".concat(SEGMENT_NZ, "(/").concat(SEGMENT, ")*)?"); // begins with "/" but not "//"
var PATH_ABEMPTY = "(/".concat(SEGMENT, ")*"); // begins with "/" or is empty
// const PATH = `(${PATH_ABEMPTY}|${PATH_ABSOLUTE}|${PATH_NOSCHEME}|${PATH_ROOTLESS}|${PATH_EMPTY})`;
// Query: https://tools.ietf.org/html/rfc3986#section-3.4
var QUERY = "(".concat(PCHAR, "|[/?])*");
// Fragment: https://tools.ietf.org/html/rfc3986#section-3.5
var FRAGMENT = "(".concat(PCHAR, "|[/?])*");
// Syntax Components: https://tools.ietf.org/html/rfc3986#section-3
var HIER_PART = "(//".concat(AUTHORITY).concat(PATH_ABEMPTY, "|").concat(PATH_ABSOLUTE, "|").concat(PATH_ROOTLESS, "|").concat(PATH_EMPTY, ")");
var URI = "".concat(SCHEME, ":").concat(HIER_PART, "(\\?").concat(QUERY, ")?(#").concat(FRAGMENT, ")?");
exports.PATTERN_URI = URI;
exports.REGEXP_URI = new RegExp("^".concat(exports.PATTERN_URI, "$"), "i");
// pattern for HTTP
var HTTP = "https?://".concat(AUTHORITY).concat(PATH_ABEMPTY, "(\\?").concat(QUERY, ")?(#").concat(FRAGMENT, ")?");
exports.PATTERN_HTTP = HTTP;
exports.REGEXP_HTTP = new RegExp("^".concat(exports.PATTERN_HTTP, "$"), "i");