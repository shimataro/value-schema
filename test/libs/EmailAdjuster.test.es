import {CAUSE} from "libs/constants";
import EmailAdjuster from "libs/EmailAdjuster";

{
	describe("required", testRequired);
	describe("default", testDefault);
	describe("empty", testEmpty);
	describe("allowEmpty", testAllowEmpty);
	describe("pattern", testPattern);
}

function testRequired()
{
	const objEmailAdjuster = new EmailAdjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objEmailAdjuster.adjust(undefined);
		}).toThrow(CAUSE.REQUIRED);
	});
}

function testDefault()
{
	const objEmailAdjuster = new EmailAdjuster().default("user@example.com");
	it("should be adjusted", () =>
	{
		expect(objEmailAdjuster.adjust(undefined)).toEqual("user@example.com");
	});
}

function testEmpty()
{
	const objEmailAdjuster = new EmailAdjuster();
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objEmailAdjuster.adjust("");
		}).toThrow(CAUSE.EMPTY);
	});
}

function testAllowEmpty()
{
	const objEmailAdjuster = new EmailAdjuster().allowEmpty();
	it("should be OK", () =>
	{
		expect(objEmailAdjuster.adjust("")).toEqual("");
	});
}

function testPattern()
{
	const objEmailAdjuster = new EmailAdjuster();
	it("should be OK", () =>
	{
		const values = [
			// dot-string
			"Abc@example.com",
			"user+mailbox/department=shipping@example.com",
			"!#$%&'*+-/=?^_`.{|}~@example.com",

			// quoted-pair
			"\"Fred\\\"Bloggs\"@example.com",
			"\"Joe.\\\\Blow\"@example.com",

			// domain
			"user@example-domain.com",
			"user@example2.com",
			"user@[1.1.1.1]",
			"user@[111.111.111.111]",
		];
		for(const value of values)
		{
			expect(objEmailAdjuster.adjust(value)).toEqual(value);
		}
	});
	it("should cause error(s)", () =>
	{
		const values = [
			"@", "user@", "@example.com",
			".a@example.com", "a.@example.com", "a..a@example.com",
			"user@example@com", "user-example-com",
			"user@example_domain.com", "user@example.com2",
			"user@[1...1]", "user@[1111.1111.1111.1111]",
		];
		for(const value of values)
		{
			expect(() =>
			{
				objEmailAdjuster.adjust(value);
			}).toThrow(CAUSE.EMAIL);
		}
	});
}
