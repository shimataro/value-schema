export {isString};

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
