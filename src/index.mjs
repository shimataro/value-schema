import {CAUSE, NUMERIC_STRING_CHECKSUM_ALGORITHM, STRING_PATTERN} from "./libs/constants";
import adjust from "./libs/adjust";
import factoryNumber from "./adjusters/number";
import factoryNumberArray from "./adjusters/numberArray";
import factoryString from "./adjusters/string";
import factoryStringArray from "./adjusters/stringArray";
import factoryNumericString from "./adjusters/numericString";
import factoryIPv4 from "./adjusters/ipv4";
import factoryIPv6 from "./adjusters/ipv6";
import factoryEmail from "./adjusters/email";

/** @namespace adjuster */
export default {
	/** @type {adjuster.CAUSE} */
	CAUSE: CAUSE,
	/** @type {adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM} */
	NUMERIC_STRING_CHECKSUM_ALGORITHM: NUMERIC_STRING_CHECKSUM_ALGORITHM,
	/** @type {adjuster.STRING_PATTERN} */
	STRING_PATTERN: STRING_PATTERN,

	adjust: adjust,

	number: factoryNumber,
	numberArray: factoryNumberArray,
	string: factoryString,
	stringArray: factoryStringArray,
	numericString: factoryNumericString,
	ipv4: factoryIPv4,
	ipv6: factoryIPv6,
	email: factoryEmail,
};
