import valueSchema from "value-schema"; // eslint-disable-line import/no-unresolved

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
	describe("schema", testSchema);
}

/**
 * type
 * @returns {void}
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(valueSchema.object()
			.fit({})).toEqual({});

		expect(valueSchema.object()
			.fit({
				abc: 1,
				xyz: 2,
			}))
			.toEqual({
				abc: 1,
				xyz: 2,
			});
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.object()
				.fit(123);
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
		expect(valueSchema.object().default({})
			.fit(undefined)).toEqual({});
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.object()
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
		expect(valueSchema.object().acceptNull({})
			.fit(null)).toEqual({});

		expect(valueSchema.object().acceptNull()
			.fit(null)).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.object()
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
	it("should be adjusted", () =>
	{
		expect(valueSchema.object().acceptEmptyString({})
			.fit("")).toEqual({});

		expect(valueSchema.object().acceptEmptyString()
			.fit("")).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.object()
				.fit("");
		}).toThrow(valueSchema.CAUSE.EMPTY);
	});
}

/**
 * schema
 * @returns {void}
 */
function testSchema()
{
	it("should be adjusted", () =>
	{
		const schemaObject = {
			id: valueSchema.number().minValue(1),
			name: valueSchema.string().maxLength(4, true),
		};
		const input = {
			id: "123",
			name: "John Doe",
			dummy: true,
		};
		const expected = {
			id: 123,
			name: "John",
		};
		expect(valueSchema.object().schema(schemaObject)
			.fit(input)).toEqual(expected);
	});
}
