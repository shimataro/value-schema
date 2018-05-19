import adjuster from "index";

{
	describe("required", testRequired);
	describe("default", testDefault);
	describe("emptyString", testEmptyString);
	describe("allowEmptyString", testAllowEmptyString);
	describe("pattern", testPattern);
}

/**
 * required value
 */
function testRequired()
{
	const objAdjuster = adjuster.ipv4();
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
	const objAdjuster = adjuster.ipv4().default("1.1.1.1");
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust(undefined)).toEqual("1.1.1.1");
	});
}

/**
 * empty string
 */
function testEmptyString()
{
	const objAdjuster = adjuster.ipv4();
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
	const objAdjuster = adjuster.ipv4().allowEmptyString("1.1.1.1");
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("")).toEqual("1.1.1.1");
	});
}

/**
 * IPv4 pattern
 */
function testPattern()
{
	const objAdjuster = adjuster.ipv4();
	it("should be OK", () =>
	{
		const values = [
			"0.0.0.0",
			"192.168.0.1",
			"255.255.255.255",
		];
		for(const value of values)
		{
			expect(objAdjuster.adjust(value)).toEqual(value);
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
				objAdjuster.adjust(value);
			}).toThrow(adjuster.CAUSE.PATTERN);
		}
	});
}
