export = adjuster
export as namespace adjuster

declare namespace adjuster
{
	/**
	 * adjust multiple variables (as object)
	 * @param data data to be adjusted
	 * @param constraints adjuster objects
	 * @param [onError] error handler
	 * @returns adjusted data
	 */
	function adjust(data: Input, constraints: Constraints, onError?: ErrorHandler): Object

	function boolean(): BooleanAdjuster
	function number(): NumberAdjuster
	function string(): StringAdjuster
	function numericString(): NumericStringAdjuster
	function ipv4(): IPv4Adjuster
	function ipv6(): IPv6Adjuster
	function email(): EmailAdjuster
	function array(): ArrayAdjuster
	function object(): ObjectAdjuster

	const CAUSE: ConstantsCause;
	const STRING: ConstantsStringOptions;
	const NUMERIC_STRING: ConstantsNumericStringOptions;
}

// interface definitions
interface AdjusterError extends Error
{
	name: string
	cause: string
	value: any
	keyStack: Key[]
}

interface AdjusterBase<T>
{
	/**
	 * do adjust
	 * @param value to be checked
	 * @param [onError=null] callback function on error
	 * @returns adjusted value
	 */
	adjust(value: Input, onError?: ErrorHandler<T>): T
}

interface BooleanAdjuster extends AdjusterBase<boolean>
{
	/**
	 * enable strict type check
	 * @returns BooleanAdjuster
	 */
	strict(): BooleanAdjuster

	/**
	 * accept all numbers as boolean
	 * @returns BooleanAdjuster
	 */
	acceptAllNumbers(): BooleanAdjuster

	/**
	 * set default value
	 * @param value default value
	 * @returns BooleanAdjuster
	 */
	default(value: boolean): BooleanAdjuster

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns BooleanAdjuster
	 */
	acceptNull(value?: boolean | null): BooleanAdjuster

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns BooleanAdjuster
	 */
	acceptEmptyString(value?: boolean | null): BooleanAdjuster
}

interface NumberAdjuster extends AdjusterBase<number>
{
	/**
	 * enable strict type check
	 * @returns NumberAdjuster
	 */
	strict(): NumberAdjuster

	/**
	 * set default value
	 * @param value default value
	 * @returns NumberAdjuster
	 */
	default(value: number): NumberAdjuster

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns NumberAdjuster
	 */
	acceptNull(value?: number | null): NumberAdjuster

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns NumberAdjuster
	 */
	acceptEmptyString(value?: number | null): NumberAdjuster

	/**
	 * accept all special formats; i.e., "1e+10", "0x100"
	 * @returns NumberAdjuster
	 */
	acceptSpecialFormats(): NumberAdjuster

	/**
	 * limit value to integer
	 * @param [adjust=false] adjust to integer value is not an integer; default is ERROR
	 * @returns NumberAdjuster
	 */
	integer(adjust?: boolean): NumberAdjuster

	/**
	 * accept only specified values
	 * @param values values to be accepted
	 * @returns NumberAdjuster
	 */
	only(...values: number[]): NumberAdjuster

	/**
	 * set min-value
	 * @param value min-value
	 * @param [adjust=false] adjust to min-value if value < min-value; default is ERROR
	 * @returns NumberAdjuster
	 */
	minValue(value: number, adjust?: boolean): NumberAdjuster

	/**
	 * set max-value
	 * @param value max-value
	 * @param [adjust=false] adjust to max-value if value > max-value; default is ERROR
	 * @returns NumberAdjuster
	 */
	maxValue(value: number, adjust?: boolean): NumberAdjuster
}

interface StringAdjuster extends AdjusterBase<string>
{
	/**
	 * enable strict type check
	 * @returns StringAdjuster
	 */
	strict(): StringAdjuster

	/**
	 * set default value
	 * @param value default value
	 * @returns StringAdjuster
	 */
	default(value: string): StringAdjuster

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns StringAdjuster
	 */
	acceptNull(value?: string | null): StringAdjuster

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns StringAdjuster
	 */
	acceptEmptyString(value?: string | null): StringAdjuster

