import {CAUSE, NUMERIC_STRING_CHECKSUM} from "./libs/constants";
import adjust from "./libs/adjust";
import NumberAdjuster from "./libs/NumberAdjuster";
import NumberArrayAdjuster from "./libs/NumberArrayAdjuster";
import StringAdjuster from "./libs/StringAdjuster";
import StringArrayAdjuster from "./libs/StringArrayAdjuster";
import NumericStringAdjuster from "./libs/NumericStringAdjuster";
import IPv4Adjuster from "./libs/IPv4Adjuster";
import IPv6Adjuster from "./libs/IPv6Adjuster";
import EmailAdjuster from "./libs/EmailAdjuster";

/** @namespace adjuster */
export default {
	/** @type {adjuster.CAUSE} */
	CAUSE: CAUSE,
	/** @type {adjuster.NUMERIC_STRING_CHECKSUM} */
	NUMERIC_STRING_CHECKSUM: NUMERIC_STRING_CHECKSUM,

	adjust: adjust,

	/** @return {NumberAdjuster} */
	number: () =>
	{
		return new NumberAdjuster();
	},
	/** @return {NumberArrayAdjuster} */
	numberArray: () =>
	{
		return new NumberArrayAdjuster();
	},
	/** @return {StringAdjuster} */
	string: () =>
	{
		return new StringAdjuster();
	},
	/** @return {StringArrayAdjuster} */
	stringArray: () =>
	{
		return new StringArrayAdjuster();
	},
	/** @return {NumericStringAdjuster} */
	numericString: () =>
	{
		return new NumericStringAdjuster();
	},
	/** @return {IPv4Adjuster} */
	ipv4: () =>
	{
		return new IPv4Adjuster();
	},
	/** @return {IPv6Adjuster} */
	ipv6: () =>
	{
		return new IPv6Adjuster();
	},
	/** @return {EmailAdjuster} */
	email: () =>
	{
		return new EmailAdjuster();
	},
};
