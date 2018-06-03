import adjuster from "index";

{
	describe("default", testDefault);
	describe("allowEmptyString", testAllowEmptyString);
	describe("trim", testTrim);
	describe("pattern", testPattern);
}

/**
 * default value
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
 * empty string
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
