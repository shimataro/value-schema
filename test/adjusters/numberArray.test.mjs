import adjuster from "index";

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
	describe("separatedBy", testSeparatedBy);
	describe("toArray", testToArray);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("ignoreEachErrors", testIgnoreEachErrors);
	describe("eachStrict", testEachStrict);
	describe("eachDefault", testEachDefault);
	describe("eachAcceptNull", testEachAcceptNull);
	describe("eachAcceptEmptyString", testEachAcceptEmptyString);
	describe("eachAcceptSpecialFormats", testEachAcceptSpecialFormats);
	describe("eachInteger", testEachInteger);
	describe("eachOnly", testEachOnly);
	describe("eachMinValue", testEachMinValue);
	describe("eachMaxValue", testEachMaxValue);
}

/**
 * type
 * @return {void}
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(adjuster.numberArray()
			.adjust([])).toEqual([]);

		expect(adjuster.numberArray()
			.adjust([1, 2])).toEqual([1, 2]);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray()
			.adjust([1, "2", "+3", "-4"])).toEqual([1, 2, 3, -4]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray()
				.adjust("abc");
		}).toThrow(adjuster.CAUSE.TYPE);
		expect(() =>
		{
			adjuster.numberArray()
				.adjust(0);
		}).toThrow(adjuster.CAUSE.TYPE);
	});
}

/**
 * default value
 * @return {void}
 */
function testDefault()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().default([1, 2])
			.adjust(undefined)).toEqual([1, 2]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray()
				.adjust(undefined);
		}).toThrow(adjuster.CAUSE.REQUIRED);
	});
}

/**
 * null
 * @return {void}
 */
function testAcceptNull()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().acceptNull([1, 2, 3])
			.adjust(null)).toEqual([1, 2, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray()
				.adjust(null);
		}).toThrow(adjuster.CAUSE.NULL);
	});
}

/**
 * empty string
 * @return {void}
 */
function testAcceptEmptyString()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().acceptEmptyString([1, 2])
			.adjust("")).toEqual([1, 2]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray()
				.adjust("");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * separator
 * @return {void}
 */
function testSeparatedBy()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().separatedBy(",")
			.adjust("1,2,3")).toEqual([1, 2, 3]);
	});
}

/**
 * convert to array
 * @return {void}
 */
function testToArray()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().toArray()
			.adjust(0)).toEqual([0]);
	});
}

/**
 * minimum length of elements
 * @return {void}
 */
function testMinLength()
{
	it("should be OK", () =>
	{
		expect(adjuster.numberArray().minLength(1)
			.adjust([0])).toEqual([0]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray().minLength(1)
				.adjust([]);
		}).toThrow(adjuster.CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of elements
 * @return {void}
 */
function testMaxLength()
{
	it("should be OK", () =>
	{
		expect(adjuster.numberArray().maxLength(1)
			.adjust([0])).toEqual([0]);

		expect(adjuster.numberArray().maxLength(1, true)
			.adjust([0])).toEqual([0]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray().maxLength(1)
				.adjust([1, 2]);
		}).toThrow(adjuster.CAUSE.MAX_LENGTH);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().maxLength(1, true)
			.adjust([1, 2])).toEqual([1]);
	});
}

/**
 * ignore elements' error
 * @return {void}
 */
function testIgnoreEachErrors()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().ignoreEachErrors().separatedBy(",")
			.adjust([undefined, 1, "abc", 2])).toEqual([1, 2]);

		expect(adjuster.numberArray().ignoreEachErrors().separatedBy(",")
			.adjust("1,abc,2,,3")).toEqual([1, 2, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray()
				.adjust(["abc"]);
		}).toThrow(adjuster.CAUSE.EACH_TYPE);
		expect(() =>
		{
			adjuster.numberArray()
				.adjust([1, undefined, 3]);
		}).toThrow(adjuster.CAUSE.EACH_REQUIRED);
		expect(() =>
		{
			adjuster.numberArray()
				.adjust([""]);
		}).toThrow(adjuster.CAUSE.EACH_EMPTY);
	});
}