	/**
	 * remove whitespace from both ends
	 * @returns StringAdjuster
	 */
	trim(): StringAdjuster

	/**
	 * accept only specified values
	 * @param values values to be accepted
	 * @returns StringAdjuster
	 */
	only(...values: string[]): StringAdjuster

	/**
	 * set min-length
	 * @param length min-length; error if shorter
	 * @returns StringAdjuster
	 */
	minLength(length: number): StringAdjuster

	/**
	 * set max-length
	 * @param length max-length; error if longer
	 * @param [adjust=false] truncate if longer; default is ERROR
	 * @returns StringAdjuster
	 */
	maxLength(length: number, adjust?: boolean): StringAdjuster

	/**
	 * specify acceptable pattern by regular expression
	 * @param pattern acceptable pattern(regular expression); string or RegExp
	 * @returns StringAdjuster
	 */
	pattern(pattern: Pattern): StringAdjuster
}

interface NumericStringAdjuster extends AdjusterBase<string>
{
	/**
	 * set default value
	 * @param value default value
	 * @returns NumericStringAdjuster
	 */
	default(value: string): NumericStringAdjuster

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns NumericStringAdjuster
	 */
	acceptNull(value?: string | null): NumericStringAdjuster

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns NumericStringAdjuster
	 */
	acceptEmptyString(value?: string | null): NumericStringAdjuster

	/**
	 * join array into string
	 * @returns NumericStringAdjuster
	 */
	joinArray(): NumericStringAdjuster

	/**
	 * ignore separator
	 * @param separator separator
	 * @returns NumericStringAdjuster
	 */
	separatedBy(separator: Pattern): NumericStringAdjuster

	/**
	 * set min-length
	 * @param length min-length; error if shorter
	 * @returns NumericStringAdjuster
	 */
	minLength(length: number): NumericStringAdjuster

	/**
	 * set max-length
	 * @param length max-length; error if longer
	 * @param [adjust=false] truncate if longer; default is ERROR
	 * @returns NumericStringAdjuster
	 */
	maxLength(length: number, adjust?: boolean): NumericStringAdjuster

	/**
	 * validate by checksum
	 * @param algorithm checksum algorithm
	 * @returns NumericStringAdjuster
	 */
	checksum(algorithm: string): NumericStringAdjuster
}

interface IPv4Adjuster extends AdjusterBase<string>
{
	/**
	 * set default value
	 * @param value default value
	 * @returns IPv4Adjuster
	 */
	default(value: string): IPv4Adjuster

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns IPv4Adjuster
	 */
	acceptNull(value?: string | null): IPv4Adjuster

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns IPv4Adjuster
	 */
	acceptEmptyString(value?: string | null): IPv4Adjuster

	/**
	 * remove whitespace from both ends
	 * @returns IPv4Adjuster
	 */
	trim(): IPv4Adjuster
}

interface IPv6Adjuster extends AdjusterBase<string>
{
	/**
	 * set default value
	 * @param value default value
	 * @returns IPv6Adjuster
	 */
	default(value: string): IPv6Adjuster

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns IPv6Adjuster
	 */
	acceptNull(value?: string | null): IPv6Adjuster

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns IPv6Adjuster
	 */
	acceptEmptyString(value?: string | null): IPv6Adjuster

	/**
	 * remove whitespace from both ends
	 * @returns IPv6Adjuster
	 */
	trim(): IPv6Adjuster
}

interface EmailAdjuster extends AdjusterBase<string>
{
	/**
	 * set default value
	 * @param value default value
	 * @returns EmailAdjuster
	 */
	default(value: string): EmailAdjuster

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns EmailAdjuster
	 */
	acceptNull(value?: string | null): EmailAdjuster

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns EmailAdjuster
	 */
	acceptEmptyString(value?: string | null): EmailAdjuster

	/**
	 * remove whitespace from both ends
	 * @returns EmailAdjuster
	 */
	trim(): EmailAdjuster

