import {CAUSE} from "libs/constants";
import IPv4Adjuster from "libs/IPv4Adjuster";

{
	describe("required", testRequired);
	describe("default", testDefault);
	describe("empty", testEmpty);
	describe("allowEmpty", testAllowEmpty);
	describe("IPv4", testIPv4);
}

/**
 * required value
 */
function testRequired()
{
	const objIPv4Adjuster = new IPv4Adjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objIPv4Adjuster.adjust(undefined);
		}).toThrow(CAUSE.REQUIRED);
	});
}

/**
 * default value
 */
function testDefault()
{
	const objIPv4Adjuster = new IPv4Adjuster().default("1.1.1.1");
	it("should be adjusted", () =>
	{
		expect(objIPv4Adjuster.adjust(undefined)).toEqual("1.1.1.1");
	});
}

/**
 * empty value
 */
function testEmpty()
{
	const objIPv4Adjuster = new IPv4Adjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objIPv4Adjuster.adjust("");
		}).toThrow(CAUSE.EMPTY);
	});
}

/**
 * empty value (allowd)
 */
function testAllowEmpty()
{
	const objIPv4Adjuster = new IPv4Adjuster().allowEmpty("1.1.1.1");
	it("should be OK", () =>
	{
		expect(objIPv4Adjuster.adjust("")).toEqual("1.1.1.1");
	});
}

/**
 * IPv4 string
 */
function testIPv4()
{
	const objIPv4Adjuster = new IPv4Adjuster();
	it("should be OK", () =>
	{
		const values = [
			"0.0.0.0",
			"192.168.0.1",
			"255.255.255.255",
		];
		for(const value of values)
		{
			expect(objIPv4Adjuster.adjust(value)).toEqual(value);
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
				objIPv4Adjuster.adjust(value);
			}).toThrow(CAUSE.IPV4);
		}
	});
}
