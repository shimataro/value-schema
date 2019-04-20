import vs from "value-schema"; // eslint-disable-line import/no-unresolved

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
		expect(vs.object()
			.fit({})).toEqual({});

		expect(vs.object()
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
			vs.object()
				.fit(123);
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
		expect(vs.object().default({})
			.fit(undefined)).toEqual({});
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.object()
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
		expect(vs.object().acceptNull({})
			.fit(null)).toEqual({});

		expect(vs.object().acceptNull()
			.fit(null)).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.object()
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
	it("should be fitted", () =>
	{
		expect(vs.object().acceptEmptyString({})
			.fit("")).toEqual({});

		expect(vs.object().acceptEmptyString()
			.fit("")).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.object()
				.fit("");
		}).toThrow(vs.CAUSE.EMPTY);
	});
}

/**
 * schema
 * @returns {void}
 */
function testSchema()
{
	it("should be fitted", () =>
	{
		const schemaObject = {
			id: vs.number().minValue(1),
			name: vs.string().maxLength(4, true),
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
		expect(vs.object().schema(schemaObject)
			.fit(input)).toEqual(expected);
	});
}
