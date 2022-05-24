import vs from "value-schema";
import {describe, expect, it} from "@jest/globals";

{
	describe("isUndefined", testIfUndefined);
	describe("isNull", testIfNull);
	describe("isEmptyString", testAcceptEmptyString);
	describe("trims", testTrims);
	describe("maxLength", testMaxLength);
	describe("pattern", testPattern);
	describe("email", testEmail);
}

/**
 * if undefined
 */
function testIfUndefined(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.email({
				ifUndefined: "default@example.com",
			}).applyTo(undefined)
		).toEqual("default@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.email().applyTo(undefined);
		}).toThrow(vs.RULE.UNDEFINED);
	});
}

/**
 * if null
 */
function testIfNull(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.email({
				ifNull: "empty@example.com",
			}).applyTo(null)
		).toEqual("empty@example.com");

		expect(
			vs.email({
				ifNull: null,
			}).applyTo(null)
		).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.email().applyTo(null);
		}).toThrow(vs.RULE.NULL);
	});
}

/**
 * if empty string
 */
function testAcceptEmptyString(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.email({
				ifEmptyString: "empty@example.com",
			}).applyTo("")
		).toEqual("empty@example.com");

		expect(
			vs.email({
				ifEmptyString: null,
			}).applyTo("")
		).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.email().applyTo("");
		}).toThrow(vs.RULE.EMPTY_STRING);
	});
}

/**
 * remove whitespace from both ends
 */
function testTrims(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.email({
				trims: true,
			}).applyTo("\r\n trim@example.com \t ")
		).toEqual("trim@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.email({
				trims: true,
			}).applyTo(" \t\r\n ");
		}).toThrow(vs.RULE.EMPTY_STRING);
	});
}

/**
 * maximum length of e-mail
 */
function testMaxLength(): void
{
	it("should be OK", () =>
	{
		const values = [
			"1234567890123456789012345678901234567890123456789012345678901234@example.com",
			"user@12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901.com",
			"1234567890123456789012345678901234567890123456789012345678901234@12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901.com",
		];
		for(const value of values)
		{
			expect(
				vs.email().applyTo(value)
			).toEqual(value);
		}
	});
	it("should cause error(s)", () =>
	{
		const values = [
			"12345678901234567890123456789012345678901234567890123456789012345@example.com",
			"user@123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012.com",
			"12345678901234567890123456789012345678901234567890123456789012345@12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901.com",
			"1234567890123456789012345678901234567890123456789012345678901234@123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012.com",
		];
		for(const value of values)
		{
			expect(() =>
			{
				vs.email().applyTo(value);
			}).toThrow(vs.RULE.MAX_LENGTH);
		}
	});
}

/**
 * custom pattern
 */
function testPattern(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.email({
				pattern: /^\w+@([\w-]+\.)+\w+$/,
			}).applyTo("user@example.com")
		).toEqual("user@example.com");

		expect(
			vs.email({
				pattern: /^\w+@([\w-]+\.)+\w+$/,
			}).applyTo("user@example-domain.com")
		).toEqual("user@example-domain.com");

		expect(
			vs.email({
				pattern: /^\w+@([\w-]+\.)+\w+$/,
			}).applyTo("user@example.domain.com")
		).toEqual("user@example.domain.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.email({
				pattern: /^\w+@([\w-]+\.)+\w+$/,
			}).applyTo("john.doe@example.com");
		}).toThrow(vs.RULE.PATTERN);
	});
}

/**
 * e-mail format
 */
function testEmail(): void
{
	it("should be OK", () =>
	{
		const values = [
			// dot-string
			"Abc@example.com",
			"user+mailbox/department=shipping@example.com",
			"!#$%&'*+-/=?^_`.{|}~@example.com",

			// quoted-string
			"\"Fred\\\"Bloggs\"@example.com",
			"\"Joe.\\\\Blow\"@example.com",
			"\"...\"@example.com",
			"\"(@_@) >_< ...(o;_;)o\"@example.com",

			// domain
			"user@example-domain.com",
			"user@example2.com",
			"user@[1.1.1.1]",
			"user@[255.255.255.255]",
			"user@[IPv6:::]",
			"user@[IPv6:::0]",
			"user@[IPv6:0::0]",
			"user@[IPv6:ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff]",
			"user@[IPv6:1::1:192.168.0.1]",
			"user@[IPv6:ffff:ffff:ffff:ffff:ffff:ffff:192.168.0.1]",
		];
		for(const value of values)
		{
			expect(
				vs.email().applyTo(value)
			).toEqual(value);
		}
	});
	it("should cause error(s)", () =>
	{
		const values = [
			"@", "user@", "@example.com",
			".a@example.com", "a.@example.com", "a..a@example.com",
			"user@example@com", "user-example-com",
			"user@example_domain.com", "user@example.com2",
			"user@[256.256.256.256]",
			"user@[1...1]", "user@[1111.1111.1111.1111]",
			"user@[IPv6:0::0::0]",
			"user@[IPv6:ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffff]",
			"user@[IPv6:ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff]",
			"user@[IPv6:ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffff:192.168.0.1]",
			"user@[IPv6:ffff:ffff:ffff:ffff:ffff:ffff:ffff:192.168.0.1]",
		];
		for(const value of values)
		{
			expect(() =>
			{
				vs.email().applyTo(value);
			}).toThrow(vs.RULE.PATTERN);
		}
	});
}
