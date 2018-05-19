import adjuster from "index";

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
	const objAdjuster = adjuster.numberArray();
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
		}).toThrow(adjuster.CAUSE.TYPE);
		expect(() =>
		{
			objAdjuster.adjust(0);
		}).toThrow(adjuster.CAUSE.TYPE);
	});
}

/**
 * required value
 */
function testRequired()
{
	const objAdjuster = adjuster.numberArray();
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
	const objAdjuster = adjuster.numberArray().default([1, 2]);
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
	const objAdjuster = adjuster.numberArray();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * empty string (allowed)
 */
function testAllowEmptyString()
{
	const objAdjuster = adjuster.numberArray().allowEmptyString([1, 2]);
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
	const objAdjuster = adjuster.numberArray().separatedBy(",");
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
	const objAdjuster = adjuster.numberArray().toArray();
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
	const objAdjuster = adjuster.numberArray().minLength(1);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([0])).toEqual([0]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([]);
		}).toThrow(adjuster.CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of elements
 */
function testMaxLength()
{
	const objAdjuster = adjuster.numberArray().maxLength(1);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([0])).toEqual([0]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([1, 2]);
		}).toThrow(adjuster.CAUSE.MAX_LENGTH);
	});
}

/**
 * maximum length of elements (adjusted)
 */
function testMaxLengthAdjusted()
{
	const objAdjuster = adjuster.numberArray().maxLength(1, true);
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
	const objAdjuster = adjuster.numberArray().ignoreEachErrors().separatedBy(",");
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
	const objAdjuster = adjuster.numberArray();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(["abc"]);
		}).toThrow(adjuster.CAUSE.EACH_TYPE);
		expect(() =>
		{
			objAdjuster.adjust([1, undefined, 3]);
		}).toThrow(adjuster.CAUSE.EACH_REQUIRED);
		expect(() =>
		{
			objAdjuster.adjust([""]);
		}).toThrow(adjuster.CAUSE.EACH_EMPTY);
	});
}

/**
 * each elements; default value
 */
function testEachDefault()
{
	const objAdjuster = adjuster.numberArray().eachDefault(999);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust([1, undefined, 3])).toEqual([1, 999, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([1, "", 3]);
		}).toThrow(adjuster.CAUSE.EACH_EMPTY);
	});
}

/**
 * each elements; empty string
 */
function testEachAllowEmptyString()
{
	const objAdjuster = adjuster.numberArray().eachAllowEmptyString(999);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust([1, "", 3])).toEqual([1, 999, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([1, undefined, 3]);
		}).toThrow(adjuster.CAUSE.EACH_REQUIRED);
	});
}

/**
 * each elements; set
 */
function testEachIn()
{
	const objAdjuster = adjuster.numberArray().eachIn(1, 2, 3);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([1, 2, 3])).toEqual([1, 2, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([0, 1, 2]);
		}).toThrow(adjuster.CAUSE.EACH_IN);
	});
}

/**
 * each elements; minimum value
 */
function testEachMinValue()
{
	const objAdjuster = adjuster.numberArray().eachMinValue(10);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([10, 11, 12])).toEqual([10, 11, 12]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([9, 10, 11]);
		}).toThrow(adjuster.CAUSE.EACH_MIN_VALUE);
	});
}

/**
 * each elements; minimum value (adjusted)
 */
function testEachMinValueAdjusted()
{
	const objAdjuster = adjuster.numberArray().eachMinValue(10, true);
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
	const objAdjuster = adjuster.numberArray().eachMaxValue(10);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([8, 9, 10])).toEqual([8, 9, 10]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust([9, 10, 11]);
		}).toThrow(adjuster.CAUSE.EACH_MAX_VALUE);
	});
}

/**
 * each elements; maximum value (adjusted)
 */
function testEachMaxValueAdjusted()
{
	const objAdjuster = adjuster.numberArray().eachMaxValue(10, true);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust([9, 10, 11])).toEqual([9, 10, 10]);
	});
}
