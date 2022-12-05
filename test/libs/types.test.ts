import {describe, expect, it} from "@jest/globals";
import {isNumericString} from "../../src/libs/types";

{
	describe("isNumericString", testIsNumericString);
}

/**
 * isNumericString
 */
function testIsNumericString(): void
{
	it("should be truthy", () =>
	{
		expect(isNumericString("123")).toBeTruthy();
		expect(isNumericString("+123")).toBeTruthy();
		expect(isNumericString("-123")).toBeTruthy();

		expect(isNumericString("123.")).toBeTruthy();
		expect(isNumericString("123.456")).toBeTruthy();
		expect(isNumericString(".456")).toBeTruthy();

		expect(isNumericString("-123.")).toBeTruthy();
		expect(isNumericString("-123.456")).toBeTruthy();
		expect(isNumericString("-.456")).toBeTruthy();
	});
	it("should be falsy", () =>
	{
		expect(isNumericString("")).toBeFalsy();
		expect(isNumericString("1a")).toBeFalsy();
		expect(isNumericString(".")).toBeFalsy();
		expect(isNumericString("+")).toBeFalsy();
		expect(isNumericString("-.")).toBeFalsy();
	});
}
