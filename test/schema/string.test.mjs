import valueSchema from "value-schema"; // eslint-disable-line import/no-unresolved

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
		expect(valueSchema.string()
			.fit("abc")).toEqual("abc");

		expect(valueSchema.string().strict()
			.fit("abc")).toEqual("abc");
	});
	it("should be adjusted", () =>
	{
		expect(valueSchema.string()
			.fit(0)).toEqual("0");

		expect(valueSchema.string()
			.fit(-1)).toEqual("-1");

		expect(valueSchema.string()
			.fit(true)).toEqual("true");

		expect(valueSchema.string()
			.fit(false)).toEqual("false");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string()
				.fit([]);
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.string()
				.fit({});
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.string().strict()
				.fit(0);
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.string().strict()
				.fit(true);
		}).toThrow(valueSchema.CAUSE.TYPE);
	});
}

/**
 * default value
 * @returns {void}
 */
function testDefault()
{
	it("should be adjusted", () =>
	{
		expect(valueSchema.string().default("xyz")
			.fit(undefined)).toEqual("xyz");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string()
				.fit(undefined);
		}).toThrow(valueSchema.CAUSE.REQUIRED);
	});
}

/**
 * null
 * @returns {void}
 */
function testAcceptNull()
{
	it("should be adjusted", () =>
	{
		expect(valueSchema.string().acceptNull("abc")
			.fit(null)).toEqual("abc");

		expect(valueSchema.string().acceptNull()
			.fit(null)).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string()
				.fit(null);
		}).toThrow(valueSchema.CAUSE.NULL);
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
		expect(valueSchema.string().acceptEmptyString("qwerty")
			.fit("")).toEqual("qwerty");

		expect(valueSchema.string().acceptEmptyString()
			.fit("")).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string()
				.fit("");
		}).toThrow(valueSchema.CAUSE.EMPTY);
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
		expect(valueSchema.string().trim()
			.fit("\r\n hell, word \t ")).toEqual("hell, word");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string().trim()
				.fit(" \t\r\n ");
		}).toThrow(valueSchema.CAUSE.EMPTY);
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
		expect(valueSchema.string().only("", "eat", "sleep", "play")
			.fit("")).toEqual("");

		expect(valueSchema.string().only("", "eat", "sleep", "play")
			.fit("eat")).toEqual("eat");

		expect(valueSchema.string().only("", "eat", "sleep", "play")
			.fit("sleep")).toEqual("sleep");

		expect(valueSchema.string().only("", "eat", "sleep", "play")
			.fit("play")).toEqual("play");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string().only("", "eat", "sleep", "play")
				.fit("study");
		}).toThrow(valueSchema.CAUSE.ONLY);
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
		expect(valueSchema.string().minLength(4)
			.fit("1234")).toEqual("1234");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string().minLength(4)
				.fit("abc");
		}).toThrow(valueSchema.CAUSE.MIN_LENGTH);
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
		expect(valueSchema.string().maxLength(8)
			.fit("12345678")).toEqual("12345678");
	});
	it("should be adjusted", () =>
	{
		expect(valueSchema.string().maxLength(8, true)
			.fit("123456789")).toEqual("12345678");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string().maxLength(8)
				.fit("123456789");
		}).toThrow(valueSchema.CAUSE.MAX_LENGTH);
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
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
			.fit("https://example.com/")).toEqual("https://example.com/");

		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
			.fit("https://example.com")).toEqual("https://example.com");

		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
			.fit("https://example.com:")).toEqual("https://example.com:");

		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
			.fit("https://user:password@example.com:8080")).toEqual("https://user:password@example.com:8080");

		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
			.fit("https://example.com/path/to/resource?name=value#hash")).toEqual("https://example.com/path/to/resource?name=value#hash");

		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
			.fit("https://192.168.10.2/")).toEqual("https://192.168.10.2/");

		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
			.fit("https://[fe80::a1b3:125d:c1f8:4781]/")).toEqual("https://[fe80::a1b3:125d:c1f8:4781]/");

		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
			.fit("https://github.com/shimataro/value-schema")).toEqual("https://github.com/shimataro/value-schema");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
			.fit("https://www.npmjs.com/package/valueSchema")).toEqual("https://www.npmjs.com/package/valueSchema");

		// https://tools.ietf.org/html/rfc3986#section-1.1.2
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
			.fit("http://www.ietf.org/rfc/rfc2396.txt")).toEqual("http://www.ietf.org/rfc/rfc2396.txt");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
				.fit("https://例.com/");
		}).toThrow(valueSchema.CAUSE.PATTERN);

		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
				.fit("http:/example.com/");
		}).toThrow(valueSchema.CAUSE.PATTERN);

		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
				.fit("http://example.com::80/");
		}).toThrow(valueSchema.CAUSE.PATTERN);

		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
				.fit("http://example.com:abc/");
		}).toThrow(valueSchema.CAUSE.PATTERN);

		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.HTTP)
				.fit("https://1[fe80::a1b3:125d:c1f8:4781]/");
		}).toThrow(valueSchema.CAUSE.PATTERN);
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
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV4)
			.fit("0.0.0.0")).toEqual("0.0.0.0");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV4)
			.fit("192.168.0.1")).toEqual("192.168.0.1");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV4)
			.fit("255.255.255.255")).toEqual("255.255.255.255");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV4)
				.fit("0.0.0.");
		}).toThrow(valueSchema.CAUSE.PATTERN);
		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV4)
				.fit("0.0.0.0.");
		}).toThrow(valueSchema.CAUSE.PATTERN);
		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV4)
				.fit("255.255.255.256");
		}).toThrow(valueSchema.CAUSE.PATTERN);
		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV4)
				.fit("999.255.255.255");
		}).toThrow(valueSchema.CAUSE.PATTERN);
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
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV6)
			.fit("0000:0000:0000:0000:0000:0000:0000:0000")).toEqual("0000:0000:0000:0000:0000:0000:0000:0000");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV6)
			.fit("::1")).toEqual("::1");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV6)
			.fit("::")).toEqual("::");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV6)
			.fit("1::1")).toEqual("1::1");

		// IPv4-mapped address
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV6)
			.fit("::ffff:192.0.2.1")).toEqual("::ffff:192.0.2.1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV6)
				.fit("0000");
		}).toThrow(valueSchema.CAUSE.PATTERN);
		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV6)
				.fit("ffff:");
		}).toThrow(valueSchema.CAUSE.PATTERN);
		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV6)
				.fit("0000:0000:0000:0000:0000:0000:0000:0000:");
		}).toThrow(valueSchema.CAUSE.PATTERN);
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
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
			.fit("https://example.com/path/to/resource?name=value#hash")).toEqual("https://example.com/path/to/resource?name=value#hash");

		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
			.fit("https://192.168.10.2/")).toEqual("https://192.168.10.2/");

		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
			.fit("https://[fe80::a1b3:125d:c1f8:4781]/")).toEqual("https://[fe80::a1b3:125d:c1f8:4781]/");

		// https://tools.ietf.org/html/rfc3986#section-1.1.2
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
			.fit("ftp://ftp.is.co.za/rfc/rfc1808.txt")).toEqual("ftp://ftp.is.co.za/rfc/rfc1808.txt");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
			.fit("http://www.ietf.org/rfc/rfc2396.txt")).toEqual("http://www.ietf.org/rfc/rfc2396.txt");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
			.fit("ldap://[2001:db8::7]/c=GB?objectClass?one")).toEqual("ldap://[2001:db8::7]/c=GB?objectClass?one");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
			.fit("mailto:John.Doe@example.com")).toEqual("mailto:John.Doe@example.com");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
			.fit("news:comp.infosystems.www.servers.unix")).toEqual("news:comp.infosystems.www.servers.unix");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
			.fit("tel:+1-816-555-1212")).toEqual("tel:+1-816-555-1212");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
			.fit("telnet://192.0.2.16:80/")).toEqual("telnet://192.0.2.16:80/");
		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
			.fit("urn:oasis:names:specification:docbook:dtd:xml:4.1.2")).toEqual("urn:oasis:names:specification:docbook:dtd:xml:4.1.2");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.URI)
				.fit("https://例.com/");
		}).toThrow(valueSchema.CAUSE.PATTERN);
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
		expect(valueSchema.string().pattern(/^Go+gle$/)
			.fit("Gogle")).toEqual("Gogle");

		expect(valueSchema.string().pattern(/^Go+gle$/)
			.fit("Google")).toEqual("Google");

		expect(valueSchema.string().pattern(/^Go+gle$/)
			.fit("Gooogle")).toEqual("Gooogle");

		expect(valueSchema.string().pattern(valueSchema.STRING.PATTERN.EMAIL)
			.fit("john.doe@example.com")).toEqual("john.doe@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.string().pattern(/^Go+gle$/)
				.fit("Ggle");
		}).toThrow(valueSchema.CAUSE.PATTERN);

		expect(() =>
		{
			valueSchema.string().pattern(/^Go+gle$/)
				.fit("google");
		}).toThrow(valueSchema.CAUSE.PATTERN);

		expect(() =>
		{
			valueSchema.string().pattern(valueSchema.STRING.PATTERN.EMAIL)
				.fit("john..doe@example.com");
		}).toThrow(valueSchema.CAUSE.PATTERN);
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
		expect(valueSchema.string().convert(converter)
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
			valueSchema.string().convert(converter)
				.fit("abc");
		}).toThrow(valueSchema.CAUSE.CONVERT);

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
