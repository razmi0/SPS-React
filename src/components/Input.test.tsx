import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
    it("should render input with correct props", () => {
        render(<Input name="test" htmlFor="test" placeholder="Enter text" type="text" onChange={() => {}} />);

        const input = screen.getByPlaceholderText("Enter text");
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("type", "text");
        expect(input).toHaveAttribute("name", "test");
        expect(input).toHaveAttribute("id", "test");
    });

    it("should display clear icon when value is provided", () => {
        render(
            <Input
                name="test"
                htmlFor="test"
                placeholder="Enter text"
                type="text"
                value="test value"
                onChange={() => {}}
            />
        );

        const clearIcon = screen.getByRole("button", { name: /effacer le champ/i });
        expect(clearIcon).toBeInTheDocument();
    });

    it("should not display clear icon when value is empty", () => {
        render(<Input name="test" htmlFor="test" placeholder="Enter text" type="text" value="" onChange={() => {}} />);

        const clearIcon = screen.queryByRole("button", { name: /effacer le champ/i });
        expect(clearIcon).not.toBeInTheDocument();
    });

    it("should not display clear icon when disabled", () => {
        render(<Input name="test" htmlFor="test" placeholder="Enter text" type="text" value="test value" disabled />);

        const clearIcon = screen.queryByRole("button", { name: /effacer le champ/i });
        expect(clearIcon).not.toBeInTheDocument();
    });

    it("should call onChange when clear icon is clicked", () => {
        const handleChange = vi.fn();
        render(
            <Input
                name="test"
                htmlFor="test"
                placeholder="Enter text"
                type="text"
                value="test value"
                onChange={handleChange}
            />
        );

        const clearIcon = screen.getByRole("button", { name: /effacer le champ/i });
        fireEvent.click(clearIcon);

        expect(handleChange).toHaveBeenCalledTimes(1);
        const syntheticEvent = handleChange.mock.calls[0][0];
        expect(syntheticEvent.target.value).toBe("");
        expect(syntheticEvent.target.name).toBe("test");
    });

    it("should apply correct color classes for white color", () => {
        render(<Input name="test" htmlFor="test" placeholder="Enter text" type="text" color="white" />);

        const label = screen.getByPlaceholderText("Enter text").closest("label");
        expect(label).toHaveClass("text-white");
    });

    it("should apply correct color classes for black color", () => {
        render(<Input name="test" htmlFor="test" placeholder="Enter text" type="text" color="black" />);

        const label = screen.getByPlaceholderText("Enter text").closest("label");
        expect(label).toHaveClass("text-black");
    });

    it("should apply correct background classes", () => {
        const { rerender } = render(
            <Input name="test" htmlFor="test" placeholder="Enter text" type="text" bg="white" onChange={() => {}} />
        );

        let input = screen.getByPlaceholderText("Enter text");
        expect(input).toHaveClass("bg-white");

        rerender(
            <Input name="test" htmlFor="test" placeholder="Enter text" type="text" bg="grey" onChange={() => {}} />
        );

        input = screen.getByPlaceholderText("Enter text");
        expect(input).toHaveClass("bg-grey");
    });

    it("should handle input changes", () => {
        const handleChange = vi.fn();
        render(<Input name="test" htmlFor="test" placeholder="Enter text" type="text" onChange={handleChange} />);

        const input = screen.getByPlaceholderText("Enter text");
        fireEvent.change(input, { target: { value: "new value" } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should be disabled when disabled prop is true", () => {
        render(<Input name="test" htmlFor="test" placeholder="Enter text" type="text" disabled onChange={() => {}} />);

        const input = screen.getByPlaceholderText("Enter text");
        expect(input).toBeDisabled();
    });
});
