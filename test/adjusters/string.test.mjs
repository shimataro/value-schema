import adjuster from "adjuster"; // eslint-disable-line import/no-unresolved

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
	describe("map", testMap);
}

/**
 * type
 * @returns {void}
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(adjuster.string()
			.adjust("abc")).toEqual("abc");

		expect(adjuster.string().strict()
			.adjust("abc")).toEqual("abc");
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.string()
			.adjust(0)).toEqual("0");

		expect(adjuster.string()
			.adjust(-1)).toEqual("-1");

		expect(adjuster.string()
			.adjust(true)).toEqual("true");

		expect(adjuster.string()
			.adjust(false)).toEqual("false");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string()
				.adjust([]);
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.string()
				.adjust({});
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.string().strict()
				.adjust(0);
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.string().strict()
				.adjust(true);
		}).toThrow(adjuster.CAUSE.TYPE);
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
		expect(adjuster.string().default("xyz")
			.adjust(undefined)).toEqual("xyz");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string()
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
	it("should be adjusted", () =>
	{
		expect(adjuster.string().acceptNull("abc")
			.adjust(null)).toEqual("abc");

		expect(adjuster.string().acceptNull()
			.adjust(null)).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string()
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
		expect(adjuster.string().acceptEmptyString("qwerty")
			.adjust("")).toEqual("qwerty");

		expect(adjuster.string().acceptEmptyString()
			.adjust("")).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string()
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
		expect(adjuster.string().trim()
			.adjust("\r\n hell, word \t ")).toEqual("hell, word");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().trim()
				.adjust(" \t\r\n ");
		}).toThrow(adjuster.CAUSE.EMPTY);
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
		expect(adjuster.string().only("", "eat", "sleep", "play")
			.adjust("")).toEqual("");

		expect(adjuster.string().only("", "eat", "sleep", "play")
			.adjust("eat")).toEqual("eat");

		expect(adjuster.string().only("", "eat", "sleep", "play")
			.adjust("sleep")).toEqual("sleep");

		expect(adjuster.string().only("", "eat", "sleep", "play")
			.adjust("play")).toEqual("play");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().only("", "eat", "sleep", "play")
				.adjust("study");
		}).toThrow(adjuster.CAUSE.ONLY);
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
		expect(adjuster.string().minLength(4)
			.adjust("1234")).toEqual("1234");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().minLength(4)
				.adjust("abc");
		}).toThrow(adjuster.CAUSE.MIN_LENGTH);
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
		expect(adjuster.string().maxLength(8)
			.adjust("12345678")).toEqual("12345678");
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.string().maxLength(8, true)
			.adjust("123456789")).toEqual("12345678");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().maxLength(8)
				.adjust("123456789");
		}).toThrow(adjuster.CAUSE.MAX_LENGTH);
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
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
			.adjust("https://example.com/")).toEqual("https://example.com/");

		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
			.adjust("https://example.com")).toEqual("https://example.com");

		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
			.adjust("https://example.com:")).toEqual("https://example.com:");

		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
			.adjust("https://user:password@example.com:8080")).toEqual("https://user:password@example.com:8080");

		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
			.adjust("https://example.com/path/to/resource?name=value#hash")).toEqual("https://example.com/path/to/resource?name=value#hash");

		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
			.adjust("https://192.168.10.2/")).toEqual("https://192.168.10.2/");

		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
			.adjust("https://[fe80::a1b3:125d:c1f8:4781]/")).toEqual("https://[fe80::a1b3:125d:c1f8:4781]/");

		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
			.adjust("https://github.com/shimataro/node-adjuster")).toEqual("https://github.com/shimataro/node-adjuster");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
			.adjust("https://www.npmjs.com/package/adjuster")).toEqual("https://www.npmjs.com/package/adjuster");

		// https://tools.ietf.org/html/rfc3986#section-1.1.2
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
			.adjust("http://www.ietf.org/rfc/rfc2396.txt")).toEqual("http://www.ietf.org/rfc/rfc2396.txt");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
				.adjust("https://例.com/");
		}).toThrow(adjuster.CAUSE.PATTERN);

		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
				.adjust("http:/example.com/");
		}).toThrow(adjuster.CAUSE.PATTERN);

		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
				.adjust("http://example.com::80/");
		}).toThrow(adjuster.CAUSE.PATTERN);

		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
				.adjust("http://example.com:abc/");
		}).toThrow(adjuster.CAUSE.PATTERN);

		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.HTTP)
				.adjust("https://1[fe80::a1b3:125d:c1f8:4781]/");
		}).toThrow(adjuster.CAUSE.PATTERN);
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
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.IPV4)
			.adjust("0.0.0.0")).toEqual("0.0.0.0");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.IPV4)
			.adjust("192.168.0.1")).toEqual("192.168.0.1");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.IPV4)
			.adjust("255.255.255.255")).toEqual("255.255.255.255");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.IPV4)
				.adjust("0.0.0.");
		}).toThrow(adjuster.CAUSE.PATTERN);
		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.IPV4)
				.adjust("0.0.0.0.");
		}).toThrow(adjuster.CAUSE.PATTERN);
		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.IPV4)
				.adjust("255.255.255.256");
		}).toThrow(adjuster.CAUSE.PATTERN);
		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.IPV4)
				.adjust("999.255.255.255");
		}).toThrow(adjuster.CAUSE.PATTERN);
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
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.IPV6)
			.adjust("0000:0000:0000:0000:0000:0000:0000:0000")).toEqual("0000:0000:0000:0000:0000:0000:0000:0000");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.IPV6)
			.adjust("::1")).toEqual("::1");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.IPV6)
			.adjust("::")).toEqual("::");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.IPV6)
			.adjust("1::1")).toEqual("1::1");

		// IPv4-mapped address
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.IPV6)
			.adjust("::ffff:192.0.2.1")).toEqual("::ffff:192.0.2.1");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.IPV6)
				.adjust("0000");
		}).toThrow(adjuster.CAUSE.PATTERN);
		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.IPV6)
				.adjust("ffff:");
		}).toThrow(adjuster.CAUSE.PATTERN);
		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.IPV6)
				.adjust("0000:0000:0000:0000:0000:0000:0000:0000:");
		}).toThrow(adjuster.CAUSE.PATTERN);
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
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
			.adjust("https://example.com/path/to/resource?name=value#hash")).toEqual("https://example.com/path/to/resource?name=value#hash");

		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
			.adjust("https://192.168.10.2/")).toEqual("https://192.168.10.2/");

		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
			.adjust("https://[fe80::a1b3:125d:c1f8:4781]/")).toEqual("https://[fe80::a1b3:125d:c1f8:4781]/");

		// https://tools.ietf.org/html/rfc3986#section-1.1.2
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
			.adjust("ftp://ftp.is.co.za/rfc/rfc1808.txt")).toEqual("ftp://ftp.is.co.za/rfc/rfc1808.txt");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
			.adjust("http://www.ietf.org/rfc/rfc2396.txt")).toEqual("http://www.ietf.org/rfc/rfc2396.txt");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
			.adjust("ldap://[2001:db8::7]/c=GB?objectClass?one")).toEqual("ldap://[2001:db8::7]/c=GB?objectClass?one");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
			.adjust("mailto:John.Doe@example.com")).toEqual("mailto:John.Doe@example.com");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
			.adjust("news:comp.infosystems.www.servers.unix")).toEqual("news:comp.infosystems.www.servers.unix");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
			.adjust("tel:+1-816-555-1212")).toEqual("tel:+1-816-555-1212");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
			.adjust("telnet://192.0.2.16:80/")).toEqual("telnet://192.0.2.16:80/");
		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
			.adjust("urn:oasis:names:specification:docbook:dtd:xml:4.1.2")).toEqual("urn:oasis:names:specification:docbook:dtd:xml:4.1.2");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.URI)
				.adjust("https://例.com/");
		}).toThrow(adjuster.CAUSE.PATTERN);
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
		expect(adjuster.string().pattern(/^Go+gle$/)
			.adjust("Gogle")).toEqual("Gogle");

		expect(adjuster.string().pattern(/^Go+gle$/)
			.adjust("Google")).toEqual("Google");

		expect(adjuster.string().pattern(/^Go+gle$/)
			.adjust("Gooogle")).toEqual("Gooogle");

		expect(adjuster.string().pattern(adjuster.STRING.PATTERN.EMAIL)
			.adjust("john.doe@example.com")).toEqual("john.doe@example.com");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().pattern(/^Go+gle$/)
				.adjust("Ggle");
		}).toThrow(adjuster.CAUSE.PATTERN);

		expect(() =>
		{
			adjuster.string().pattern(/^Go+gle$/)
				.adjust("google");
		}).toThrow(adjuster.CAUSE.PATTERN);

		expect(() =>
		{
			adjuster.string().pattern(adjuster.STRING.PATTERN.EMAIL)
				.adjust("john..doe@example.com");
		}).toThrow(adjuster.CAUSE.PATTERN);
	});
}

/**
 * mapping
 * @returns {void}
 */
function testMap()
{
	it("should be repeated", () =>
	{
		expect(adjuster.string().map(mapper)
			.adjust("abc")).toEqual("abcabc");

		/**
		 * mapping function
		 * @param {string} value value to map
		 * @returns {string} mapped value
		 */
		function mapper(value)
		{
			return `${value}${value}`;
		}
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.string().map(mapper)
				.adjust("abc");
		}).toThrow(adjuster.CAUSE.MAP);

		/**
		 * mapping function
		 * @param {string} value value to map
		 * @param {Function} fail callback on fail
		 * @returns {string} mapped value
		 */
		function mapper(value, fail)
		{
			fail();
		}
	});
}
