import {CAUSE} from "./libs/constants";
import adjustData from "./libs/adjustData";
import NumberAdjuster from "./libs/NumberAdjuster";
import NumberArrayAdjuster from "./libs/NumberArrayAdjuster";
import StringAdjuster from "./libs/StringAdjuster";
import IPv4Adjuster from "./libs/IPv4Adjuster";
import IPv6Adjuster from "./libs/IPv6Adjuster";
import EmailAdjuster from "./libs/EmailAdjuster";

export default {
	/** @type {AdjusterErrorCause} */
	CAUSE: CAUSE,

	adjustData: adjustData,

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
