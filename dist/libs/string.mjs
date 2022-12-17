/**
 * convert full-width to half-width in str
 * @param str string to convert
 * @param charsets character sets to convert
 * @returns half-width string
 */
export function toHalfWidth(str, charsets) {
  return str.replace(charsets, substr => {
    return toHalfWidthAll(substr);
  });
}
/**
 * convert full-width to half-width
 * @param str string to convert; ALL ELEMENTS MUST BE FULL-WIDTH!
 * @returns half-width string
 */
export function toHalfWidthAll(str) {
  const charCodes = [];
  for (let index = 0; index < str.length; index++) {
    charCodes.push(str.charCodeAt(index) - 0xfee0);
  }
  return String.fromCharCode(...charCodes);
}