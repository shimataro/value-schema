import vs from "value-schema"; // eslint-disable-line import/no-unresolved

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
	describe("trim", testTrim);
	describe("only", testOnly);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("pattern", testPattern);
	describe("convert", testConvert);
}

/**
 * type
 * @returns {void}
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(vs.string()
			.fit("abc")).toEqual("abc");

		expect(vs.string().strict()
			.fit("abc")).toEqual("abc");
	});
	it("should be fitted", () =>
	{
		expect(vs.string()
			.fit(0)).toEqual("0");

		expect(vs.string()
			.fit(-1)).toEqual("-1");

		expect(vs.string()
			.fit(true)).toEqual("true");

		expect(vs.string()
			.fit(false)).toEqual("false");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string()
				.fit([]);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.string()
				.fit({});
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.string().strict()
				.fit(0);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.string().strict()
				.fit(true);
		}).toThrow(vs.CAUSE.TYPE);
	});
}

/**
 * default value
 * @returns {void}
 */
function testDefault()
{
	it("should be fitted", () =>
	{
		expect(vs.string().default("xyz")
			.fit(undefined)).toEqual("xyz");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string()
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
	it("should be fitted", () =>
	{
		expect(vs.string().acceptNull("abc")
			.fit(null)).toEqual("abc");

		expect(vs.string().acceptNull()
			.fit(null)).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string()
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
		expect(vs.string().acceptEmptyString("qwerty")
			.fit("")).toEqual("qwerty");

		expect(vs.string().acceptEmptyString()
			.fit("")).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string()
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
		expect(vs.string().trim()
			.fit("\r\n hell, word \t ")).toEqual("hell, word");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().trim()
				.fit(" \t\r\n ");
		}).toThrow(vs.CAUSE.EMPTY);
	});
}

/**
 * set
 * @returns {void}
 */
function testOnly()
{
	it("should be OK", () =>
	{
		expect(vs.string().only("", "eat", "sleep", "play")
			.fit("")).toEqual("");

		expect(vs.string().only("", "eat", "sleep", "play")
			.fit("eat")).toEqual("eat");

		expect(vs.string().only("", "eat", "sleep", "play")
			.fit("sleep")).toEqual("sleep");

		expect(vs.string().only("", "eat", "sleep", "play")
			.fit("play")).toEqual("play");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().only("", "eat", "sleep", "play")
				.fit("study");
		}).toThrow(vs.CAUSE.ONLY);
	});
}

/**
 * minimum length of string
 * @returns {void}
 */
function testMinLength()
{
	it("should be OK", () =>
	{
		expect(vs.string().minLength(4)
			.fit("1234")).toEqual("1234");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().minLength(4)
				.fit("abc");
		}).toThrow(vs.CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of string
 * @returns {void}
 */
function testMaxLength()
{
	it("should be OK", () =>
	{
		expect(vs.string().maxLength(8)
			.fit("12345678")).toEqual("12345678");
	});
	it("should be fitted", () =>
	{
		expect(vs.string().maxLength(8, true)
			.fit("123456789")).toEqual("12345678");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().maxLength(8)
				.fit("123456789");
		}).toThrow(vs.CAUSE.MAX_LENGTH);
	});
}

/**
 * pattern
 * @returns {void}
 */
function testPattern()
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
	describe("others", () =>
	{
		testPatternOthers();
	});
}

/**
 * pattern; HTTP
 * @returns {void}
 */
