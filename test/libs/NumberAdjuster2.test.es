import {CAUSE} from "libs/constants";
import NumberAdjuster2 from "libs/NumberAdjuster2";

{
	describe("type", testType);
	describe("required", testRequired);
	describe("default", testDefault);
	describe("empty", testEmpty);
	describe("allowEmpty", testAllowEmpty);
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
	const objAdjuster = new NumberAdjuster2();
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
	const objAdjuster = new NumberAdjuster2();
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
	const objAdjuster = new NumberAdjuster2().default(10);
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
 * empty value
 */
function testEmpty()
{
	const objAdjuster = new NumberAdjuster2();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("");
		}).toThrow(CAUSE.EMPTY);
	});
}

/**
 * empty value (allowd)
 */
function testAllowEmpty()
{
	const objAdjuster = new NumberAdjuster2().allowEmpty(123);
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
	const objAdjuster = new NumberAdjuster2().in(1, 3, 5);
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
	const objAdjuster = new NumberAdjuster2().minValue(10);
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
	const objAdjuster = new NumberAdjuster2().minValue(10, true);
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
	const objAdjuster = new NumberAdjuster2().maxValue(100);
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
	const objAdjuster = new NumberAdjuster2().maxValue(100, true);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(101)).toEqual(100);
	});
}
