import adjuster from "index";

{
	describe("type", testType);
	describe("required", testRequired);
	describe("default", testDefault);
	describe("emptyString", testEmptyString);
	describe("allowEmptyString", testAllowEmptyString);
	describe("trim", testTrim);
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
	const objAdjuster = adjuster.string();
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
	const objAdjuster = adjuster.string();
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
	const objAdjuster = adjuster.string().default("xyz");
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
	const objAdjuster = adjuster.string();
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
	const objAdjuster = adjuster.string().allowEmptyString("qwerty");
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("")).toEqual("qwerty");
	});
}

/**
 * remove whitespace from both ends
 */
function testTrim()
{
	const objAdjuster = adjuster.string().trim();
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust("\r\n hell, word \t ")).toEqual("hell, word");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(" \t\r\n ");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * set
 */
function testIn()
{
	const objAdjuster = adjuster.string().in("", "eat", "sleep", "play");
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
		}).toThrow(adjuster.CAUSE.IN);
	});
}

/**
 * minimum length of string
 */
function testMinLength()
{
	const objAdjuster = adjuster.string().minLength(4);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("1234")).toEqual("1234");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("abc");
		}).toThrow(adjuster.CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of string
 */
function testMaxLength()
{
	const objAdjuster = adjuster.string().maxLength(8);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("12345678")).toEqual("12345678");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("123456789");
		}).toThrow(adjuster.CAUSE.MAX_LENGTH);
	});
}

/**
 * maximum length of string (adjusted)
 */
function testMaxLengthAdjusted()
{
	const objAdjuster = adjuster.string().maxLength(8, true);
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
	const objAdjuster = adjuster.string().pattern(/^Go+gle$/);
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
		}).toThrow(adjuster.CAUSE.PATTERN);

		expect(() =>
		{
			objAdjuster.adjust("google");
		}).toThrow(adjuster.CAUSE.PATTERN);
	});
}
