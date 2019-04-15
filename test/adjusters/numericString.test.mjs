import adjuster from "adjuster"; // eslint-disable-line import/no-unresolved

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("joinArray", testJoinArray);
	describe("separatedBy", testSeparatedBy);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("checksum (Luhn)", testChecksumLuhn);
	describe("checksum (Modulus 10 / Weight 3:1)", testChecksumModulus10Weight31);
	describe("checksum (Others)", testChecksumOthers);
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
		expect(adjuster.numericString()
			.adjust("1111222233334444")).toEqual("1111222233334444");
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.numericString()
			.adjust(1111222233334444)).toEqual("1111222233334444");
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
		expect(adjuster.numericString().default("12345")
			.adjust(undefined)).toEqual("12345");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numericString()
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
		expect(adjuster.numericString().acceptNull("123")
			.adjust(null)).toEqual("123");

		expect(adjuster.numericString().acceptNull()
			.adjust(null)).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numericString()
				.adjust(null);
		}).toThrow(adjuster.CAUSE.NULL);
	});
}

/**
 * join array into string
 * @returns {void}
 */
function testJoinArray()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numericString().joinArray()
			.adjust(["1111", "2222", "3333", "4444"])).toEqual("1111222233334444");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numericString()
				.adjust(["1111", "2222", "3333", "4444"]);
		}).toThrow(adjuster.CAUSE.TYPE);
	});
}

/**
 * separator
 * @returns {void}
 */
function testSeparatedBy()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.numericString().separatedBy("-")
			.adjust("1111-2222-3333-4444")).toEqual("1111222233334444");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numericString()
				.adjust("1111-2222-3333-4444");
		}).toThrow(adjuster.CAUSE.PATTERN);
	});
}

/**
 * min-length
 * @returns {void}
 */
function testMinLength()
{
	it("should be OK", () =>
	{
		expect(adjuster.numericString().minLength(4).separatedBy("-")
			.adjust("1111")).toEqual("1111");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numericString().minLength(4).separatedBy("-")
				.adjust("111");
		}).toThrow(adjuster.CAUSE.MIN_LENGTH);
		expect(() =>
		{
			adjuster.numericString().minLength(4).separatedBy("-")
				.adjust("11-1");
		}).toThrow(adjuster.CAUSE.MIN_LENGTH);
	});
}

/**
 * max-length
 * @returns {void}
 */
function testMaxLength()
{
	it("should be OK", () =>
	{
		expect(adjuster.numericString().maxLength(4)
			.adjust("1111")).toEqual("1111");
		expect(adjuster.numericString().maxLength(4).separatedBy("-")
			.adjust("11-22")).toEqual("1122");
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.numericString().maxLength(4, true)
			.adjust("11111")).toEqual("1111");
		expect(adjuster.numericString().maxLength(4, true).separatedBy("-")
			.adjust("111-222")).toEqual("1112");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numericString().maxLength(4)
				.adjust("11111");
		}).toThrow(adjuster.CAUSE.MAX_LENGTH);
	});
}

/**
 * checksum - Luhn algorithm
 * @returns {void}
 */
function testChecksumLuhn()
{
	it("should be OK", () =>
	{
		expect(adjuster.numericString().checksum(adjuster.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD)
			.adjust("49927398716")).toEqual("49927398716");
		expect(adjuster.numericString().checksum(adjuster.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD)
			.adjust("049927398716")).toEqual("049927398716");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numericString().checksum(adjuster.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD)
				.adjust("12345");
		}).toThrow(adjuster.CAUSE.CHECKSUM);
	});
}

/**
 * checksum - Modulus 10 / Weight 3:1
 * @returns {void}
 */
function testChecksumModulus10Weight31()
{
	it("should be OK", () =>
	{
		expect(adjuster.numericString().separatedBy("-").checksum(adjuster.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13)
			.adjust("978-4-10-109205-8")).toEqual("9784101092058"); // https://ja.wikipedia.org/wiki/ISBN
		expect(adjuster.numericString().separatedBy("-").checksum(adjuster.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13)
			.adjust("978-0-306-40615-7")).toEqual("9780306406157"); // https://en.wikipedia.org/wiki/International_Standard_Book_Number
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numericString().separatedBy("-").checksum(adjuster.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13)
				.adjust("978-4-10-109205-1");
		}).toThrow(adjuster.CAUSE.CHECKSUM);
	});
}

/**
 * checksum - Others
 * @returns {void}
 */
function testChecksumOthers()
{
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numericString().checksum("no-such-algorithm")
				.adjust("0123456789");
		}).toThrow(adjuster.CAUSE.CHECKSUM);
	});
}

/**
 * checksum - Luhn algorithm
 * @returns {void}
 */
function testConvert()
{
	it("should be separated", () =>
	{
		expect(adjuster.numericString().checksum(adjuster.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD).convert(converter)
			.adjust("4111111111111111")).toEqual("4111-1111-1111-1111");
		expect(adjuster.numericString().checksum(adjuster.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD).convert(converter)
			.adjust("378282246310005")).toEqual("3782-8224-6310-005");

		/**
		 * conversion function
		 * @param {string} value value to convert
		 * @returns {string} converted value
		 */
		function converter(value)
		{
			// separate per 4 characters
			const parts = [];
			while(value.length > 0)
			{
				parts.push(value.substr(0, 4));
				value = value.substr(4);
			}
			return parts.join("-");
		}
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.numericString().convert(converter)
				.adjust("12345");
		}).toThrow(adjuster.CAUSE.CONVERT);

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
