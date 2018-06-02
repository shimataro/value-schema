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
		expect(adjuster.ipv4().default("1.1.1.1")
			.adjust(undefined)).toEqual("1.1.1.1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.ipv4()
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
		expect(adjuster.ipv4().allowEmptyString("1.1.1.1")
			.adjust("")).toEqual("1.1.1.1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.ipv4()
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
		expect(adjuster.ipv4().trim()
			.adjust("\r\n 1.1.1.1 \t ")).toEqual("1.1.1.1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.ipv4().trim()
				.adjust(" \t\r\n ");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * IPv4 pattern
 */
function testPattern()
{
	it("should be OK", () =>
	{
		const values = [
			"0.0.0.0",
			"192.168.0.1",
			"255.255.255.255",
		];
		for(const value of values)
		{
			expect(adjuster.ipv4()
				.adjust(value)).toEqual(value);
		}
	});
	it("should cause error(s)", () =>
	{
		const values = [
			"0.0.0.",
			"0.0.0.0.",
			"255.255.255.256",
			"999.255.255.255",
		];
		for(const value of values)
		{
			expect(() =>
			{
				adjuster.ipv4()
					.adjust(value);
			}).toThrow(adjuster.CAUSE.PATTERN);
		}
	});
}
