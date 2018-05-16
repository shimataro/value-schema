import {CAUSE} from "libs/constants";
import factoryIPv6 from "adjusters/ipv6";

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
	const objAdjuster = factoryIPv6();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust(undefined);
		}).toThrow(CAUSE.REQUIRED);
	});
}

/**
 * default value
 */
function testDefault()
{
	const objAdjuster = factoryIPv6().default("::1");
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
	const objAdjuster = factoryIPv6();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("");
		}).toThrow(CAUSE.EMPTY);
	});
}

/**
 * empty string (allowd)
 */
function testAllowEmptyString()
{
	const objAdjuster = factoryIPv6().allowEmptyString("::1");
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("")).toEqual("::1");
	});
}

/**
 * IPv6 pattern
 */
function testPattern()
{
	const objAdjuster = factoryIPv6();
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
			}).toThrow(CAUSE.PATTERN);
		}
	});
}
