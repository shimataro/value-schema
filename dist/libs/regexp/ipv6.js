"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REGEXP_IPV6 = exports.PATTERN_IPV6 = void 0;
var rfc_1 = require("./rfc");
var ipv4_1 = require("./ipv4");
var H16 = "".concat(rfc_1.HEXDIG, "{1,4}"); // 16 bits of address represented in hexadecimal
var LS32 = "(".concat(H16, ":").concat(H16, "|").concat(ipv4_1.PATTERN_IPV4, ")"); // least-significant 32 bits of address
// IPv6address =                            6( h16 ":" ) ls32
//             /                       "::" 5( h16 ":" ) ls32
//             / [               h16 ] "::" 4( h16 ":" ) ls32
//             / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
//             / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
//             / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
//             / [ *4( h16 ":" ) h16 ] "::"              ls32
//             / [ *5( h16 ":" ) h16 ] "::"              h16
//             / [ *6( h16 ":" ) h16 ] "::"
var IPV6ADDRESS_1 = "(".concat(H16, ":){6}").concat(LS32);
var IPV6ADDRESS_2 = "::(".concat(H16, ":){5}").concat(LS32);
var IPV6ADDRESS_3 = "(".concat(H16, ")?::(").concat(H16, ":){4}").concat(LS32);
var IPV6ADDRESS_4 = "((".concat(H16, ":){0,1}").concat(H16, ")?::(").concat(H16, ":){3}").concat(LS32);
var IPV6ADDRESS_5 = "((".concat(H16, ":){0,2}").concat(H16, ")?::(").concat(H16, ":){2}").concat(LS32);
var IPV6ADDRESS_6 = "((".concat(H16, ":){0,3}").concat(H16, ")?::").concat(H16, ":").concat(LS32);
var IPV6ADDRESS_7 = "((".concat(H16, ":){0,4}").concat(H16, ")?::").concat(LS32);
var IPV6ADDRESS_8 = "((".concat(H16, ":){0,5}").concat(H16, ")?::").concat(H16);
var IPV6ADDRESS_9 = "((".concat(H16, ":){0,6}").concat(H16, ")?::");
var IPV6ADDRESS = "(".concat(IPV6ADDRESS_1, "|").concat(IPV6ADDRESS_2, "|").concat(IPV6ADDRESS_3, "|").concat(IPV6ADDRESS_4, "|").concat(IPV6ADDRESS_5, "|").concat(IPV6ADDRESS_6, "|").concat(IPV6ADDRESS_7, "|").concat(IPV6ADDRESS_8, "|").concat(IPV6ADDRESS_9, ")");
exports.PATTERN_IPV6 = IPV6ADDRESS;
exports.REGEXP_IPV6 = new RegExp("^".concat(exports.PATTERN_IPV6, "$"), "i");