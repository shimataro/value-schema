import {CAUSE} from "libs/constants";
import NumberArrayAdjuster from "libs/NumberArrayAdjuster";

{
	describe("type", testType);
	describe("required", testRequired);
	describe("default", testDefault);
	describe("empty", testEmpty);
	describe("allowEmpty", testAllowEmpty);
	describe("separatedBy", testSeparatedBy);
	describe("toArray", testToArray);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("maxLength (adjusted)", testMaxLengthAdjusted);
	describe("ignoreEachErrors", testIgnoreEachErrors);
	describe("each", testEach);
	describe("eachDefault", testEachDefault);
	describe("eachAllowEmpty", testEachAllowEmpty);
	describe("eachIn", testEachIn);
	describe("eachMinValue", testEachMinValue);
	describe("eachMinValue (adjusted)", testEachMinValueAdjusted);
	describe("eachMaxValue", testEachMaxValue);
	describe("eachMaxValue (adjusted", testEachMaxValueAdjusted);
}

function testType()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster();
	it("should be OK", () =>
	{
		expect(objNumberArrayAdjuster.adjust([])).toEqual([]);
		expect(objNumberArrayAdjuster.adjust([1, 2])).toEqual([1, 2]);
	});
	it("should be adjusted", () =>
	{
		expect(objNumberArrayAdjuster.adjust([1, "2", "+3", "-4"])).toEqual([1, 2, 3, -4]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objNumberArrayAdjuster.adjust("abc");
		}).toThrow(CAUSE.TYPE);
		expect(() =>
		{
			objNumberArrayAdjuster.adjust(0);
		}).toThrow(CAUSE.TYPE);
	});
}

function testRequired()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objNumberArrayAdjuster.adjust(undefined);
		}).toThrow(CAUSE.REQUIRED);
	});
}

function testDefault()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().default([1, 2]);
	it("should be adjusted", () =>
	{
		expect(objNumberArrayAdjuster.adjust(undefined)).toEqual([1, 2]);
	});
}

function testEmpty()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objNumberArrayAdjuster.adjust("");
		}).toThrow(CAUSE.EMPTY);
	});
}

function testAllowEmpty()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().allowEmpty([1, 2]);
	it("should be adjusted", () =>
	{
		expect(objNumberArrayAdjuster.adjust("")).toEqual([1, 2]);
	});
}

function testSeparatedBy()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().separatedBy(",");
	it("should be adjusted", () =>
	{
		expect(objNumberArrayAdjuster.adjust("1,2,3")).toEqual([1, 2, 3]);
	});
}

function testToArray()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().toArray();
	it("should be adjusted", () =>
	{
		expect(objNumberArrayAdjuster.adjust(0)).toEqual([0]);
	});
}

function testMinLength()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().minLength(1);
	it("should be OK", () =>
	{
		expect(objNumberArrayAdjuster.adjust([0])).toEqual([0]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objNumberArrayAdjuster.adjust([]);
		}).toThrow(CAUSE.MIN_LENGTH);
	});
}

function testMaxLength()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().maxLength(1);
	it("should be OK", () =>
	{
		expect(objNumberArrayAdjuster.adjust([0])).toEqual([0]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objNumberArrayAdjuster.adjust([1, 2]);
		}).toThrow(CAUSE.MAX_LENGTH);
	});
}

function testMaxLengthAdjusted()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().maxLength(1, true);
	it("should be OK", () =>
	{
		expect(objNumberArrayAdjuster.adjust([0])).toEqual([0]);
	});
	it("should be adjusted", () =>
	{
		expect(objNumberArrayAdjuster.adjust([1, 2])).toEqual([1]);
	});
}

function testIgnoreEachErrors()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().ignoreEachErrors().separatedBy(",");
	it("should be adjusted", () =>
	{
		expect(objNumberArrayAdjuster.adjust([undefined, 1, "abc", 2])).toEqual([1, 2]);
		expect(objNumberArrayAdjuster.adjust("1,abc,2,,3")).toEqual([1, 2, 3]);
	});
}

function testEach()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objNumberArrayAdjuster.adjust(["abc"]);
		}).toThrow(CAUSE.EACH_TYPE);
		expect(() =>
		{
			objNumberArrayAdjuster.adjust([1, undefined, 3]);
		}).toThrow(CAUSE.EACH_REQUIRED);
		expect(() =>
		{
			objNumberArrayAdjuster.adjust([""]);
		}).toThrow(CAUSE.EACH_EMPTY);
	});
}

function testEachDefault()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().eachDefault(999);
	it("should be adjusted", () =>
	{
		expect(objNumberArrayAdjuster.adjust([1, undefined, 3])).toEqual([1, 999, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objNumberArrayAdjuster.adjust([1, "", 3]);
		}).toThrow(CAUSE.EACH_EMPTY);
	});
}

function testEachAllowEmpty()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().eachAllowEmpty(999);
	it("should be adjusted", () =>
	{
		expect(objNumberArrayAdjuster.adjust([1, "", 3])).toEqual([1, 999, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objNumberArrayAdjuster.adjust([1, undefined, 3]);
		}).toThrow(CAUSE.EACH_REQUIRED);
	});
}

function testEachIn()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().eachIn(1, 2, 3);
	it("should be OK", () =>
	{
		expect(objNumberArrayAdjuster.adjust([1, 2, 3])).toEqual([1, 2, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objNumberArrayAdjuster.adjust([0, 1, 2]);
		}).toThrow(CAUSE.EACH_IN);
	});
}

function testEachMinValue()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().eachMinValue(10);
	it("should be OK", () =>
	{
		expect(objNumberArrayAdjuster.adjust([10, 11, 12])).toEqual([10, 11, 12]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objNumberArrayAdjuster.adjust([9, 10, 11]);
		}).toThrow(CAUSE.EACH_MIN_VALUE);
	});
}

function testEachMinValueAdjusted()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().eachMinValue(10, true);
	it("should be adjusted", () =>
	{
		expect(objNumberArrayAdjuster.adjust([9, 10, 11])).toEqual([10, 10, 11]);
	});
}

function testEachMaxValue()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().eachMaxValue(10);
	it("should be OK", () =>
	{
		expect(objNumberArrayAdjuster.adjust([8, 9, 10])).toEqual([8, 9, 10]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objNumberArrayAdjuster.adjust([9, 10, 11]);
		}).toThrow(CAUSE.EACH_MAX_VALUE);
	});
}

function testEachMaxValueAdjusted()
{
	const objNumberArrayAdjuster = new NumberArrayAdjuster().eachMaxValue(10, true);
	it("should be adjusted", () =>
	{
		expect(objNumberArrayAdjuster.adjust([9, 10, 11])).toEqual([9, 10, 10]);
	});
}
