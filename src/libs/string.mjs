export {toHalfWidth, toHalfWidthAll};

/**
 * convert full-width to half-width in str
 * @param {string} str string to convert
 * @param {string | RegExp} charsets character sets to convert
 * @returns {string} half-width string
 */
function toHalfWidth(str, charsets)
{
	return str.replace(charsets, (substr) =>
	{
		return toHalfWidthAll(substr);
	});
}

/**
 * convert full-width to half-width
 * @param {string} str string to convert; ALL ELEMENTS MUST BE FULL-WIDTH!
 * @returns {string} half-width string
 */
function toHalfWidthAll(str)
{
	const charCodes = [];
	for(let index = 0; index < str.length; index++)
	{
		charCodes.push(str.charCodeAt(index) - 0xfee0);
	}

	return String.fromCharCode(...charCodes);
}
