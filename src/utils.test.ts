import { describe, expect, it } from "vitest";
import { calcPriceFromString } from "./utils";

describe("utils", () => {
    describe("calcPriceFromString", () => {
        it("should multiply two numbers correctly", () => {
            expect(calcPriceFromString(10, 5)).toBe(50);
            expect(calcPriceFromString(2.5, 4)).toBe(10);
        });

        it("should convert string numbers to numbers and multiply", () => {
            expect(calcPriceFromString("10", "5")).toBe(50);
            expect(calcPriceFromString("2.5", "4")).toBe(10);
        });

        it("should handle mixed string and number inputs", () => {
            expect(calcPriceFromString("10", 5)).toBe(50);
            expect(calcPriceFromString(10, "5")).toBe(50);
        });

        it("should handle decimal strings", () => {
            expect(calcPriceFromString("10.5", "2")).toBe(21);
            expect(calcPriceFromString("3.14", "2")).toBe(6.28);
        });

        it("should handle zero values", () => {
            expect(calcPriceFromString(0, 5)).toBe(0);
            expect(calcPriceFromString(10, 0)).toBe(0);
            expect(calcPriceFromString("0", "5")).toBe(0);
        });

        it("should handle negative numbers", () => {
            expect(calcPriceFromString(-10, 5)).toBe(-50);
            expect(calcPriceFromString("-10", "5")).toBe(-50);
        });
    });
});
