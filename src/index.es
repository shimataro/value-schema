import {CAUSE} from "./libs/constants";
import adjustData from "./libs/adjustData";
import NumberAdjuster from "./libs/NumberAdjuster";
import StringAdjuster from "./libs/StringAdjuster";
import EmailAdjuster from "./libs/EmailAdjuster";
import IPv4Adjuster from "./libs/IPv4Adjuster";

export default {
	/** @type {AdjusterErrorCause} */
	CAUSE: CAUSE,

	adjustData: adjustData,

	/** @return {NumberAdjuster} */
	number: () =>
	{
		return new NumberAdjuster();
	},
	/** @return {StringAdjuster} */
	string: () =>
	{
		return new StringAdjuster();
	},
	/** @return {EmailAdjuster} */
	email: () =>
	{
		return new EmailAdjuster();
	},
	/** @return {IPv4Adjuster} */
	ipv4: () =>
	{
		return new IPv4Adjuster();
	}
};
