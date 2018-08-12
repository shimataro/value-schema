import adjuster from "index";

{
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
	describe("trim", testTrim);
	describe("maxLength", testMaxLength);
	describe("pattern", testPattern);
	describe("email", testEmail);
}

/**
 * default value
 * @returns {void}
 */
function testDefault()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.email().default("default@example.com")
			.adjust(undefined)).toEqual("default@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.email()
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
		expect(adjuster.email().acceptNull("empty@example.com")
			.adjust(null)).toEqual("empty@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.email()
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
		expect(adjuster.email().acceptEmptyString("empty@example.com")
			.adjust("")).toEqual("empty@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.email()
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
		expect(adjuster.email().trim()
			.adjust("\r\n trim@example.com \t ")).toEqual("trim@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.email().trim()
				.adjust(" \t\r\n ");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * maximum length of e-mail
 * @returns {void}
 */
function testMaxLength()
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
			expect(adjuster.email()
				.adjust(value)).toEqual(value);
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
				adjuster.email()
					.adjust(value);
			}).toThrow(adjuster.CAUSE.MAX_LENGTH);
		}
	});
}

/**
 * custom pattern
 * @returns {void}
 */
function testPattern()
{
	it("should be OK", () =>
	{
		expect(adjuster.email().pattern(/^\w+@([\w-]+\.)+\w+$/)
			.adjust("user@example.com")).toEqual("user@example.com");

		expect(adjuster.email().pattern(/^\w+@([\w-]+\.)+\w+$/)
			.adjust("user@example-domain.com")).toEqual("user@example-domain.com");

		expect(adjuster.email().pattern(/^\w+@([\w-]+\.)+\w+$/)
			.adjust("user@example.domain.com")).toEqual("user@example.domain.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.email().pattern(/^\w+@([\w-]+\.)+\w+$/)
				.adjust("john.doe@example.com");
		}).toThrow(adjuster.CAUSE.PATTERN);
	});
}

/**
 * e-mail format
 * @returns {void}
 */
function testEmail()
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
			expect(adjuster.email()
				.adjust(value)).toEqual(value);
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
				adjuster.email()
					.adjust(value);
			}).toThrow(adjuster.CAUSE.PATTERN);
		}
	});
}