function testpatternHttp()
{
	it("should be OK", () =>
	{
		expect(vs.string().pattern(vs.STRING.PATTERN.HTTP)
			.fit("https://example.com/")).toEqual("https://example.com/");

		expect(vs.string().pattern(vs.STRING.PATTERN.HTTP)
			.fit("https://example.com")).toEqual("https://example.com");

		expect(vs.string().pattern(vs.STRING.PATTERN.HTTP)
			.fit("https://example.com:")).toEqual("https://example.com:");

		expect(vs.string().pattern(vs.STRING.PATTERN.HTTP)
			.fit("https://user:password@example.com:8080")).toEqual("https://user:password@example.com:8080");

		expect(vs.string().pattern(vs.STRING.PATTERN.HTTP)
			.fit("https://example.com/path/to/resource?name=value#hash")).toEqual("https://example.com/path/to/resource?name=value#hash");

		expect(vs.string().pattern(vs.STRING.PATTERN.HTTP)
			.fit("https://192.168.10.2/")).toEqual("https://192.168.10.2/");

		expect(vs.string().pattern(vs.STRING.PATTERN.HTTP)
			.fit("https://[fe80::a1b3:125d:c1f8:4781]/")).toEqual("https://[fe80::a1b3:125d:c1f8:4781]/");

		expect(vs.string().pattern(vs.STRING.PATTERN.HTTP)
			.fit("https://github.com/shimataro/value-schema")).toEqual("https://github.com/shimataro/value-schema");
		expect(vs.string().pattern(vs.STRING.PATTERN.HTTP)
			.fit("https://www.npmjs.com/package/vs")).toEqual("https://www.npmjs.com/package/vs");

		// https://tools.ietf.org/html/rfc3986#section-1.1.2
		expect(vs.string().pattern(vs.STRING.PATTERN.HTTP)
			.fit("http://www.ietf.org/rfc/rfc2396.txt")).toEqual("http://www.ietf.org/rfc/rfc2396.txt");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.HTTP)
				.fit("https://例.com/");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.HTTP)
				.fit("http:/example.com/");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.HTTP)
				.fit("http://example.com::80/");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.HTTP)
				.fit("http://example.com:abc/");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.HTTP)
				.fit("https://1[fe80::a1b3:125d:c1f8:4781]/");
		}).toThrow(vs.CAUSE.PATTERN);
	});
}

/**
 * pattern; IPv4
 * @returns {void}
 */
function testPatternIpv4()
{
	it("should be OK", () =>
	{
		expect(vs.string().pattern(vs.STRING.PATTERN.IPV4)
			.fit("0.0.0.0")).toEqual("0.0.0.0");
		expect(vs.string().pattern(vs.STRING.PATTERN.IPV4)
			.fit("192.168.0.1")).toEqual("192.168.0.1");
		expect(vs.string().pattern(vs.STRING.PATTERN.IPV4)
			.fit("255.255.255.255")).toEqual("255.255.255.255");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.IPV4)
				.fit("0.0.0.");
		}).toThrow(vs.CAUSE.PATTERN);
		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.IPV4)
				.fit("0.0.0.0.");
		}).toThrow(vs.CAUSE.PATTERN);
		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.IPV4)
				.fit("255.255.255.256");
		}).toThrow(vs.CAUSE.PATTERN);
		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.IPV4)
				.fit("999.255.255.255");
		}).toThrow(vs.CAUSE.PATTERN);
	});
}

/**
 * pattern; IPv6
 * @returns {void}
 */
function testPatternIpv6()
{
	it("should be OK", () =>
	{
		expect(vs.string().pattern(vs.STRING.PATTERN.IPV6)
			.fit("0000:0000:0000:0000:0000:0000:0000:0000")).toEqual("0000:0000:0000:0000:0000:0000:0000:0000");
		expect(vs.string().pattern(vs.STRING.PATTERN.IPV6)
			.fit("::1")).toEqual("::1");
		expect(vs.string().pattern(vs.STRING.PATTERN.IPV6)
			.fit("::")).toEqual("::");
		expect(vs.string().pattern(vs.STRING.PATTERN.IPV6)
			.fit("1::1")).toEqual("1::1");

		// IPv4-mapped address
		expect(vs.string().pattern(vs.STRING.PATTERN.IPV6)
			.fit("::ffff:192.0.2.1")).toEqual("::ffff:192.0.2.1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.IPV6)
				.fit("0000");
		}).toThrow(vs.CAUSE.PATTERN);
		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.IPV6)
				.fit("ffff:");
		}).toThrow(vs.CAUSE.PATTERN);
		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.IPV6)
				.fit("0000:0000:0000:0000:0000:0000:0000:0000:");
		}).toThrow(vs.CAUSE.PATTERN);
	});
}

/**
 * pattern; URI
 * @returns {void}
 */
