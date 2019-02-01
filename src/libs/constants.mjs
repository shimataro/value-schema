import {REGEXP_EMAIL} from "./regexp/email";
import {REGEXP_IPV4} from "./regexp/ipv4";
import {REGEXP_IPV6} from "./regexp/ipv6";
import {REGEXP_URI, REGEXP_HTTP} from "./regexp/uri";

export const CAUSE = {
	TYPE: "type",
	REQUIRED: "required",
	NULL: "null",
	EMPTY: "empty",
	ONLY: "only",

	MIN_VALUE: "min-value",
	MAX_VALUE: "max-value",

	CASE: "case",
	MIN_LENGTH: "min-length",
	MAX_LENGTH: "max-length",
	PATTERN: "pattern",

	CHECKSUM: "checksum",
};

export const STRING = {
	CASE: {
		LOWER: "lower",
		UPPER: "UPPER",
		LOWER_CAMEL: "lowerCamel",
		UPPER_CAMEL: "UpperCamel",
		LOWER_SNAKE: "lower_snake",
		UPPER_SNAKE: "UPPER_SNAKE",
		LOWER_KEBAB: "lower-kebab",
		UPPER_KEBAB: "Upper-Kebab",
	},
	PATTERN: {
		EMAIL: REGEXP_EMAIL,
		HTTP: REGEXP_HTTP,
		IPV4: REGEXP_IPV4,
		IPV6: REGEXP_IPV6,
		URI: REGEXP_URI,
	},
};

export const NUMERIC_STRING = {
	CHECKSUM_ALGORITHM: {
		LUHN: "luhn",
		CREDIT_CARD: "luhn",

		MODULUS10_WEIGHT3_1: "modulus10/weight3:1",
		ISBN13: "modulus10/weight3:1",
		EAN: "modulus10/weight3:1",
		JAN: "modulus10/weight3:1",
	},
};