	/**
	 * specify acceptable pattern by regular expression
	 * @param pattern acceptable pattern(regular expression); string or RegExp
	 * @returns EmailAdjuster
	 */
	pattern(pattern: Pattern): EmailAdjuster
}

interface ArrayAdjuster extends AdjusterBase<any[]>
{

	/**
	 * set default value; enable to omit
	 * @param value default value
	 * @returns ArrayAdjuster
	 */
	default(value: any[]): ArrayAdjuster

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns ArrayAdjuster
	 */
	acceptNull(value?: any[] | null): ArrayAdjuster

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns ArrayAdjuster
	 */
	acceptEmptyString(value?: any[] | null): ArrayAdjuster

	/**
	 * accept string and set separator
	 * @param separator separator
	 * @returns ArrayAdjuster
	 */
	separatedBy(separator: Pattern): ArrayAdjuster

	/**
	 * convert to array, if not
	 * @returns ArrayAdjuster
	 */
	toArray(): ArrayAdjuster

	/**
	 * set min-length of array elements
	 * @param length min-length; error if shorter
	 * @returns ArrayAdjuster
	 */
	minLength(length: number): ArrayAdjuster

	/**
	 * set max-length of array elements
	 * @param length max-length
	 * @param [adjust=false] truncate if longer; default is ERROR
	 * @returns ArrayAdjuster
	 */
	maxLength(length: number, adjust?: boolean): ArrayAdjuster

	/**
	 * apply constraints for each elements
	 * @param adjusterInstance adjuster to apply
	 * @param [ignoreEachErrors=false] ignore errors of each elements
	 * @returns ArrayAdjuster
	 */
	each(adjusterInstance: AdjusterBase<any>, ignoreEachErrors?: boolean): ArrayAdjuster
}

interface ObjectAdjuster extends AdjusterBase<Object>
{
	/**
	 * set default value; enable to omit
	 * @param value default value
	 * @returns ObjectAdjuster
	 */
	default(value: Object): ObjectAdjuster

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns ObjectAdjuster
	 */
	acceptNull(value?: Object | null): ObjectAdjuster

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns ObjectAdjuster
	 */
	acceptEmptyString(value?: Object | null): ObjectAdjuster

	/**
	 * apply constraints
	 * @param constraints constraints to apply
	 * @returns ObjectAdjuster
	 */
	constraints(constraints: Constraints): ObjectAdjuster
}

// type definitions
type Input = null | boolean | number | string | any[] | Object
type Constraints = { [name: string]: AdjusterBase<any> }
type ErrorHandler<T = any> = (err: AdjusterError | null) => T | void
type Key = string | number
type Pattern = RegExp | string

type ConstantsCause = {
	TYPE: string,
	REQUIRED: string,
	NULL: string,
	EMPTY: string,
	ONLY: string,

	MIN_VALUE: string,
	MAX_VALUE: string,

	MIN_LENGTH: string,
	MAX_LENGTH: string,
	PATTERN: string,

	CHECKSUM: string,

	ARRAY: string,
}
type ConstantsStringOptions = {
	PATTERN: {
		URI: string,
	},
}
type ConstantsNumericStringOptions = {
	CHECKSUM_ALGORITHM: {
		LUHN: string,
		CREDIT_CARD: string,

		MODULUS10_WEIGHT3_1: string,
		ISBN13: string,
		EAN: string,
		JAN: string,
	},
}

type DecoratorValues = {
	original: Input,
	adjusted: Input,
}
type DecoratorInfo<T = any> = {
	key: Symbol,
	init: DecoratorInit
	adjust?: DecoratorAdjust<T>,
}
type DecoratorInit = (params: Object) => void
type DecoratorFeature = (params: Object, ...args: any[]) => void
type DecoratorAdjust<T = any> = (params: Object, value: DecoratorValues, onError?: ErrorHandler<T>) => boolean

type Class = Function
type ClassDecorator = (TargetClass: Class) => Class
