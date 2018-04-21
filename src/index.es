import {CAUSE} from "./libs/constants";
import adjustData from "./libs/adjustData";
import NumberAdjuster from "./libs/NumberAdjuster";
import StringAdjuster from "./libs/StringAdjuster";
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
};
