import {CAUSE} from "libs/constants";
import factoryNumberArray from "adjusters/numberArray";

{
	describe("type", testType);
	describe("required", testRequired);
	describe("default", testDefault);
	describe("empty", testEmptyString);
	describe("allowEmptyString", testAllowEmptyString);
	describe("separatedBy", testSeparatedBy);
	describe("toArray", testToArray);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("maxLength (adjusted)", testMaxLengthAdjusted);
	describe("ignoreEachErrors", testIgnoreEachErrors);
	describe("each", testEach);
	describe("eachDefault", testEachDefault);
	describe("eachAllowEmptyString", testEachAllowEmptyString);
	describe("eachIn", testEachIn);
	describe("eachMinValue", testEachMinValue);
	describe("eachMinValue (adjusted)", testEachMinValueAdjusted);
	describe("eachMaxValue", testEachMaxValue);
	describe("eachMaxValue (adjusted)", testEachMaxValueAdjusted);
}

/**
 * type
 */
function testType()
{
	const objAdjuster = factoryNumberArray();
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([])).toEqual([]);
		expect(objAdjuster.adjust([1, 2])).toEqual([1, 2]);
	});
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust([1, "2", "+3", "-4"])).toEqual([1, 2, 3, -4]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("abc");
		}).toThrow(CAUSE.TYPE);
		expect(() =>
		{
			objAdjuster.adjust(0);
		}).toThrow(CAUSE.TYPE);
	});
}

/**
 * required value
 */
function testRequired()
{
	const objAdjuster = factoryNumberArray();
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
	const objAdjuster = factoryNumberArray().default([1, 2]);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(undefined)).toEqual([1, 2]);
	});
}

/**
 * empty string
 */
function testEmptyString()
{
	const objAdjuster = factoryNumberArray();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("");
		}).toThrow(CAUSE.EMPTY);
	});
}

/**
 * empty string (allowed)
 */
function testAllowEmptyString()
{
	const objAdjuster = factoryNumberArray().allowEmptyString([1, 2]);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust("")).toEqual([1, 2]);
	});
}

/**
 * separator
 */
function testSeparatedBy()
{
	const objAdjuster = factoryNumberArray().separatedBy(",");
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust("1,2,3")).toEqual([1, 2, 3]);
	});
}

/**
 * convert to array
 */
function testToArray()
{
	const objAdjuster = factoryNumberArray().toArray();
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(0)).toEqual([0]);
	});
}

/**
 * minimum length of elements
 */
function testMinLength()
{
	const objAdjuster = factoryNumberArray().minLength(1);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([0])).toEqual([0]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([]);
		}).toThrow(CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of elements
 */
function testMaxLength()
{
	const objAdjuster = factoryNumberArray().maxLength(1);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([0])).toEqual([0]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([1, 2]);
		}).toThrow(CAUSE.MAX_LENGTH);
	});
}

/**
 * maximum length of elements (adjusted)
 */
function testMaxLengthAdjusted()
{
	const objAdjuster = factoryNumberArray().maxLength(1, true);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([0])).toEqual([0]);
	});
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust([1, 2])).toEqual([1]);
	});
}

/**
 * ignore elements' error
 */
function testIgnoreEachErrors()
{
	const objAdjuster = factoryNumberArray().ignoreEachErrors().separatedBy(",");
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust([undefined, 1, "abc", 2])).toEqual([1, 2]);
		expect(objAdjuster.adjust("1,abc,2,,3")).toEqual([1, 2, 3]);
	});
}

/**
 * each elements
 */
function testEach()
{
	const objAdjuster = factoryNumberArray();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(["abc"]);
		}).toThrow(CAUSE.EACH_TYPE);
		expect(() =>
		{
			objAdjuster.adjust([1, undefined, 3]);
		}).toThrow(CAUSE.EACH_REQUIRED);
		expect(() =>
		{
			objAdjuster.adjust([""]);
		}).toThrow(CAUSE.EACH_EMPTY);
	});
}

/**
 * each elements; default value
 */
function testEachDefault()
{
	const objAdjuster = factoryNumberArray().eachDefault(999);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust([1, undefined, 3])).toEqual([1, 999, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([1, "", 3]);
		}).toThrow(CAUSE.EACH_EMPTY);
	});
}

/**
 * each elements; empty string
 */
function testEachAllowEmptyString()
{
	const objAdjuster = factoryNumberArray().eachAllowEmptyString(999);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust([1, "", 3])).toEqual([1, 999, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([1, undefined, 3]);
		}).toThrow(CAUSE.EACH_REQUIRED);
	});
}

/**
 * each elements; set
 */
function testEachIn()
{
	const objAdjuster = factoryNumberArray().eachIn(1, 2, 3);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([1, 2, 3])).toEqual([1, 2, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([0, 1, 2]);
		}).toThrow(CAUSE.EACH_IN);
	});
}

/**
 * each elements; minimum value
 */
function testEachMinValue()
{
	const objAdjuster = factoryNumberArray().eachMinValue(10);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([10, 11, 12])).toEqual([10, 11, 12]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([9, 10, 11]);
		}).toThrow(CAUSE.EACH_MIN_VALUE);
	});
}

/**
 * each elements; minimum value (adjusted)
 */
function testEachMinValueAdjusted()
{
	const objAdjuster = factoryNumberArray().eachMinValue(10, true);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust([9, 10, 11])).toEqual([10, 10, 11]);
	});
}

/**
 * each elements; maximum value
 */
function testEachMaxValue()
{
	const objAdjuster = factoryNumberArray().eachMaxValue(10);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([8, 9, 10])).toEqual([8, 9, 10]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([9, 10, 11]);
		}).toThrow(CAUSE.EACH_MAX_VALUE);
	});
}

/**
 * each elements; maximum value (adjusted)
 */
function testEachMaxValueAdjusted()
{
	const objAdjuster = factoryNumberArray().eachMaxValue(10, true);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust([9, 10, 11])).toEqual([9, 10, 10]);
	});
}
