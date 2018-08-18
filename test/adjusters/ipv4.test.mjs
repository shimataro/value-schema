import adjuster from "index"; // eslint-disable-line import/no-unresolved

{
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
	describe("trim", testTrim);
	describe("pattern", testPattern);
}

/**
 * default value
 * @returns {void}
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
 * @returns {void}
 */
function testAcceptNull()
{
	it("should be OK", () =>
	{
		expect(adjuster.ipv4().acceptNull("1.1.1.1")
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
 * @returns {void}
 */
function testAcceptEmptyString()
{
	it("should be OK", () =>
	{
		expect(adjuster.ipv4().acceptEmptyString("1.1.1.1")
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
 * @returns {void}
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
 * @returns {void}
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
