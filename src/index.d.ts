export = vs;
export as namespace vs;

declare namespace vs
{
	/**
	 * fit data to schemaObject
	 * @param data data to check
	 * @param schemaObject schema definitions
	 * @param [onError] error handler
	 * @returns checked data
	 */
	function fit<T = any>(data: Input, schemaObject: SchemaObject, onError?: ErrorHandler): T

	function boolean(): BooleanSchema
	function number(): NumberSchema
	function string(): StringSchema
	function numericString(): NumericStringSchema
	function email(): EmailSchema
	function array<T = any>(): ArraySchema<T>
	function object<T = any>(): ObjectSchema<T>

	const CAUSE: Cause;
	const STRING: StringOptions;
	const NUMERIC_STRING: NumericStringOptions;

	interface SchemaObject
	{
		[name: string]: BaseSchema<any>
	}
}

// interface definitions
interface ValueSchemaError extends Error
{
	name: string
	cause: string
	value: any
	keyStack: Key[]
}

interface BaseSchema<T>
{
	/**
	 * fit value to schema
	 * @param value value to check
	 * @param [onError=null] callback function on error
	 * @returns checked value
	 */
	fit(value: Input, onError?: ErrorHandler<T>): T
}

interface BooleanSchema extends BaseSchema<boolean>
{
	/**
	 * enable strict type check
	 * @returns chainable instance
	 */
	strict(): this

	/**
	 * accept all numbers as boolean
	 * @returns chainable instance
	 */
	acceptAllNumbers(): this

	/**
	 * set default value
	 * @param value default value
	 * @returns chainable instance
	 */
	default(value: boolean): this

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns chainable instance
	 */
	acceptNull(value?: boolean | null): this

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns chainable instance
	 */
	acceptEmptyString(value?: boolean | null): this
}

interface NumberSchema extends BaseSchema<number>
{
	/**
	 * enable strict type check
	 * @returns chainable instance
	 */
	strict(): this

	/**
	 * set default value
	 * @param value default value
	 * @returns chainable instance
	 */
	default(value: number): this

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns chainable instance
	 */
	acceptNull(value?: number | null): this

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns chainable instance
	 */
	acceptEmptyString(value?: number | null): this

	/**
	 * accept all special formats; i.e., "1e+10", "0x100"
	 * @returns chainable instance
	 */
	acceptSpecialFormats(): this

	/**
	 * accept full width numeric string; i.e., "１２３．４５６"
	 * @returns chainable instance
	 */
	acceptFullWidth(): this

	/**
	 * limit value to integer chain
	 * @param [fits=false] fit input to integer if not; false throws ValueSchemaError
	 * @returns chainable instance
	 */
	integer(fits?: boolean): this

	/**
	 * accept only specified values
	 * @param values values to be accepted
	 * @returns chainable instance
	 */
	only(...values: number[]): this

	/**
	 * set min-value
	 * @param value min-value
	 * @param [fits=false] fit input to value if input < value; false throws ValueSchemaError
	 * @returns chainable instance
	 */
	minValue(value: number, fits?: boolean): this

	/**
	 * set max-value
	 * @param value max-value
	 * @param [fits=false] fit input to value if input > value; false throws ValueSchemaError
	 * @returns chainable instance
	 */
	maxValue(value: number, fits?: boolean): this

	/**
	 * conversion
	 * @param converter conversion function
	 * @returns chainable instance
	 */
	convert(converter: (value: number, fail: () => never) => number): this
}

interface StringSchema extends BaseSchema<string>
{
	/**
	 * enable strict type check
	 * @returns chainable instance
	 */
	strict(): this

	/**
	 * set default value
	 * @param value default value
	 * @returns chainable instance
	 */
	default(value: string): this

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns chainable instance
	 */
	acceptNull(value?: string | null): this

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns chainable instance
	 */
	acceptEmptyString(value?: string | null): this

	/**
	 * remove whitespace from both ends
	 * @returns chainable instance
	 */
	trim(): this

	/**
	 * accept only specified values
	 * @param values values to be accepted
	 * @returns chainable instance
	 */
	only(...values: string[]): this

	/**
	 * set min-length
	 * @param length min-length; error if shorter
	 * @returns chainable instance
	 */
	minLength(length: number): this

	/**
	 * set max-length
	 * @param length max-length; error if longer
	 * @param [fits=false] truncate if longer; false throws ValueSchemaError
	 * @returns chainable instance
	 */
	maxLength(length: number, fits?: boolean): this

	/**
	 * specify acceptable pattern by regular expression
	 * @param pattern acceptable pattern(regular expression)
	 * @returns chainable instance
	 */
	pattern(pattern: RegExp): this

	/**
	 * conversion
	 * @param converter conversion function
	 * @returns chainable instance
	 */
	convert(converter: (value: string, fail: () => never) => string): this

	/**
	 * mapping
	 * @param mapper mapping function
	 * @returns chainable instance
	 * @deprecated use convert()
	 */
	map(mapper: (value: string, fail: () => never) => string): this
}

