import {CAUSE} from "libs/constants";
import factoryIPv4 from "adjusters/ipv4";

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
	const objAdjuster = factoryIPv4();
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
	const objAdjuster = factoryIPv4().default("1.1.1.1");
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
	const objAdjuster = factoryIPv4();
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
	const objAdjuster = factoryIPv4().allowEmptyString("1.1.1.1");
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
	const objAdjuster = factoryIPv4();
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
			}).toThrow(CAUSE.PATTERN);
		}
	});
}
