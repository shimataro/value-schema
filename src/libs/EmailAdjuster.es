import {CAUSE} from "./constants";
import AdjusterInterface from "./AdjusterInterface";
import StringAdjuster from "./StringAdjuster";

const MAX_LENGTH = 254;
const PATTERN = /^(([\w!#$%&'*+\-\/=?^`{|}~]+(\.[\w!#$%&'*+\-\/=?^`{|}~]+)*)|("([\w!#$%&'*+\-\/=?^`{|}~. ()<>\[\]:;@,]|\\\\|\\")+"))@((([\da-zA-Z\-]+\.)+[a-zA-Z]+)|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])$/;

/**
 * adjuster for e-mail
 */
export default class EmailAdjuster extends AdjusterInterface
{
	/**
	 * constructor
	 */
	constructor()
	{
		super();

		this._objAdjuster = new StringAdjuster()
			.maxLength(MAX_LENGTH)
			.pattern(PATTERN);
	}

	/**
	 * set default value; enable to omit
	 * @param {string} value default value
	 * @return {EmailAdjuster}
	 */
	default(value)
	{
		this._objAdjuster.default(value);
		return this;
	}

	/**
	 * allow empty string (NOT undefined)
	 * @param {?string} [value=null] value on empty
	 * @return {EmailAdjuster}
	 */
	allowEmpty(value = null)
	{
		this._objAdjuster.allowEmpty(value);
		return this;
	}

	/**
	 * specify custom pattern by regular expression
	 * @param {RegExp} pattern acceptable pattern
	 * @return {EmailAdjuster}
	 */
	pattern(pattern)
	{
		this._objAdjuster.pattern(pattern);
		return this;
	}

	/**
	 * do adjust
	 * @param {*} value value to be checked
	 * @param {?_OnError} onError callback function on error
	 * @return {string} adjusted value
	 */
	adjust(value, onError = null)
	{
		try
		{
			return this._objAdjuster.adjust(value);
		}
		catch(err)
		{
			if(err.cause === CAUSE.PATTERN)
			{
				err.cause = CAUSE.EMAIL;
			}
			return AdjusterInterface._handleError(onError, err.cause, value);
		}
	}
}
