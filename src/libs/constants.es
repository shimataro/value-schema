/**
 * cause of error
 * @typedef {Object} adjuster.CAUSE
 * @property {string} TYPE
 * @property {string} REQUIRED
 * @property {string} EMPTY
 * @property {string} ONLY
 * @property {string} MIN_VALUE
 * @property {string} MAX_VALUE
 * @property {string} MIN_LENGTH
 * @property {string} MAX_LENGTH
 * @property {string} PATTERN
 * @property {string} ARRAY
 * @property {string} EACH_TYPE
 * @property {string} EACH_REQUIRED
 * @property {string} EACH_EMPTY
 * @property {string} EACH_ONLY
 * @property {string} EACH_MIN_VALUE
 * @property {string} EACH_MAX_VALUE
 * @property {string} EACH_MIN_LENGTH
 * @property {string} EACH_MAX_LENGTH
 * @property {string} EACH_PATTERN
 * @property {string} NUMERIC_STRING_CHECKSUM
 */
export const CAUSE = {
	TYPE: "type",
	REQUIRED: "required",
	NULL: "null",
	EMPTY: "empty",
	ONLY: "only",

	MIN_VALUE: "min-value",
	MAX_VALUE: "max-value",

	MIN_LENGTH: "min-length",
	MAX_LENGTH: "max-length",
	PATTERN: "pattern",

	ARRAY: "array",
	EACH_TYPE: "each-type",
	EACH_REQUIRED: "each-required",
	EACH_EMPTY: "each-empty",
	EACH_ONLY: "each-only",
	EACH_MIN_VALUE: "each-min-value",
	EACH_MAX_VALUE: "each-max-value",
	EACH_MIN_LENGTH: "each-min-length",
	EACH_MAX_LENGTH: "each-max-length",
	EACH_PATTERN: "each-pattern",

	NUMERIC_STRING_CHECKSUM: "numeric-string-checksum",
};

/**
 * checksum algorithm for numericString()
 * @typedef {Object} adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM
 * @property {string} LUHN
 * @property {string} CREDIT_CARD
 * @property {string} MODULUS10_WEIGHT3_1
 * @property {string} ISBN13
 * @property {string} EAN
 * @property {string} JAN
 */
export const NUMERIC_STRING_CHECKSUM_ALGORITHM = {
	LUHN: "luhn",
	CREDIT_CARD: "luhn",

	MODULUS10_WEIGHT3_1: "modulus10/weight3:1",
	ISBN13: "modulus10/weight3:1",
	EAN: "modulus10/weight3:1",
	JAN: "modulus10/weight3:1",
};
