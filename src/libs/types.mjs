export {isBoolean, isNumber, isString, isArray, isObject};

/**
 * check whether given value is a boolean or not
 * @param {*} value value to check
 * @return {boolean} Yes/No
 */
function isBoolean(value)
{
	return typeof value === "boolean";
}

/**
 * check whether given value is a number or not
 * @param {*} value value to check
 * @return {boolean} Yes/No
 */
function isNumber(value)
{
	if(typeof value !== "number")
	{
		return false;
	}
	if(Number.isNaN(value))
	{
		return false;
	}

	// true otherwise
	return true;
}

/**
 * check whether given value is string or not
 * @param {*} value value to check
 * @return {boolean} Yes/No
 */
function isString(value)
{
	return typeof value === "string";
}

/**
 * check whether given value is an array or not
 * @param {*} value value to chheck
 * @return {boolean} yes/no
 */
function isArray(value)
{
	return Array.isArray(value);
}

/**
 * check whether given value is an object or not
 * @param {*} value value to check
 * @return {boolean} Yes/No
 */
function isObject(value)
{
	if(typeof value !== "object")
	{
		return false;
	}
	if(value === null)
	{
		return false;
	}
	if(isArray(value))
	{
		return false;
	}

	// true otherwise
	return true;
}
