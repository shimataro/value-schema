import adjuster from "index";

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
	describe("constraints", testConstraints);
}

/**
 * type
 * @return {void}
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(adjuster.object()
			.adjust({})).toEqual({});

		expect(adjuster.object()
			.adjust({
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
			adjuster.object()
				.adjust(123);
		}).toThrow(adjuster.CAUSE.TYPE);
	});
}

/**
 * default value
 * @return {void}
 */
function testDefault()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.object().default({})
			.adjust(undefined)).toEqual({});
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.object()
				.adjust(undefined);
		}).toThrow(adjuster.CAUSE.REQUIRED);
	});
}

/**
 * null
 * @return {void}
 */
function testAcceptNull()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.object().acceptNull({})
			.adjust(null)).toEqual({});
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.object()
				.adjust(null);
		}).toThrow(adjuster.CAUSE.NULL);
	});
}

/**
 * empty string
 * @return {void}
 */
function testAcceptEmptyString()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.object().acceptEmptyString({})
			.adjust("")).toEqual({});
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.object()
				.adjust("");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * constraints
 * @return {void}
 */
function testConstraints()
{
	it("should be adjusted", () =>
	{
		const constraints = {
			id: adjuster.number().minValue(1),
			name: adjuster.string().maxLength(4, true),
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
		expect(adjuster.object().constraints(constraints)
			.adjust(input)).toEqual(expected);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			const constraints = {
				id: adjuster.number().minValue(1),
				name: adjuster.string().maxLength(4, true),
			};
			const input = {
				id: "0",
				name: "John Doe",
				dummy: true,
			};
			adjuster.object().constraints(constraints)
				.adjust(input);
		}).toThrow(adjuster.CAUSE.MIN_VALUE);
	});
}
