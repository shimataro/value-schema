export {isString, isObject};

/**
 * check whether given value is string or not
 * @param {*} value value to check
 * @return {boolean} Yes/No
 */
function isString(value)
{
	if(typeof value === "string")
	{
		return true;
	}
	if(value instanceof String)
	{
		return true;
	}

	// false otherwise
	return false;
}

/**
 * check whether given value is object or not
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
	if(Array.isArray(value))
	{
		return false;

	}

	// otherwise
	return true;
}
