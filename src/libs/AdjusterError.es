/**
 * Adjuster Error
 */
export default class AdjusterError extends Error
{
	/**
	 * constructor
	 * @param {string} cause cause of error
	 * @param {*} value original value
	 */
	constructor(cause, value)
	{
		super();

		this.name = "AdjusterError";
		this.cause = cause;
		this.value = value;
	}
}