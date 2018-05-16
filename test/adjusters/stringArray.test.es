import {CAUSE} from "libs/constants";
import factoryStringArray from "adjusters/stringArray";

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
	describe("eachMinLength", testEachMinLength);
	describe("eachMaxLength", testEachMaxLength);
	describe("eachMaxLength (adjusted)", testEachMaxLengthAdjusted);
	describe("eachPattern", testEachPattern);
}

/**
 * type
 */
function testType()
{
	const objAdjuster = factoryStringArray();
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust([])).toEqual([]);
		expect(objAdjuster.adjust(["a", "b"])).toEqual(["a", "b"]);
	});
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(["a", 1, -2])).toEqual(["a", "1", "-2"]);
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
	const objAdjuster = factoryStringArray();
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
	const objAdjuster = factoryStringArray().default(["a", "b"]);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(undefined)).toEqual(["a", "b"]);
	});
}

/**
 * empty string
 */
function testEmptyString()
{
	const objAdjuster = factoryStringArray();
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
	const objAdjuster = factoryStringArray().allowEmptyString(["a", "b"]);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust("")).toEqual(["a", "b"]);
	});
}

/**
 * separator
 */
function testSeparatedBy()
{
	const objAdjuster = factoryStringArray().separatedBy(",");
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust("a,b,c")).toEqual(["a", "b", "c"]);
	});
}

/**
 * convert to array
 */
function testToArray()
{
	const objAdjuster = factoryStringArray().toArray();
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust("a")).toEqual(["a"]);
	});
}

/**
 * minimum length of elements
 */
function testMinLength()
{
	const objAdjuster = factoryStringArray().minLength(1);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(["a"])).toEqual(["a"]);
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
	const objAdjuster = factoryStringArray().maxLength(1);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(["a"])).toEqual(["a"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(["a", "b"]);
		}).toThrow(CAUSE.MAX_LENGTH);
	});
}

/**
 * maximum length of elements (adjusted)
 */
function testMaxLengthAdjusted()
{
	const objAdjuster = factoryStringArray().maxLength(1, true);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(["a"])).toEqual(["a"]);
	});
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(["a", "b"])).toEqual(["a"]);
	});
}

/**
 * ignore elements' error
 */
function testIgnoreEachErrors()
{
	const objAdjuster = factoryStringArray().ignoreEachErrors().separatedBy(",");
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust([undefined, "a", "", 1])).toEqual(["a", "1"]);
		expect(objAdjuster.adjust("a,,b,c,")).toEqual(["a", "b", "c"]);
	});
}

/**
 * each elements
 */
function testEach()
{
	const objAdjuster = factoryStringArray();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(["a", undefined, "b"]);
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
	const objAdjuster = factoryStringArray().eachDefault("z");
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(["a", undefined, "b"])).toEqual(["a", "z", "b"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(["a", "", "b"]);
		}).toThrow(CAUSE.EACH_EMPTY);
	});
}

/**
 * each elements; allow empty string
 */
function testEachAllowEmptyString()
{
	const objAdjuster = factoryStringArray().eachAllowEmptyString("z");
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(["a", "", "b"])).toEqual(["a", "z", "b"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(["a", undefined, "b"]);
		}).toThrow(CAUSE.EACH_REQUIRED);
	});
}

/**
 * each elements; set
 */
function testEachIn()
{
	const objAdjuster = factoryStringArray().eachIn("a", "b", "c");
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(["a", "b", "c"])).toEqual(["a", "b", "c"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(["a", "b", "x"]);
		}).toThrow(CAUSE.EACH_IN);
	});
}

/**
 * each elements; minimum length of string
 */
function testEachMinLength()
{
	const objAdjuster = factoryStringArray().eachMinLength(3);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(["abc", "xyz"])).toEqual(["abc", "xyz"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(["abc", "xy"]);
		}).toThrow(CAUSE.EACH_MIN_LENGTH);
	});
}

/**
 * each elements; maximum length of string
 */
function testEachMaxLength()
{
	const objAdjuster = factoryStringArray().eachMaxLength(3);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(["abc", "xyz"])).toEqual(["abc", "xyz"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(["abcd", "xyz0"]);
		}).toThrow(CAUSE.EACH_MAX_LENGTH);
	});
}

/**
 * each elements; maximum length of string (adjusted)
 */
function testEachMaxLengthAdjusted()
{
	const objAdjuster = factoryStringArray().eachMaxLength(3, true);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(["abc", "xyz"])).toEqual(["abc", "xyz"]);
	});
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(["abcd", "xyz0"])).toEqual(["abc", "xyz"]);
	});
}

/**
 * each elements; pattern
 */
function testEachPattern()
{
	const objAdjuster = factoryStringArray().eachPattern(/^Go+gle$/);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(["Gogle", "Google", "Gooogle"])).toEqual(["Gogle", "Google", "Gooogle"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(["google", "Ggle"]);
		}).toThrow(CAUSE.EACH_PATTERN);
	});
}
