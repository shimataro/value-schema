import valueSchema from "value-schema"; // eslint-disable-line import/no-unresolved

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
		expect(valueSchema.numericString()
			.fit("1111222233334444")).toEqual("1111222233334444");
	});
	it("should be adjusted", () =>
	{
		expect(valueSchema.numericString()
			.fit(1111222233334444)).toEqual("1111222233334444");

		expect(valueSchema.numericString().fullWidthToHalf()
			.fit("1111２２２２3333４４４４")).toEqual("1111222233334444");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.numericString()
				.fit("1111２２２２3333４４４４");
		}).toThrow(valueSchema.CAUSE.PATTERN);
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
		expect(valueSchema.numericString().default("12345")
			.fit(undefined)).toEqual("12345");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.numericString()
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
		expect(valueSchema.numericString().acceptNull("123")
			.fit(null)).toEqual("123");

		expect(valueSchema.numericString().acceptNull()
			.fit(null)).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.numericString()
				.fit(null);
		}).toThrow(valueSchema.CAUSE.NULL);
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
		expect(valueSchema.numericString().joinArray()
			.fit(["1111", "2222", "3333", "4444"])).toEqual("1111222233334444");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.numericString()
				.fit(["1111", "2222", "3333", "4444"]);
		}).toThrow(valueSchema.CAUSE.TYPE);
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
		expect(valueSchema.numericString().separatedBy("-")
			.fit("1111-2222-3333-4444")).toEqual("1111222233334444");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.numericString()
				.fit("1111-2222-3333-4444");
		}).toThrow(valueSchema.CAUSE.PATTERN);
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
		expect(valueSchema.numericString().minLength(4).separatedBy("-")
			.fit("1111")).toEqual("1111");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.numericString().minLength(4).separatedBy("-")
				.fit("111");
		}).toThrow(valueSchema.CAUSE.MIN_LENGTH);
		expect(() =>
		{
			valueSchema.numericString().minLength(4).separatedBy("-")
				.fit("11-1");
		}).toThrow(valueSchema.CAUSE.MIN_LENGTH);
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
		expect(valueSchema.numericString().maxLength(4)
			.fit("1111")).toEqual("1111");
		expect(valueSchema.numericString().maxLength(4).separatedBy("-")
			.fit("11-22")).toEqual("1122");
	});
	it("should be adjusted", () =>
	{
		expect(valueSchema.numericString().maxLength(4, true)
			.fit("11111")).toEqual("1111");
		expect(valueSchema.numericString().maxLength(4, true).separatedBy("-")
			.fit("111-222")).toEqual("1112");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.numericString().maxLength(4)
				.fit("11111");
		}).toThrow(valueSchema.CAUSE.MAX_LENGTH);
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
		expect(valueSchema.numericString().checksum(valueSchema.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD)
			.fit("49927398716")).toEqual("49927398716");
		expect(valueSchema.numericString().checksum(valueSchema.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD)
			.fit("049927398716")).toEqual("049927398716");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.numericString().checksum(valueSchema.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD)
				.fit("12345");
		}).toThrow(valueSchema.CAUSE.CHECKSUM);
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
		expect(valueSchema.numericString().separatedBy("-").checksum(valueSchema.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13)
			.fit("978-4-10-109205-8")).toEqual("9784101092058"); // https://ja.wikipedia.org/wiki/ISBN
		expect(valueSchema.numericString().separatedBy("-").checksum(valueSchema.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13)
			.fit("978-0-306-40615-7")).toEqual("9780306406157"); // https://en.wikipedia.org/wiki/International_Standard_Book_Number
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.numericString().separatedBy("-").checksum(valueSchema.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13)
				.fit("978-4-10-109205-1");
		}).toThrow(valueSchema.CAUSE.CHECKSUM);
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
			valueSchema.numericString().checksum("no-such-algorithm")
				.fit("0123456789");
		}).toThrow(valueSchema.CAUSE.CHECKSUM);
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
		expect(valueSchema.numericString().checksum(valueSchema.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD).convert(converter)
			.fit("4111111111111111")).toEqual("4111-1111-1111-1111");
		expect(valueSchema.numericString().checksum(valueSchema.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD).convert(converter)
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
			valueSchema.numericString().convert(converter)
				.fit("12345");
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
