import adjuster from "index";

{
	describe("type", testType);
	describe("default", testDefault);
	describe("allowEmptyString", testAllowEmptyString);
	describe("trim", testTrim);
	describe("in", testIn);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("pattern", testPattern);
}

/**
 * type
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(adjuster.string()
			.adjust(0)).toEqual("0");

		expect(adjuster.string()
			.adjust(-1)).toEqual("-1");
	});
}

/**
 * default value
 */
function testDefault()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.string().default("xyz")
			.adjust(undefined)).toEqual("xyz");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string()
				.adjust(undefined);
		}).toThrow(adjuster.CAUSE.REQUIRED);
	});
}

/**
 * empty string
 */
function testAllowEmptyString()
{
	it("should be OK", () =>
	{
		expect(adjuster.string().allowEmptyString("qwerty")
			.adjust("")).toEqual("qwerty");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string()
				.adjust("");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * remove whitespace from both ends
 */
function testTrim()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.string().trim()
			.adjust("\r\n hell, word \t ")).toEqual("hell, word");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().trim()
				.adjust(" \t\r\n ");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * set
 */
function testIn()
{
	it("should be OK", () =>
	{
		expect(adjuster.string().in("", "eat", "sleep", "play")
			.adjust("")).toEqual("");

		expect(adjuster.string().in("", "eat", "sleep", "play")
			.adjust("eat")).toEqual("eat");

		expect(adjuster.string().in("", "eat", "sleep", "play")
			.adjust("sleep")).toEqual("sleep");

		expect(adjuster.string().in("", "eat", "sleep", "play")
			.adjust("play")).toEqual("play");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().in("", "eat", "sleep", "play")
				.adjust("study");
		}).toThrow(adjuster.CAUSE.IN);
	});
}

/**
 * minimum length of string
 */
function testMinLength()
{
	it("should be OK", () =>
	{
		expect(adjuster.string().minLength(4)
			.adjust("1234")).toEqual("1234");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().minLength(4)
				.adjust("abc");
		}).toThrow(adjuster.CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of string
 */
function testMaxLength()
{
	it("should be OK", () =>
	{
		expect(adjuster.string().maxLength(8)
			.adjust("12345678")).toEqual("12345678");
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.string().maxLength(8, true)
			.adjust("123456789")).toEqual("12345678");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().maxLength(8)
				.adjust("123456789");
		}).toThrow(adjuster.CAUSE.MAX_LENGTH);
	});
}

/**
 * pattern
 */
function testPattern()
{
	it("should be OK", () =>
	{
		expect(adjuster.string().pattern(/^Go+gle$/)
			.adjust("Gogle")).toEqual("Gogle");

		expect(adjuster.string().pattern(/^Go+gle$/)
			.adjust("Google")).toEqual("Google");

		expect(adjuster.string().pattern(/^Go+gle$/)
			.adjust("Gooogle")).toEqual("Gooogle");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().pattern(/^Go+gle$/)
				.adjust("Ggle");
		}).toThrow(adjuster.CAUSE.PATTERN);

		expect(() =>
		{
			adjuster.string().pattern(/^Go+gle$/)
				.adjust("google");
		}).toThrow(adjuster.CAUSE.PATTERN);
	});
}