interface NumericStringSchema extends BaseSchema<string>
{
	/**
	 * set default value
	 * @param value default value
	 * @returns chainable instance
	 */
	default(value: string): this

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns chainable instance
	 */
	acceptNull(value?: string | null): this

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns chainable instance
	 */
	acceptEmptyString(value?: string | null): this

	/**
	 * convert full width string to half width
	 * @returns chainable instance
	 */
	fullWidthToHalf(): this

	/**
	 * join array into string
	 * @returns chainable instance
	 */
	joinArray(): this

	/**
	 * ignore separator
	 * @param separator separator
	 * @returns chainable instance
	 */
	separatedBy(separator: Separator): this

	/**
	 * set min-length
	 * @param length min-length; error if shorter
	 * @returns chainable instance
	 */
	minLength(length: number): this

	/**
	 * set max-length
	 * @param length max-length; error if longer
	 * @param [fits=false] truncate if longer; false throws ValueSchemaError
	 * @returns chainable instance
	 */
	maxLength(length: number, fits?: boolean): this

	/**
	 * validate by checksum
	 * @param algorithm checksum algorithm
	 * @returns chainable instance
	 */
	checksum(algorithm: string): this

	/**
	 * conversion
	 * @param converter conversion function
	 * @returns chainable instance
	 */
	convert(converter: (value: string, fail: () => never) => string): this
}

interface EmailSchema extends BaseSchema<string>
{
	/**
	 * set default value
	 * @param value default value
	 * @returns chainable instance
	 */
	default(value: string): this

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns chainable instance
	 */
	acceptNull(value?: string | null): this

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns chainable instance
	 */
	acceptEmptyString(value?: string | null): this

	/**
	 * remove whitespace from both ends
	 * @returns chainable instance
	 */
	trim(): this

	/**
	 * specify acceptable pattern by regular expression
	 * @param pattern acceptable pattern(regular expression)
	 * @returns chainable instance
	 */
	pattern(pattern: RegExp): this
}

interface ArraySchema<T> extends BaseSchema<T[]>
{
	/**
	 * set default value; enable to omit
	 * @param value default value
	 * @returns chainable instance
	 */
	default(value: CollectionArray): this

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns chainable instance
	 */
	acceptNull(value?: CollectionArray | null): this

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns chainable instance
	 */
	acceptEmptyString(value?: CollectionArray | null): this

	/**
	 * accept string and set separator
	 * @param separator separator
	 * @returns chainable instance
	 */
	separatedBy(separator: Separator): this

	/**
	 * convert to array, if not
	 * @returns chainable instance
	 */
	toArray(): this

	/**
	 * set min-length of array elements
	 * @param length min-length; error if shorter
	 * @returns chainable instance
	 */
	minLength(length: number): this

	/**
	 * set max-length of array elements
	 * @param length max-length
	 * @param [fits=false] truncate if longer; false throws ValueSchemaError
	 * @returns chainable instance
	 */
	maxLength(length: number, fits?: boolean): this

	/**
	 * apply schema to each elements
	 * @param schemaInstance schema to apply
	 * @param [ignoreEachErrors=false] ignore errors of each elements
	 * @returns chainable instance
	 */
	each(schemaInstance: BaseSchema<any>, ignoreEachErrors?: boolean): this
}

interface ObjectSchema<T> extends BaseSchema<T>
{
	/**
	 * set default value; enable to omit
	 * @param value default value
	 * @returns chainable instance
	 */
	default(value: CollectionObject): this

	/**
	 * accept null
	 * @param [value=null] value on null
	 * @returns chainable instance
	 */
	acceptNull(value?: CollectionObject | null): this

	/**
	 * accept empty string
	 * @param [value=null] value on empty
	 * @returns chainable instance
	 */
	acceptEmptyString(value?: CollectionObject | null): this

	/**
	 * define schema
	 * @param schemaObject schema definitions
	 * @returns chainable instance
	 */
	schema(schemaObject: vs.SchemaObject): this
}

// type definitions
type CollectionArray = any[]
type CollectionObject = { [name: string]: any }
type Input = null | boolean | number | string | CollectionArray | CollectionObject
type ErrorHandler<T = any> = (err: ValueSchemaError | null) => T | void
type Key = string | number
type Separator = RegExp | string

type Cause = {
	TYPE: string,
	REQUIRED: string,
	NULL: string,
	EMPTY: string,
	ONLY: string,
	CONVERT: string,

	MIN_VALUE: string,
	MAX_VALUE: string,

	MIN_LENGTH: string,
	MAX_LENGTH: string,
	PATTERN: string,

	CHECKSUM: string,
}
type StringOptions = {
	PATTERN: {
		EMAIL: RegExp,
		HTTP: RegExp,
		IPV4: RegExp,
		IPV6: RegExp,
		URI: RegExp,
	},
}
type NumericStringOptions = {
	CHECKSUM_ALGORITHM: {
		LUHN: string,
		CREDIT_CARD: string,

		MODULUS10_WEIGHT3_1: string,
		ISBN13: string,
		EAN: string,
		JAN: string,
	},
}
