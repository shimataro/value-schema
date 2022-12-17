"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEC_OCTET = exports.HEXDIG = exports.DIGIT = exports.ALPHA = void 0;
exports.ALPHA = "[a-z]";
exports.DIGIT = "[0-9]";
exports.HEXDIG = "[0-9a-f]";
var DEC_OCTET_1 = exports.DIGIT; // 0-9
var DEC_OCTET_2 = "[1-9]".concat(exports.DIGIT); // 10-99
var DEC_OCTET_3 = "1".concat(exports.DIGIT, "{2}"); // 100-199
var DEC_OCTET_4 = "2[0-4]".concat(exports.DIGIT); // 200-249
var DEC_OCTET_5 = "25[0-5]"; // 250-255
exports.DEC_OCTET = "(".concat(DEC_OCTET_1, "|").concat(DEC_OCTET_2, "|").concat(DEC_OCTET_3, "|").concat(DEC_OCTET_4, "|").concat(DEC_OCTET_5, ")");