/**
 * each elements; strict type check
 * @return {void}
 */
function testEachStrict()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray()
			.adjust([true, "2", 3])).toEqual([1, 2, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray().eachStrict()
				.adjust([true, "2", 3]);
		}).toThrow(adjuster.CAUSE.EACH_TYPE);
	});
}

/**
 * each elements; default value
 * @return {void}
 */
function testEachDefault()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().eachDefault(999)
			.adjust([1, undefined, 3])).toEqual([1, 999, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray().eachDefault(999)
				.adjust([1, "", 3]);
		}).toThrow(adjuster.CAUSE.EACH_EMPTY);
	});
}

/**
 * each elements; null
 * @return {void}
 */
function testEachAcceptNull()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().eachAcceptNull(999)
			.adjust([1, null, 3])).toEqual([1, 999, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray()
				.adjust([1, null, 3]);
		}).toThrow(adjuster.CAUSE.EACH_NULL);
		expect(() =>
		{
			adjuster.numberArray().eachAcceptNull(999)
				.adjust([1, undefined, 3]);
		}).toThrow(adjuster.CAUSE.EACH_REQUIRED);
	});
}

/**
 * each elements; empty string
 * @return {void}
 */
function testEachAcceptEmptyString()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().eachAcceptEmptyString(999)
			.adjust([1, "", 3])).toEqual([1, 999, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray().eachAcceptEmptyString(999)
				.adjust([1, undefined, 3]);
		}).toThrow(adjuster.CAUSE.EACH_REQUIRED);
	});
}

/**
 * each elements; special formats
 * @return {void}
 */
function testEachAcceptSpecialFormats()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().eachAcceptSpecialFormats()
			.adjust(["1e+2", "0x100", "0o100", "0b100"])).toEqual([100, 256, 64, 4]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray()
				.adjust(["1e+2", "0x100", "0o100", "0b100"]);
		}).toThrow(adjuster.CAUSE.EACH_TYPE);
	});
}

/**
 * each elements; integer
 * @return {void}
 */
function testEachInteger()
{
	it("should be OK", () =>
	{
		expect(adjuster.numberArray().eachInteger()
			.adjust([1, 2, 3])).toEqual([1, 2, 3]);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().eachInteger(true)
			.adjust([3.14, -3.14, "3.14"])).toEqual([3, -3, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray().eachInteger()
				.adjust([3.14]);
		}).toThrow(adjuster.CAUSE.EACH_TYPE);
	});
}

/**
 * each elements; set
 * @return {void}
 */
function testEachOnly()
{
	it("should be OK", () =>
	{
		expect(adjuster.numberArray().eachOnly(1, 2, 3)
			.adjust([1, 2, 3])).toEqual([1, 2, 3]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray().eachOnly(1, 2, 3)
				.adjust([0, 1, 2]);
		}).toThrow(adjuster.CAUSE.EACH_ONLY);
	});
}

/**
 * each elements; minimum value
 * @return {void}
 */
function testEachMinValue()
{
	it("should be OK", () =>
	{
		expect(adjuster.numberArray().eachMinValue(10)
			.adjust([10, 11, 12])).toEqual([10, 11, 12]);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().eachMinValue(10, true)
			.adjust([9, 10, 11])).toEqual([10, 10, 11]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray().eachMinValue(10)
				.adjust([9, 10, 11]);
		}).toThrow(adjuster.CAUSE.EACH_MIN_VALUE);
	});
}

/**
 * each elements; maximum value
 * @return {void}
 */
function testEachMaxValue()
{
	it("should be OK", () =>
	{
		expect(adjuster.numberArray().eachMaxValue(10)
			.adjust([8, 9, 10])).toEqual([8, 9, 10]);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.numberArray().eachMaxValue(10, true)
			.adjust([9, 10, 11])).toEqual([9, 10, 10]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numberArray().eachMaxValue(10)
				.adjust([9, 10, 11]);
		}).toThrow(adjuster.CAUSE.EACH_MAX_VALUE);
	});
}
