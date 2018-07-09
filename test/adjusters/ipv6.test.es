import adjuster from "index";

{
	describe("default", testDefault);
	describe("allowNull", testAllowNull);
	describe("allowEmptyString", testAllowEmptyString);
	describe("trim", testTrim);
	describe("pattern", testPattern);
}

/**
 * default value
 * @return {void}
 */
function testDefault()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.ipv6().default("::1")
			.adjust(undefined)).toEqual("::1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.ipv6()
				.adjust(undefined);
		}).toThrow(adjuster.CAUSE.REQUIRED);
	});
}

/**
 * null
 * @return {void}
 */
function testAllowNull()
{
	it("should be OK", () =>
	{
		expect(adjuster.ipv6().allowNull("::1")
			.adjust(null)).toEqual("::1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.ipv6()
				.adjust(null);
		}).toThrow(adjuster.CAUSE.NULL);
	});
}

/**
 * empty string
 * @return {void}
 */
function testAllowEmptyString()
{
	it("should be OK", () =>
	{
		expect(adjuster.ipv6().allowEmptyString("::1")
			.adjust("")).toEqual("::1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.ipv6()
				.adjust("");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * remove whitespace from both ends
 * @return {void}
 */
function testTrim()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.ipv6().trim()
			.adjust("\r\n ::1 \t ")).toEqual("::1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.ipv6().trim()
				.adjust(" \t\r\n ");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * IPv6 pattern
 * @return {void}
 */
function testPattern()
{
	it("should be OK", () =>
	{
		const values = [
			"0000:0000:0000:0000:0000:0000:0000:0000",

			"::1",
			"::",
			"1::1",

			// IPv4-mapped address
			"::ffff:192.0.2.1",
		];
		for(const value of values)
		{
			expect(adjuster.ipv6()
				.adjust(value)).toEqual(value);
		}
	});
	it("should cause error(s)", () =>
	{
		const values = [
			"0000",
			"ffff:",
			"0000:0000:0000:0000:0000:0000:0000:0000:",
		];
		for(const value of values)
		{
			expect(() =>
			{
				adjuster.ipv6()
					.adjust(value);
			}).toThrow(adjuster.CAUSE.PATTERN);
		}
	});
}
