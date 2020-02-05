import * as vs from "value-schema";

{
	describe("type", testType);
	describe("ifUndefined", testIfUndefined);
	describe("ifNull", testIfNull);
	describe("ifEmptyString", testIfEmptyString);
	describe("schema", testSchema);
}

/**
 * type
 */
function testType(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.object().applyTo({})
		).toEqual({});

		expect(
			vs.object().applyTo({
				abc: 1,
				xyz: 2,
			})
		).toEqual({
			abc: 1,
			xyz: 2,
		});
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.object().applyTo(123);
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
			vs.object({
				ifUndefined: {},
			}).applyTo(undefined)
		).toEqual({});
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.object().applyTo(undefined);
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
			vs.object({
				ifNull: {},
			}).applyTo(null)
		).toEqual({});

		expect(
			vs.object({
				ifNull: null,
			}).applyTo(null)
		).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.object().applyTo(null);
		}).toThrow(vs.CAUSE.NULL);
	});
}

/**
 * if empty string
 */
function testIfEmptyString(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.object({
				ifEmptyString: {},
			}).applyTo("")
		).toEqual({});

		expect(
			vs.object({
				ifEmptyString: null,
			}).applyTo("")
		).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.object().applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);
	});
}

/**
 * schema
 */
function testSchema(): void
{
	it("should be adjusted", () =>
	{
		const schemaObject = {
			id: vs.number({
				minValue: 1,
			}),
			name: vs.string({
				maxLength: {
					length: 4,
					trims: true,
				},
			}),
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
		expect(
			vs.object({
				schema: schemaObject,
			}).applyTo(input)
		).toEqual(expected);
	});
}
