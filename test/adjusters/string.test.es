import {CAUSE} from "libs/constants";
import factoryString from "adjusters/string";

{
	describe("type", testType);
	describe("required", testRequired);
	describe("default", testDefault);
	describe("emptyString", testEmptyString);
	describe("allowEmptyString", testAllowEmptyString);
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
	const objAdjuster = factoryString();
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust(0)).toEqual("0");
		expect(objAdjuster.adjust(-1)).toEqual("-1");
	});
}

/**
 * required value
 */
function testRequired()
{
	const objAdjuster = factoryString();
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
	const objAdjuster = factoryString().default("xyz");
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(undefined)).toEqual("xyz");
	});
}

/**
 * empty string
 */
function testEmptyString()
{
	const objAdjuster = factoryString();
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
	const objAdjuster = factoryString().allowEmptyString("qwerty");
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("")).toEqual("qwerty");
	});
}

/**
 * set
 */
function testIn()
{
	const objAdjuster = factoryString().in("", "eat", "sleep", "play");
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("")).toEqual("");
		expect(objAdjuster.adjust("eat")).toEqual("eat");
		expect(objAdjuster.adjust("sleep")).toEqual("sleep");
		expect(objAdjuster.adjust("play")).toEqual("play");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("study");
		}).toThrow(CAUSE.IN);
	});
}

/**
 * minimum length of string
 */
function testMinLength()
{
	const objAdjuster = factoryString().minLength(4);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("1234")).toEqual("1234");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("abc");
		}).toThrow(CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of string
 */
function testMaxLength()
{
	const objAdjuster = factoryString().maxLength(8);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("12345678")).toEqual("12345678");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("123456789");
		}).toThrow(CAUSE.MAX_LENGTH);
	});
}

/**
 * maximum length of string (adjusted)
 */
function testMaxLengthAdjusted()
{
	const objAdjuster = factoryString().maxLength(8, true);
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust("123456789")).toEqual("12345678");
	});
}

/**
 * pattern
 */
function testPattern()
{
	const objAdjuster = factoryString().pattern(/^Go+gle$/);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("Gogle")).toEqual("Gogle");
		expect(objAdjuster.adjust("Google")).toEqual("Google");
		expect(objAdjuster.adjust("Gooogle")).toEqual("Gooogle");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("Ggle");
		}).toThrow(CAUSE.PATTERN);

		expect(() =>
		{
			objAdjuster.adjust("google");
		}).toThrow(CAUSE.PATTERN);
	});
}
