import {describe, expect, it} from "@jest/globals";
import {camel} from "case";
import vs from "value-schema";

{
	describe("type", testType);
	describe("ifUndefined", testIfUndefined);
	describe("ifNull", testIfNull);
	describe("ifEmptyString", testIfEmptyString);
	describe("schema", testSchema);
	describe("transform", testTransform);
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
		}).toThrow(vs.RULE.TYPE);
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
	it("should be undefined", () =>
	{
		expect(
			vs.object({
				ifUndefined: undefined,
			}).applyTo(undefined)
		).toBeUndefined();
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.object().applyTo(undefined);
		}).toThrow(vs.RULE.UNDEFINED);
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
		}).toThrow(vs.RULE.NULL);
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
		}).toThrow(vs.RULE.EMPTY_STRING);
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
				schemaObject: schemaObject,
			}).applyTo(input)
		).toEqual(expected);
	});
}

/**
 * transform
 */
function testTransform(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.object({
				transform: (values) =>
				{
					// transforms case of keys to camelCase
					return Object.entries(values).reduce((prev, [key, value]) =>
					{
						return {
							...prev,
							[camel(key)]: value,
						};
					}, {});
				},
			}).applyTo({
				"first name": "John",
				"last-name": "Doe",
				"credit_card": "4111111111111111",
			})
		).toEqual({
			firstName: "John",
			lastName: "Doe",
			creditCard: "4111111111111111",
		});
	});
}
