import adjuster from "index";

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
	describe("trim", testTrim);
	describe("only", testOnly);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("pattern", testPattern);
}

/**
 * type
 * @returns {void}
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(adjuster.string()
			.adjust("abc")).toEqual("abc");

		expect(adjuster.string().strict()
			.adjust("abc")).toEqual("abc");
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.string()
			.adjust(0)).toEqual("0");

		expect(adjuster.string()
			.adjust(-1)).toEqual("-1");

		expect(adjuster.string()
			.adjust(true)).toEqual("true");

		expect(adjuster.string()
			.adjust(false)).toEqual("false");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().strict()
				.adjust(0);
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.string().strict()
				.adjust(true);
		}).toThrow(adjuster.CAUSE.TYPE);
	});
}

/**
 * default value
 * @returns {void}
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
 * null
 * @returns {void}
 */
function testAcceptNull()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.string().acceptNull("abc")
			.adjust(null)).toEqual("abc");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string()
				.adjust(null);
		}).toThrow(adjuster.CAUSE.NULL);
	});
}

/**
 * empty string
 * @returns {void}
 */
function testAcceptEmptyString()
{
	it("should be OK", () =>
	{
		expect(adjuster.string().acceptEmptyString("qwerty")
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
 * @returns {void}
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
 * @returns {void}
 */
function testOnly()
{
	it("should be OK", () =>
	{
		expect(adjuster.string().only("", "eat", "sleep", "play")
			.adjust("")).toEqual("");

		expect(adjuster.string().only("", "eat", "sleep", "play")
			.adjust("eat")).toEqual("eat");

		expect(adjuster.string().only("", "eat", "sleep", "play")
			.adjust("sleep")).toEqual("sleep");

		expect(adjuster.string().only("", "eat", "sleep", "play")
			.adjust("play")).toEqual("play");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().only("", "eat", "sleep", "play")
				.adjust("study");
		}).toThrow(adjuster.CAUSE.ONLY);
	});
}

/**
 * minimum length of string
 * @returns {void}
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
 * @returns {void}
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
 * @returns {void}
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

		expect(adjuster.string().pattern(adjuster.STRING_PATTERN.URI)
			.adjust("https://example.com/path/to/resource?name=value#hash")).toEqual("https://example.com/path/to/resource?name=value#hash");
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

		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING_PATTERN.URI)
				.adjust("https://例.com/");
		}).toThrow(adjuster.CAUSE.PATTERN);
	});
}
