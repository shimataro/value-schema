import {CAUSE} from "libs/constants";
import factoryNumber from "adjusters/number";

{
	describe("type", testType);
	describe("required", testRequired);
	describe("default", testDefault);
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
	const objAdjuster = factoryNumber();
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
		}).toThrow(CAUSE.TYPE);
	});
}

/**
 * required value
 */
function testRequired()
{
	const objAdjuster = factoryNumber();
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(0)).toEqual(0);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(undefined);
		}).toThrow(CAUSE.REQUIRED);
	});
}

/**
 * default value
 */
function testDefault()
{
	const objAdjuster = factoryNumber().default(10);
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
 * empty string
 */
function testEmptyString()
{
	const objAdjuster = factoryNumber();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("");
		}).toThrow(CAUSE.EMPTY);
	});
}

/**
 * empty string (allowd)
 */
function testAllowEmptyString()
{
	const objAdjuster = factoryNumber().allowEmptyString(123);
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
	const objAdjuster = factoryNumber().in(1, 3, 5);
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
		}).toThrow(CAUSE.IN);
	});
}

/**
 * minimum value
 */
function testMinValue()
{
	const objAdjuster = factoryNumber().minValue(10);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(10)).toEqual(10);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(9);
		}).toThrow(CAUSE.MIN_VALUE);
	});
}

/**
 * minimum value (adjusted)
 */
function testMinValueAdjusted()
{
	const objAdjuster = factoryNumber().minValue(10, true);
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
	const objAdjuster = factoryNumber().maxValue(100);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(100)).toEqual(100);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(101);
		}).toThrow(CAUSE.MAX_VALUE);
	});
}

/**
 * maximum value (adjusted)
 */
function testMaxValueAdjusted()
{
	const objAdjuster = factoryNumber().maxValue(100, true);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(101)).toEqual(100);
	});
}
