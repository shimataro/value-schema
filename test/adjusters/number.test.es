import adjuster from "index";

{
	describe("type", testType);
	describe("required", testRequired);
	describe("default", testDefault);
	describe("null", testNull);
	describe("allowNull", testAllowNull);
	describe("emptyString", testEmptyString);
	describe("allowEmptyString", testAllowEmptyString);
	describe("in", testIn);
	describe("minValue", testMinValue);
	describe("minValue (adjusted)", testMinValueAdjusted);
	describe("maxValue", testMaxValue);
	describe("maxValue (adjusted)", testMaxValueAdjusted);
}

/**
 * type
 */
function testType()
{
	const objAdjuster = adjuster.number();
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(1)).toEqual(1);
	});
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust("123")).toEqual(123);
		expect(objAdjuster.adjust("+456")).toEqual(456);
		expect(objAdjuster.adjust("-789")).toEqual(-789);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("abc");
		}).toThrow(adjuster.CAUSE.TYPE);
	});
}

/**
 * required value
 */
function testRequired()
{
	const objAdjuster = adjuster.number();
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(0)).toEqual(0);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(undefined);
		}).toThrow(adjuster.CAUSE.REQUIRED);
	});
}

/**
 * default value
 */
function testDefault()
{
	const objAdjuster = adjuster.number().default(10);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(1)).toEqual(1);
	});
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(undefined)).toEqual(10);
	});
}

/**
 * null
 */
function testNull()
{
	const objAdjuster = adjuster.number();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(null);
		}).toThrow(adjuster.CAUSE.NULL);
	});
}

/**
 * null (allowd)
 */
function testAllowNull()
{
	const objAdjuster = adjuster.number().allowNull(123);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(null)).toEqual(123);
	});
}

/**
 * empty string
 */
function testEmptyString()
{
	const objAdjuster = adjuster.number();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * empty string (allowd)
 */
function testAllowEmptyString()
{
	const objAdjuster = adjuster.number().allowEmptyString(123);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust("")).toEqual(123);
	});
}

/**
 * set
 */
function testIn()
{
	const objAdjuster = adjuster.number().in(1, 3, 5);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(1)).toEqual(1);
		expect(objAdjuster.adjust(3)).toEqual(3);
		expect(objAdjuster.adjust(5)).toEqual(5);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(2);
		}).toThrow(adjuster.CAUSE.IN);
	});
}

/**
 * minimum value
 */
function testMinValue()
{
	const objAdjuster = adjuster.number().minValue(10);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(10)).toEqual(10);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(9);
		}).toThrow(adjuster.CAUSE.MIN_VALUE);
	});
}

/**
 * minimum value (adjusted)
 */
function testMinValueAdjusted()
{
	const objAdjuster = adjuster.number().minValue(10, true);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(9)).toEqual(10);
	});
}

/**
 * maximum value
 */
function testMaxValue()
{
	const objAdjuster = adjuster.number().maxValue(100);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(100)).toEqual(100);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(101);
		}).toThrow(adjuster.CAUSE.MAX_VALUE);
	});
}

/**
 * maximum value (adjusted)
 */
function testMaxValueAdjusted()
{
	const objAdjuster = adjuster.number().maxValue(100, true);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(101)).toEqual(100);
	});
}
