/**
 * convert full-width to half-width in str
 * @param str string to convert
 * @param charsets character sets to convert
 * @returns half-width string
 */
export declare function toHalfWidth(str: string, charsets: string | RegExp): string;
/**
 * convert full-width to half-width
 * @param str string to convert; ALL ELEMENTS MUST BE FULL-WIDTH!
 * @returns half-width string
 */
export declare function toHalfWidthAll(str: string): string;
