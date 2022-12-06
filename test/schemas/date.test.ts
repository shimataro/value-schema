import vs from "value-schema";
import {describe, expect, it} from "@jest/globals";

{
	describe("type", testType);
	describe("iso8601", testIso8601);
	describe("unixtime", testUnixtime);
	describe("ifUndefined", testIfUndefined);
	describe("ifNull", testIfNull);
	describe("ifEmptyString", testIfEmptyString);
	describe("maxValue", testMaxValue);
	describe("minValue", testMinValue);
}

/**
 * type
 */
function testType(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.date().applyTo("2020-01-01T00:00:00.000Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
		expect(
			vs.date().applyTo("2020-01-01T00:00:00Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
		expect(
			vs.date().applyTo("2020-01-01T00:00Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));

		expect(
			vs.date().applyTo("2020-01-01T00:00:00.000+09:00")
		).toEqual(new Date("2019-12-31T15:00:00.000Z"));
		expect(
			vs.date().applyTo("2020-01-01T00:00:00+09:00")
		).toEqual(new Date("2019-12-31T15:00:00.000Z"));
		expect(
			vs.date().applyTo("2020-01-01T00:00+09:00")
		).toEqual(new Date("2019-12-31T15:00:00.000Z"));

		// empty object
		expect(
			vs.date({}).applyTo("2020-01-01T00:00:00.000Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
	});
	it("should cause error(s)", () =>
	{
		// timezone not specified
		expect(() =>
		{
			vs.date().applyTo("2020-01-01T00:00:00.000");
		}).toThrow(vs.RULE.PATTERN);

		// wrong pattern
		expect(() =>
		{
			vs.date().applyTo("abc");
		}).toThrow(vs.RULE.PATTERN);

		// invalid date
		expect(() =>
		{
			vs.date().applyTo("9999-99-99T99:99:99.999Z");
		}).toThrow(vs.RULE.PATTERN);

		// invalid type
		expect(() =>
		{
			vs.date().applyTo(false);
		}).toThrow(vs.RULE.TYPE);
		expect(() =>
		{
			vs.date().applyTo([]);
		}).toThrow(vs.RULE.TYPE);
		expect(() =>
		{
			vs.date().applyTo({});
		}).toThrow(vs.RULE.TYPE);
	});
}

/**
 * ISO8601
 */
function testIso8601(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.date({
				iso8601: {},
			}).applyTo("2020-01-01T00:00:00.000Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
		expect(
			vs.date({
				iso8601: {},
			}).applyTo("2020-01-01T00:00:00Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
		expect(
			vs.date({
				iso8601: {},
			}).applyTo("2020-01-01T00:00Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));

		// default timezone
		expect(
			vs.date({
				iso8601: {
					defaultTimezone: "+09:00",
				},
			}).applyTo("2020-01-01T00:00:00.000Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
		expect(
			vs.date({
				iso8601: {
					defaultTimezone: "+01:00",
				},
			}).applyTo("2020-01-01T00:00:00.000")
		).toEqual(new Date("2019-12-31T23:00:00.000Z"));
	});
	it("should cause error(s)", () =>
	{
		// timezone not specified
		expect(() =>
		{
			vs.date({
				iso8601: {},
			}).applyTo("2020-01-01T00:00:00.000");
		}).toThrow(vs.RULE.PATTERN);
		expect(() =>
		{
			vs.date({
				iso8601: {
					defaultTimezone: "", // empty timezone is equivalent to be omitted
				},
			}).applyTo("2020-01-01T00:00:00.000");
		}).toThrow(vs.RULE.PATTERN);

		// wrong pattern
		expect(() =>
		{
			vs.date({
				iso8601: {},
			}).applyTo("abc");
		}).toThrow(vs.RULE.PATTERN);
		expect(() =>
		{
			vs.date({
				iso8601: {
					defaultTimezone: "",
				},
			}).applyTo("abc");
		}).toThrow(vs.RULE.PATTERN);
		expect(() =>
		{
			vs.date({
				iso8601: {
					defaultTimezone: "Z",
				},
			}).applyTo("abc");
		}).toThrow(vs.RULE.PATTERN);

		// invalid date
		expect(() =>
		{
			vs.date({
				iso8601: {},
			}).applyTo("9999-99-99T99:99:99.999Z");
		}).toThrow(vs.RULE.PATTERN);
		expect(() =>
		{
			vs.date({
				iso8601: {
					defaultTimezone: "",
				},
			}).applyTo("9999-99-99T99:99:99.999Z");
		}).toThrow(vs.RULE.PATTERN);
	});
}

/**
 * unixtime
 */
function testUnixtime(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.date({
				unixtime: {
					precision: vs.DATE.UNIXTIME.PRECISION.MILLISECONDS,
				},
			}).applyTo(1577836800000)
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));

		expect(
			vs.date({
				unixtime: {
					precision: vs.DATE.UNIXTIME.PRECISION.SECONDS,
				},
			}).applyTo(1577836800)
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));

		expect(
			vs.date({
				unixtime: {
					precision: vs.DATE.UNIXTIME.PRECISION.MINUTES,
				},
			}).applyTo(26297280)
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
	});
	it("should be adjusted", () =>
	{
		// numeric string
		expect(
			vs.date({
				unixtime: {
					precision: vs.DATE.UNIXTIME.PRECISION.MILLISECONDS,
				},
			}).applyTo("1577836800000")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));

		expect(
			vs.date({
				unixtime: {
					precision: vs.DATE.UNIXTIME.PRECISION.SECONDS,
				},
			}).applyTo("1577836800")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));

		expect(
			vs.date({
				unixtime: {
					precision: vs.DATE.UNIXTIME.PRECISION.MINUTES,
				},
			}).applyTo("26297280")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
	});
	it("should cause error(s)", () =>
	{
		// requires "unixtime.precision"
		expect(() =>
		{
			vs.date().applyTo(1577836800000);
		}).toThrow(vs.RULE.TYPE);

		expect(() =>
		{
			vs.date({
				unixtime: {
					precision: vs.DATE.UNIXTIME.PRECISION.MILLISECONDS,
				},
			}).applyTo(true);
		}).toThrow(vs.RULE.TYPE);

		expect(() =>
		{
			vs.date({
				unixtime: {
					precision: vs.DATE.UNIXTIME.PRECISION.MILLISECONDS,
				},
			}).applyTo("abcde");
		}).toThrow(vs.RULE.PATTERN);

		expect(() =>
		{
			vs.date({
				unixtime: {
					strictType: true,
					precision: vs.DATE.UNIXTIME.PRECISION.MILLISECONDS,
				},
			}).applyTo("1577836800000");
		}).toThrow(vs.RULE.PATTERN);

		// unsafe integer
		expect(() =>
		{
			vs.date({
				unixtime: {
					precision: vs.DATE.UNIXTIME.PRECISION.MILLISECONDS,
				},
			}).applyTo("99999999999999999999999999999999999999999999999999999");
		}).toThrow(vs.RULE.TYPE);

		// unknown precision
		expect(() =>
		{
			vs.date({
				unixtime: {
					precision: -1 as any, // eslint-disable-line @typescript-eslint/no-explicit-any
				},
			}).applyTo(1577836800000);
		}).toThrow(vs.RULE.TYPE);
	});
}

/**
 * if undefined
 */
function testIfUndefined(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.date({
				ifUndefined: new Date("2020-01-01T00:00:00.000Z"),
			}).applyTo("2020-12-09T00:00:00.000Z")
		).toEqual(new Date("2020-12-09T00:00:00.000Z"));
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.date({
				ifUndefined: new Date("2020-01-01T00:00:00.000Z"),
			}).applyTo(undefined)
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
	});
	it("should be undefined", () =>
	{
		expect(
			vs.date({
				ifUndefined: undefined,
			}).applyTo(undefined)
		).toBeUndefined();
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.date().applyTo(undefined);
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
			vs.date({
				ifNull: new Date("2020-01-01T00:00:00.000Z"),
			}).applyTo(null)
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.date().applyTo(null);
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
			vs.date({
				ifEmptyString: new Date("2020-01-01T00:00:00.000Z"),
			}).applyTo("")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));

		expect(
			vs.date({
				ifEmptyString: null,
			}).applyTo("")
		).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.date().applyTo("");
		}).toThrow(vs.RULE.EMPTY_STRING);
	});
}

