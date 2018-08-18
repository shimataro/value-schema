import {CAUSE, STRING, NUMERIC_STRING} from "./libs/constants";
import adjust from "./libs/adjust";
import factoryBoolean from "./adjusters/boolean";
import factoryNumber from "./adjusters/number";
import factoryString from "./adjusters/string";
import factoryNumericString from "./adjusters/numericString";
import factoryIPv4 from "./adjusters/ipv4";
import factoryIPv6 from "./adjusters/ipv6";
import factoryEmail from "./adjusters/email";
import factoryArray from "./adjusters/array";
import factoryObject from "./adjusters/object";

/** @namespace adjuster */
export default {
	CAUSE: CAUSE,
	STRING: STRING,
	NUMERIC_STRING: NUMERIC_STRING,

	adjust: adjust,

	boolean: factoryBoolean,
	number: factoryNumber,
	string: factoryString,
	numericString: factoryNumericString,
	ipv4: factoryIPv4,
	ipv6: factoryIPv6,
	email: factoryEmail,
	array: factoryArray,
	object: factoryObject,
};
