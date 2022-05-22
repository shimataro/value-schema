import vs from "value-schema";

{
	describe("type", testType);
	describe("ifUndefined", testIfUndefined);
	describe("ifNull", testIfNull);
	describe("ifEmptyString", testIfEmptyString);
	describe("trims", testTrims);
	describe("only", testOnly);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("pattern", testPattern);
	describe("converter", testConverter);
}

/**
 * type
 */
function testType(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.string().applyTo("abc")
		).toEqual("abc");

		expect(
			vs.string({
				strictType: true,
			}).applyTo("abc")
		).toEqual("abc");
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.string().applyTo(0)
		).toEqual("0");

		expect(
			vs.string().applyTo(-1)
		).toEqual("-1");

		expect(
			vs.string().applyTo(true)
		).toEqual("true");

		expect(
			vs.string().applyTo(false)
		).toEqual("false");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().applyTo([]);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.string().applyTo({});
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.string({
				strictType: true,
			}).applyTo(0);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.string({
				strictType: true,
			}).applyTo(true);
		}).toThrow(vs.CAUSE.TYPE);
	});
}

/**
 * if undefined
 */
function testIfUndefined(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.string({
				ifUndefined: "xyz",
			}).applyTo(undefined)
		).toEqual("xyz");
	});
	it("should be undefined", () =>
	{
		expect(
			vs.string({
				ifUndefined: undefined,
			}).applyTo(undefined)
		).toBeUndefined();
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);
	});
}

/**
 * if null
 */
function testIfNull(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.string({
				ifNull: "abc",
			}).applyTo(null)
		).toEqual("abc");

		expect(
			vs.string({
				ifNull: null,
			}).applyTo(null)
		).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().applyTo(null);
		}).toThrow(vs.CAUSE.NULL);
	});
}

/**
 * if empty string
 */
function testIfEmptyString(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.string({
				ifEmptyString: "qwerty",
			}).applyTo("")
		).toEqual("qwerty");

		expect(
			vs.string({
				ifEmptyString: null,
			}).applyTo("")
		).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);
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
			vs.string({
				trims: true,
			}).applyTo("\r\n hell, word \t ")
		).toEqual("hell, word");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				trims: true,
			}).applyTo(" \t\r\n ");
		}).toThrow(vs.CAUSE.EMPTY_STRING);
	});
}

/**
 * only
 */
function testOnly(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.string({
				only: ["", "eat", "sleep", "play"],
			}).applyTo("")
		).toEqual("");

		expect(
			vs.string({
				only: ["", "eat", "sleep", "play"],
			}).applyTo("eat")
		).toEqual("eat");

		expect(
			vs.string({
				only: ["", "eat", "sleep", "play"],
			}).applyTo("sleep")
		).toEqual("sleep");

		expect(
			vs.string({
				only: ["", "eat", "sleep", "play"],
			}).applyTo("play")
		).toEqual("play");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				only: ["", "eat", "sleep", "play"],
			}).applyTo("study");
		}).toThrow(vs.CAUSE.ONLY);
		expect(() =>
		{
			vs.string({
				only: ["", "eat", "sleep", "play"],
			}).applyTo("EAT");
		}).toThrow(vs.CAUSE.ONLY);
	});
}

/**
 * minimum length of string
 */
function testMinLength(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.string({
				minLength: 4,
			}).applyTo("1234")
		).toEqual("1234");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				minLength: 4,
			}).applyTo("abc");
		}).toThrow(vs.CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of string
 */
function testMaxLength(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.string({
				maxLength: 8,
			}).applyTo("12345678")
		).toEqual("12345678");
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.string({
				maxLength: {
					length: 8,
					trims: true,
				},
			}).applyTo("123456789")
		).toEqual("12345678");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				maxLength: 8,
			}).applyTo("123456789");
		}).toThrow(vs.CAUSE.MAX_LENGTH);
	});
}

/**
 * pattern
 */
function testPattern(): void
{
	describe("http", () =>
	{
		testpatternHttp();
	});
	describe("ipv4", () =>
	{
		testPatternIpv4();
	});
	describe("ipv6", () =>
	{
		testPatternIpv6();
	});
	describe("uri", () =>
	{
		testPatternUri();
	});
	describe("uuid", () =>
	{
		testPatternUuid();
	});
	describe("others", () =>
	{
		testPatternOthers();
	});
}

/**
 * pattern; HTTP
 */
function testpatternHttp(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("https://example.com/")
		).toEqual("https://example.com/");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("https://example.com")
		).toEqual("https://example.com");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("https://example.com:")
		).toEqual("https://example.com:");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("https://user:password@example.com:8080")
		).toEqual("https://user:password@example.com:8080");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("https://example.com/path/to/resource?name=value#hash")
		).toEqual("https://example.com/path/to/resource?name=value#hash");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("https://192.168.10.2/")
		).toEqual("https://192.168.10.2/");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("https://[fe80::a1b3:125d:c1f8:4781]/")
		).toEqual("https://[fe80::a1b3:125d:c1f8:4781]/");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("https://github.com/shimataro/value-schema")
		).toEqual("https://github.com/shimataro/value-schema");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("https://www.npmjs.com/package/vs")
		).toEqual("https://www.npmjs.com/package/vs");

		// https://tools.ietf.org/html/rfc3986#section-1.1.2
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("http://www.ietf.org/rfc/rfc2396.txt")
		).toEqual("http://www.ietf.org/rfc/rfc2396.txt");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("https://例.com/");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("http:/example.com/");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("http://example.com::80/");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("http://example.com:abc/");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.HTTP,
			}).applyTo("https://1[fe80::a1b3:125d:c1f8:4781]/");
		}).toThrow(vs.CAUSE.PATTERN);
	});
}

