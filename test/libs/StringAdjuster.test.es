import {CAUSE} from "libs/constants";
import StringAdjuster from "libs/StringAdjuster";

{
	describe("type", testType);
	describe("required", testRequired);
	describe("default", testDefault);
	describe("empty", testEmpty);
	describe("allowEmpty", testAllowEmpty);
	describe("in", testIn);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("maxLength (adjusted)", testMaxLengthAdjusted);
	describe("pattern", testPattern);
}

/**
 * type
 */
function testType()
{
	const objStringAdjuster = new StringAdjuster();
	it("should be OK", () =>
	{
		expect(objStringAdjuster.adjust(0)).toEqual("0");
		expect(objStringAdjuster.adjust(-1)).toEqual("-1");
	});
}

/**
 * required value
 */
function testRequired()
{
	const objStringAdjuster = new StringAdjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringAdjuster.adjust(undefined);
		}).toThrow(CAUSE.REQUIRED);
	});
}

/**
 * default value
 */
function testDefault()
{
	const objStringAdjuster = new StringAdjuster().default("xyz");
	it("should be adjusted", () =>
	{
		expect(objStringAdjuster.adjust(undefined)).toEqual("xyz");
	});
}

/**
 * empty value
 */
function testEmpty()
{
	const objStringAdjuster = new StringAdjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringAdjuster.adjust("");
		}).toThrow(CAUSE.EMPTY);
	});
}

/**
 * empty value (allowed)
 */
function testAllowEmpty()
{
	const objStringAdjuster = new StringAdjuster().allowEmpty("qwerty");
	it("should be OK", () =>
	{
		expect(objStringAdjuster.adjust("")).toEqual("qwerty");
	});
}

/**
 * set
 */
function testIn()
{
	const objStringAdjuster = new StringAdjuster().in("", "eat", "sleep", "play");
	it("should be OK", () =>
	{
		expect(objStringAdjuster.adjust("")).toEqual("");
		expect(objStringAdjuster.adjust("eat")).toEqual("eat");
		expect(objStringAdjuster.adjust("sleep")).toEqual("sleep");
		expect(objStringAdjuster.adjust("play")).toEqual("play");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringAdjuster.adjust("study");
		}).toThrow(CAUSE.IN);
	});
}

/**
 * minimum length of string
 */
function testMinLength()
{
	const objStringAdjuster = new StringAdjuster().minLength(4);
	it("should be OK", () =>
	{
		expect(objStringAdjuster.adjust("1234")).toEqual("1234");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringAdjuster.adjust("abc");
		}).toThrow(CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of string
 */
function testMaxLength()
{
	const objStringAdjuster = new StringAdjuster().maxLength(8);
	it("should be OK", () =>
	{
		expect(objStringAdjuster.adjust("12345678")).toEqual("12345678");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringAdjuster.adjust("123456789");
		}).toThrow(CAUSE.MAX_LENGTH);
	});
}

/**
 * maximum length of string (adjusted)
 */
function testMaxLengthAdjusted()
{
	const objStringAdjuster = new StringAdjuster().maxLength(8, true);
	it("should be adjusted", () =>
	{
		expect(objStringAdjuster.adjust("123456789")).toEqual("12345678");
	});
}

/**
 * pattern
 */
function testPattern()
{
	const objStringAdjuster = new StringAdjuster().pattern(/^Go+gle$/);
	it("should be OK", () =>
	{
		expect(objStringAdjuster.adjust("Gogle")).toEqual("Gogle");
		expect(objStringAdjuster.adjust("Google")).toEqual("Google");
		expect(objStringAdjuster.adjust("Gooogle")).toEqual("Gooogle");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objStringAdjuster.adjust("Ggle");
		}).toThrow(CAUSE.PATTERN);

		expect(() =>
		{
			objStringAdjuster.adjust("google");
		}).toThrow(CAUSE.PATTERN);
	});
}
