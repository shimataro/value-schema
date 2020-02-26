export enum CAUSE
{
	TYPE = "type",
	UNDEFINED = "undefined",
	NULL = "null",
	EMPTY_STRING = "empty-string",
	ONLY = "only",

	MIN_VALUE = "min-value",
	MAX_VALUE = "max-value",

	MIN_LENGTH = "min-length",
	MAX_LENGTH = "max-length",
	PATTERN = "pattern",
	CONVERT_CASE = "convert-case",

	CHECKSUM = "checksum",
}

export enum INTEGER
{
	NO,
	YES,
	FLOOR,
	FLOOR_RZ,
	CEIL,
	CEIL_RZ,
	HALF_UP,
	HALF_UP_RZ,
	HALF_DOWN,
	HALF_DOWN_RZ,
}

export enum CHECKSUM_ALGORITHM
{
	LUHN = "luhn",
	CREDIT_CARD = LUHN,

	MODULUS10_WEIGHT3_1 = "modulus10/weight3:1",
	ISBN13 = MODULUS10_WEIGHT3_1,
	EAN = MODULUS10_WEIGHT3_1,
	JAN = MODULUS10_WEIGHT3_1,
}

export enum CASE
{
	NONE = "",
	LOWER = "lower",
	UPPER = "UPPER",
}
