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
 * null
 * @return {void}
 */
function testAllowNull()
{
	it("should be OK", () =>
	{
		expect(adjuster.ipv4().allowNull("1.1.1.1")
			.adjust(null)).toEqual("1.1.1.1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.ipv4()
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
 * @return {void}
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
 * @return {void}
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
