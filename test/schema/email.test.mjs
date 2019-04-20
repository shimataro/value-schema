import vs from "value-schema"; // eslint-disable-line import/no-unresolved

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
	it("should be fitted", () =>
	{
		expect(vs.email().default("default@example.com")
			.fit(undefined)).toEqual("default@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.email()
				.fit(undefined);
		}).toThrow(vs.CAUSE.REQUIRED);
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
		expect(vs.email().acceptNull("empty@example.com")
			.fit(null)).toEqual("empty@example.com");

		expect(vs.email().acceptNull()
			.fit(null)).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.email()
				.fit(null);
		}).toThrow(vs.CAUSE.NULL);
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
		expect(vs.email().acceptEmptyString("empty@example.com")
			.fit("")).toEqual("empty@example.com");

		expect(vs.email().acceptEmptyString()
			.fit("")).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.email()
				.fit("");
		}).toThrow(vs.CAUSE.EMPTY);
	});
}

/**
 * remove whitespace from both ends
 * @returns {void}
 */
function testTrim()
{
	it("should be fitted", () =>
	{
		expect(vs.email().trim()
			.fit("\r\n trim@example.com \t ")).toEqual("trim@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.email().trim()
				.fit(" \t\r\n ");
		}).toThrow(vs.CAUSE.EMPTY);
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
			expect(vs.email()
				.fit(value)).toEqual(value);
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
				vs.email()
					.fit(value);
			}).toThrow(vs.CAUSE.MAX_LENGTH);
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
		expect(vs.email().pattern(/^\w+@([\w-]+\.)+\w+$/)
			.fit("user@example.com")).toEqual("user@example.com");

		expect(vs.email().pattern(/^\w+@([\w-]+\.)+\w+$/)
			.fit("user@example-domain.com")).toEqual("user@example-domain.com");

		expect(vs.email().pattern(/^\w+@([\w-]+\.)+\w+$/)
			.fit("user@example.domain.com")).toEqual("user@example.domain.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.email().pattern(/^\w+@([\w-]+\.)+\w+$/)
				.fit("john.doe@example.com");
		}).toThrow(vs.CAUSE.PATTERN);
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
			expect(vs.email()
				.fit(value)).toEqual(value);
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
				vs.email()
					.fit(value);
			}).toThrow(vs.CAUSE.PATTERN);
		}
	});
}