/**
 * pattern; IPv4
 */
function testPatternIpv4(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.IPV4,
			}).applyTo("0.0.0.0")
		).toEqual("0.0.0.0");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.IPV4,
			}).applyTo("192.168.0.1")
		).toEqual("192.168.0.1");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.IPV4,
			}).applyTo("255.255.255.255")
		).toEqual("255.255.255.255");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.IPV4,
			}).applyTo("0.0.0.");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.IPV4,
			}).applyTo("0.0.0.0.");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.IPV4,
			}).applyTo("255.255.255.256");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.IPV4,
			}).applyTo("999.255.255.255");
		}).toThrow(vs.CAUSE.PATTERN);
	});
}

/**
 * pattern; IPv6
 */
function testPatternIpv6(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.IPV6,
			}).applyTo("0000:0000:0000:0000:0000:0000:0000:0000")
		).toEqual("0000:0000:0000:0000:0000:0000:0000:0000");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.IPV6,
			}).applyTo("::1")
		).toEqual("::1");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.IPV6,
			}).applyTo("::")
		).toEqual("::");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.IPV6,
			}).applyTo("1::1")
		).toEqual("1::1");

		// IPv4-mapped address
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.IPV6,
			}).applyTo("::ffff:192.0.2.1")
		).toEqual("::ffff:192.0.2.1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.IPV6,
			}).applyTo("0000");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.IPV6,
			}).applyTo("ffff:");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.IPV6,
			}).applyTo("0000:0000:0000:0000:0000:0000:0000:0000:");
		}).toThrow(vs.CAUSE.PATTERN);
	});
}

/**
 * pattern; URI
 */
function testPatternUri(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("https://example.com/path/to/resource?name=value#hash")
		).toEqual("https://example.com/path/to/resource?name=value#hash");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("https://192.168.10.2/")
		).toEqual("https://192.168.10.2/");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("https://[fe80::a1b3:125d:c1f8:4781]/")
		).toEqual("https://[fe80::a1b3:125d:c1f8:4781]/");

		// https://tools.ietf.org/html/rfc3986#section-1.1.2
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("ftp://ftp.is.co.za/rfc/rfc1808.txt")
		).toEqual("ftp://ftp.is.co.za/rfc/rfc1808.txt");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("http://www.ietf.org/rfc/rfc2396.txt")
		).toEqual("http://www.ietf.org/rfc/rfc2396.txt");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("ldap://[2001:db8::7]/c=GB?objectClass?one")
		).toEqual("ldap://[2001:db8::7]/c=GB?objectClass?one");
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("mailto:John.Doe@example.com")
		).toEqual("mailto:John.Doe@example.com");
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("news:comp.infosystems.www.servers.unix")
		).toEqual("news:comp.infosystems.www.servers.unix");
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("tel:+1-816-555-1212")
		).toEqual("tel:+1-816-555-1212");
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("telnet://192.0.2.16:80/")
		).toEqual("telnet://192.0.2.16:80/");
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("urn:oasis:names:specification:docbook:dtd:xml:4.1.2")
		).toEqual("urn:oasis:names:specification:docbook:dtd:xml:4.1.2");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.URI,
			}).applyTo("https://例.com/");
		}).toThrow(vs.CAUSE.PATTERN);
	});
}

/**
 * pattern; UUID
 */
function testPatternUuid(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.UUID,
			}).applyTo("966a073b-b26e-4f88-888d-1f3a4ccfcd31")
		).toEqual("966a073b-b26e-4f88-888d-1f3a4ccfcd31");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.UUID,
			}).applyTo("966A073B-B26E-4F88-888D-1F3A4CCFCD31")
		).toEqual("966A073B-B26E-4F88-888D-1F3A4CCFCD31");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.UUID,
			}).applyTo("X966a073b-b26e-4f88-888d-1f3a4ccfcd31X");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.UUID,
			}).applyTo("966a073bb26e4f88888d1f3a4ccfcd31");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.UUID,
			}).applyTo("this-is-not-a-UUID-pattern");
		}).toThrow(vs.CAUSE.PATTERN);
	});
}

/**
 * pattern; Others
 */
function testPatternOthers(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.string({
				pattern: /^Go+gle$/,
			}).applyTo("Gogle")
		).toEqual("Gogle");

		expect(
			vs.string({
				pattern: /^Go+gle$/,
			}).applyTo("Google")
		).toEqual("Google");

		expect(
			vs.string({
				pattern: /^Go+gle$/,
			}).applyTo("Gooogle")
		).toEqual("Gooogle");

		expect(
			vs.string({
				pattern: vs.STRING.PATTERN.EMAIL,
			}).applyTo("john.doe@example.com")
		).toEqual("john.doe@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				pattern: /^Go+gle$/,
			}).applyTo("Ggle");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: /^Go+gle$/,
			}).applyTo("google");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string({
				pattern: vs.STRING.PATTERN.EMAIL,
			}).applyTo("john..doe@example.com");
		}).toThrow(vs.CAUSE.PATTERN);
	});
}

/**
 * converter
 */
function testConverter(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.string({
				converter: (value) =>
				{
					return value.toLowerCase();
				},
			}).applyTo("123ABCxyz")
		).toEqual("123abcxyz");

		expect(
			vs.string({
				converter: (value, fail) =>
				{
					if(value.length >= 9)
					{
						fail();
					}
					return value.padStart(8, " ");
				},
			}).applyTo("test")
		).toEqual("    test");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				converter: (value, fail) =>
				{
					if(value.length >= 9)
					{
						fail();
					}
					return value.padStart(8, " ");
				},
			}).applyTo("123ABCxyz");
		}).toThrow(vs.CAUSE.CONVERTER);
	});
}
