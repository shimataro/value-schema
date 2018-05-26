import adjuster from "index";

{
	describe("required", testRequired);
	describe("default", testDefault);
	describe("emptyString", testEmptyString);
	describe("allowEmptyString", testAllowEmptyString);
	describe("trim", testTrim);
	describe("pattern", testPattern);
}

/**
 * required value
 */
function testRequired()
{
	const objAdjuster = adjuster.ipv6();
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
	const objAdjuster = adjuster.ipv6().default("::1");
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(undefined)).toEqual("::1");
	});
}

/**
 * empty string
 */
function testEmptyString()
{
	const objAdjuster = adjuster.ipv6();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * empty string (allowd)
 */
function testAllowEmptyString()
{
	const objAdjuster = adjuster.ipv6().allowEmptyString("::1");
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("")).toEqual("::1");
	});
}

/**
 * remove whitespace from both ends
 */
function testTrim()
{
	const objAdjuster = adjuster.ipv6().trim();
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust("\r\n ::1 \t ")).toEqual("::1");
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
 * IPv6 pattern
 */
function testPattern()
{
	const objAdjuster = adjuster.ipv6();
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
			expect(objAdjuster.adjust(value)).toEqual(value);
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
				objAdjuster.adjust(value);
			}).toThrow(adjuster.CAUSE.PATTERN);
		}
	});
}
