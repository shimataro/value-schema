import vs from "value-schema"; // eslint-disable-line import/no-unresolved

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
		expect(vs.numericString()
			.fit("1111222233334444")).toEqual("1111222233334444");
	});
	it("should be fitted", () =>
	{
		expect(vs.numericString()
			.fit(1111222233334444)).toEqual("1111222233334444");

		expect(vs.numericString().fullWidthToHalf()
			.fit("1111２２２２3333４４４４")).toEqual("1111222233334444");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString()
				.fit("1111２２２２3333４４４４");
		}).toThrow(vs.CAUSE.PATTERN);
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
		expect(vs.numericString().default("12345")
			.fit(undefined)).toEqual("12345");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString()
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
		expect(vs.numericString().acceptNull("123")
			.fit(null)).toEqual("123");

		expect(vs.numericString().acceptNull()
			.fit(null)).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString()
				.fit(null);
		}).toThrow(vs.CAUSE.NULL);
	});
}

/**
 * join array into string
 * @returns {void}
 */
function testJoinArray()
{
	it("should be fitted", () =>
	{
		expect(vs.numericString().joinArray()
			.fit(["1111", "2222", "3333", "4444"])).toEqual("1111222233334444");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString()
				.fit(["1111", "2222", "3333", "4444"]);
		}).toThrow(vs.CAUSE.TYPE);
	});
}

/**
 * separator
 * @returns {void}
 */
function testSeparatedBy()
{
	it("should be fitted", () =>
	{
		expect(vs.numericString().separatedBy("-")
			.fit("1111-2222-3333-4444")).toEqual("1111222233334444");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString()
				.fit("1111-2222-3333-4444");
		}).toThrow(vs.CAUSE.PATTERN);
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
		expect(vs.numericString().minLength(4).separatedBy("-")
			.fit("1111")).toEqual("1111");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString().minLength(4).separatedBy("-")
				.fit("111");
		}).toThrow(vs.CAUSE.MIN_LENGTH);
		expect(() =>
		{
			vs.numericString().minLength(4).separatedBy("-")
				.fit("11-1");
		}).toThrow(vs.CAUSE.MIN_LENGTH);
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
		expect(vs.numericString().maxLength(4)
			.fit("1111")).toEqual("1111");
		expect(vs.numericString().maxLength(4).separatedBy("-")
			.fit("11-22")).toEqual("1122");
	});
	it("should be fitted", () =>
	{
		expect(vs.numericString().maxLength(4, true)
			.fit("11111")).toEqual("1111");
		expect(vs.numericString().maxLength(4, true).separatedBy("-")
			.fit("111-222")).toEqual("1112");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString().maxLength(4)
				.fit("11111");
		}).toThrow(vs.CAUSE.MAX_LENGTH);
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
		expect(vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD)
			.fit("49927398716")).toEqual("49927398716");
		expect(vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD)
			.fit("049927398716")).toEqual("049927398716");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD)
				.fit("12345");
		}).toThrow(vs.CAUSE.CHECKSUM);
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
		expect(vs.numericString().separatedBy("-").checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13)
			.fit("978-4-10-109205-8")).toEqual("9784101092058"); // https://ja.wikipedia.org/wiki/ISBN
		expect(vs.numericString().separatedBy("-").checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13)
			.fit("978-0-306-40615-7")).toEqual("9780306406157"); // https://en.wikipedia.org/wiki/International_Standard_Book_Number
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString().separatedBy("-").checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13)
				.fit("978-4-10-109205-1");
		}).toThrow(vs.CAUSE.CHECKSUM);
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
			vs.numericString().checksum("no-such-algorithm")
				.fit("0123456789");
		}).toThrow(vs.CAUSE.CHECKSUM);
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
		expect(vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD).convert(converter)
			.fit("4111111111111111")).toEqual("4111-1111-1111-1111");
		expect(vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD).convert(converter)
			.fit("378282246310005")).toEqual("3782-8224-6310-005");

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
			vs.numericString().convert(converter)
				.fit("12345");
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
