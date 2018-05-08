import {CAUSE} from "libs/constants";
import StringArrayAdjuster from "libs/StringArrayAdjuster";

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
	const objStringArrayAdjuster = new StringArrayAdjuster();
	it("should be OK", () =>
	{
		expect(objStringArrayAdjuster.adjust([])).toEqual([]);
		expect(objStringArrayAdjuster.adjust(["a", "b"])).toEqual(["a", "b"]);
	});
	it("should be adjusted", () =>
	{
		expect(objStringArrayAdjuster.adjust(["a", 1, -2])).toEqual(["a", "1", "-2"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust("abc");
		}).toThrow(CAUSE.TYPE);
	});
}

/**
 * required value
 */
function testRequired()
{
	const objStringArrayAdjuster = new StringArrayAdjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust(undefined);
		}).toThrow(CAUSE.REQUIRED);
	});
}

/**
 * default value
 */
function testDefault()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().default(["a", "b"]);
	it("should be adjusted", () =>
	{
		expect(objStringArrayAdjuster.adjust(undefined)).toEqual(["a", "b"]);
	});
}

/**
 * empty value
 */
function testEmpty()
{
	const objStringArrayAdjuster = new StringArrayAdjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust("");
		}).toThrow(CAUSE.EMPTY);
	});
}

/**
 * empty value (allowed)
 */
function testAllowEmpty()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().allowEmpty(["a", "b"]);
	it("should be adjusted", () =>
	{
		expect(objStringArrayAdjuster.adjust("")).toEqual(["a", "b"]);
	});
}

/**
 * separator
 */
function testSeparatedBy()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().separatedBy(",");
	it("should be adjusted", () =>
	{
		expect(objStringArrayAdjuster.adjust("a,b,c")).toEqual(["a", "b", "c"]);
	});
}

/**
 * convert to array
 */
function testToArray()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().toArray();
	it("should be adjusted", () =>
	{
		expect(objStringArrayAdjuster.adjust("a")).toEqual(["a"]);
	});
}

/**
 * minimum length of elements
 */
function testMinLength()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().minLength(1);
	it("should be OK", () =>
	{
		expect(objStringArrayAdjuster.adjust(["a"])).toEqual(["a"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust([]);
		}).toThrow(CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of elements
 */
function testMaxLength()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().maxLength(1);
	it("should be OK", () =>
	{
		expect(objStringArrayAdjuster.adjust(["a"])).toEqual(["a"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust(["a", "b"]);
		}).toThrow(CAUSE.MAX_LENGTH);
	});
}

/**
 * maximum length of elements (adjusted)
 */
function testMaxLengthAdjusted()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().maxLength(1, true);
	it("should be OK", () =>
	{
		expect(objStringArrayAdjuster.adjust(["a"])).toEqual(["a"]);
	});
	it("should be adjusted", () =>
	{
		expect(objStringArrayAdjuster.adjust(["a", "b"])).toEqual(["a"]);
	});
}

/**
 * ignore elements' error
 */
function testIgnoreEachErrors()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().ignoreEachErrors().separatedBy(",");
	it("should be adjusted", () =>
	{
		expect(objStringArrayAdjuster.adjust([undefined, "a", "", 1])).toEqual(["a", "1"]);
		expect(objStringArrayAdjuster.adjust("a,,b,c,")).toEqual(["a", "b", "c"]);
	});
}

/**
 * each elements
 */
function testEach()
{
	const objStringArrayAdjuster = new StringArrayAdjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust(["a", undefined, "b"]);
		}).toThrow(CAUSE.EACH_REQUIRED);
		expect(() =>
		{
			objStringArrayAdjuster.adjust([""]);
		}).toThrow(CAUSE.EACH_EMPTY);
	});
}

/**
 * each elements; default value
 */
function testEachDefault()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().eachDefault("z");
	it("should be adjusted", () =>
	{
		expect(objStringArrayAdjuster.adjust(["a", undefined, "b"])).toEqual(["a", "z", "b"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust(["a", "", "b"]);
		}).toThrow(CAUSE.EACH_EMPTY);
	});
}

/**
 * each elements; allow empty element
 */
function testEachAllowEmpty()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().eachAllowEmpty("z");
	it("should be adjusted", () =>
	{
		expect(objStringArrayAdjuster.adjust(["a", "", "b"])).toEqual(["a", "z", "b"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust(["a", undefined, "b"]);
		}).toThrow(CAUSE.EACH_REQUIRED);
	});
}

/**
 * each elements; set
 */
function testEachIn()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().eachIn("a", "b", "c");
	it("should be OK", () =>
	{
		expect(objStringArrayAdjuster.adjust(["a", "b", "c"])).toEqual(["a", "b", "c"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust(["a", "b", "x"]);
		}).toThrow(CAUSE.EACH_IN);
	});
}

/**
 * each elements; minimum length of string
 */
function testEachMinLength()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().eachMinLength(3);
	it("should be OK", () =>
	{
		expect(objStringArrayAdjuster.adjust(["abc", "xyz"])).toEqual(["abc", "xyz"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust(["abc", "xy"]);
		}).toThrow(CAUSE.EACH_MIN_LENGTH);
	});
}

/**
 * each elements; maximum length of string
 */
function testEachMaxLength()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().eachMaxLength(3);
	it("should be OK", () =>
	{
		expect(objStringArrayAdjuster.adjust(["abc", "xyz"])).toEqual(["abc", "xyz"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust(["abcd", "xyz0"]);
		}).toThrow(CAUSE.EACH_MAX_LENGTH);
	});
}

/**
 * each elements; maximum length of string (adjusted)
 */
function testEachMaxLengthAdjusted()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().eachMaxLength(3, true);
	it("should be OK", () =>
	{
		expect(objStringArrayAdjuster.adjust(["abc", "xyz"])).toEqual(["abc", "xyz"]);
	});
	it("should be adjusted", () =>
	{
		expect(objStringArrayAdjuster.adjust(["abcd", "xyz0"])).toEqual(["abc", "xyz"]);
	});
}

/**
 * each elements; pattern
 */
function testEachPattern()
{
	const objStringArrayAdjuster = new StringArrayAdjuster().eachPattern(/^Go+gle$/);
	it("should be OK", () =>
	{
		expect(objStringArrayAdjuster.adjust(["Gogle", "Google", "Gooogle"])).toEqual(["Gogle", "Google", "Gooogle"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringArrayAdjuster.adjust(["google", "Ggle"]);
		}).toThrow(CAUSE.EACH_PATTERN);
	});
}
