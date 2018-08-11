export {isString, isArray, isObject};

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