function testPatternUri()
{
	it("should be OK", () =>
	{
		expect(vs.string().pattern(vs.STRING.PATTERN.URI)
			.fit("https://example.com/path/to/resource?name=value#hash")).toEqual("https://example.com/path/to/resource?name=value#hash");

		expect(vs.string().pattern(vs.STRING.PATTERN.URI)
			.fit("https://192.168.10.2/")).toEqual("https://192.168.10.2/");

		expect(vs.string().pattern(vs.STRING.PATTERN.URI)
			.fit("https://[fe80::a1b3:125d:c1f8:4781]/")).toEqual("https://[fe80::a1b3:125d:c1f8:4781]/");

		// https://tools.ietf.org/html/rfc3986#section-1.1.2
		expect(vs.string().pattern(vs.STRING.PATTERN.URI)
			.fit("ftp://ftp.is.co.za/rfc/rfc1808.txt")).toEqual("ftp://ftp.is.co.za/rfc/rfc1808.txt");
		expect(vs.string().pattern(vs.STRING.PATTERN.URI)
			.fit("http://www.ietf.org/rfc/rfc2396.txt")).toEqual("http://www.ietf.org/rfc/rfc2396.txt");
		expect(vs.string().pattern(vs.STRING.PATTERN.URI)
			.fit("ldap://[2001:db8::7]/c=GB?objectClass?one")).toEqual("ldap://[2001:db8::7]/c=GB?objectClass?one");
		expect(vs.string().pattern(vs.STRING.PATTERN.URI)
			.fit("mailto:John.Doe@example.com")).toEqual("mailto:John.Doe@example.com");
		expect(vs.string().pattern(vs.STRING.PATTERN.URI)
			.fit("news:comp.infosystems.www.servers.unix")).toEqual("news:comp.infosystems.www.servers.unix");
		expect(vs.string().pattern(vs.STRING.PATTERN.URI)
			.fit("tel:+1-816-555-1212")).toEqual("tel:+1-816-555-1212");
		expect(vs.string().pattern(vs.STRING.PATTERN.URI)
			.fit("telnet://192.0.2.16:80/")).toEqual("telnet://192.0.2.16:80/");
		expect(vs.string().pattern(vs.STRING.PATTERN.URI)
			.fit("urn:oasis:names:specification:docbook:dtd:xml:4.1.2")).toEqual("urn:oasis:names:specification:docbook:dtd:xml:4.1.2");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.URI)
				.fit("https://例.com/");
		}).toThrow(vs.CAUSE.PATTERN);
	});
}

/**
 * pattern; Others
 * @returns {void}
 */
function testPatternOthers()
{
	it("should be OK", () =>
	{
		expect(vs.string().pattern(/^Go+gle$/)
			.fit("Gogle")).toEqual("Gogle");

		expect(vs.string().pattern(/^Go+gle$/)
			.fit("Google")).toEqual("Google");

		expect(vs.string().pattern(/^Go+gle$/)
			.fit("Gooogle")).toEqual("Gooogle");

		expect(vs.string().pattern(vs.STRING.PATTERN.EMAIL)
			.fit("john.doe@example.com")).toEqual("john.doe@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().pattern(/^Go+gle$/)
				.fit("Ggle");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string().pattern(/^Go+gle$/)
				.fit("google");
		}).toThrow(vs.CAUSE.PATTERN);

		expect(() =>
		{
			vs.string().pattern(vs.STRING.PATTERN.EMAIL)
				.fit("john..doe@example.com");
		}).toThrow(vs.CAUSE.PATTERN);
	});
}

/**
 * mapping
 * @returns {void}
 */
function testConvert()
{
	it("should be repeated", () =>
	{
		expect(vs.string().convert(converter)
			.fit("abc")).toEqual("abcabc");

		/**
		 * conversion function
		 * @param {string} value value to convert
		 * @returns {string} converted value
		 */
		function converter(value)
		{
			return `${value}${value}`;
		}
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string().convert(converter)
				.fit("abc");
		}).toThrow(vs.CAUSE.CONVERT);

		/**
		 * conversion function
		 * @param {string} value value to convert
		 * @param {Function} fail callback on fail
		 * @returns {string} converted value
		 */
		function converter(value, fail)
		{
			fail();
		}
	});
}