/**
 * maxValue
 */
function testMaxValue(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.date({
				maxValue: new Date("2020-01-01T00:00:00.000Z"),
			}).applyTo("2020-01-01T00:00:00.000Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));

		expect(
			vs.date({
				maxValue: {
					value: new Date("2020-01-01T00:00:00.000Z"),
					adjusts: true,
				},
			}).applyTo("2020-01-01T00:00:00.000Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
		expect(
			vs.date({
				maxValue: {
					value: new Date("2020-01-01T00:00:00.000Z"),
					adjusts: false,
				},
			}).applyTo("2020-01-01T00:00:00.000Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.date({
				maxValue: {
					value: new Date("2020-01-01T00:00:00.000Z"),
					adjusts: true,
				},
			}).applyTo("2020-01-01T00:00:00.001Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.date({
				maxValue: new Date("2020-01-01T00:00:00.000Z"),
			}).applyTo("2020-01-01T00:00:00.001Z");
		}).toThrow(vs.RULE.MAX_VALUE);

		expect(() =>
		{
			vs.date({
				maxValue: {
					value: new Date("2020-01-01T00:00:00.000Z"),
					adjusts: false,
				},
			}).applyTo("2020-01-01T00:00:00.001Z");
		}).toThrow(vs.RULE.MAX_VALUE);

		expect(() =>
		{
			vs.date({
				maxValue: new Date("2020-01-01T00:00:00.000Z"),
			}).applyTo(true);
		}).toThrow(vs.RULE.TYPE);
	});
}

/**
 * minValue
 */
function testMinValue(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.date({
				minValue: new Date("2020-01-01T00:00:00.000Z"),
			}).applyTo("2020-01-01T00:00:00.000Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));

		expect(
			vs.date({
				minValue: {
					value: new Date("2020-01-01T00:00:00.000Z"),
					adjusts: true,
				},
			}).applyTo("2020-01-01T00:00:00.000Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
		expect(
			vs.date({
				minValue: {
					value: new Date("2020-01-01T00:00:00.000Z"),
					adjusts: false,
				},
			}).applyTo("2020-01-01T00:00:00.000Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.date({
				minValue: {
					value: new Date("2020-01-01T00:00:00.000Z"),
					adjusts: true,
				},
			}).applyTo("2019-12-31T23:59:59:999Z")
		).toEqual(new Date("2020-01-01T00:00:00.000Z"));
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.date({
				minValue: new Date("2020-01-01T00:00:00.000Z"),
			}).applyTo("2019-12-31T23:59:59:999Z");
		}).toThrow(vs.RULE.MIN_VALUE);

		expect(() =>
		{
			vs.date({
				minValue: {
					value: new Date("2020-01-01T00:00:00.000Z"),
					adjusts: false,
				},
			}).applyTo("2019-12-31T23:59:59:999Z");
		}).toThrow(vs.RULE.MIN_VALUE);

		expect(() =>
		{
			vs.date({
				minValue: new Date("2020-01-01T00:00:00.000Z"),
			}).applyTo(true);
		}).toThrow(vs.RULE.TYPE);
	});
}
