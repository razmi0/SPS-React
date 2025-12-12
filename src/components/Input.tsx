import { PlusIcon } from "lucide-react";

import { cn } from "../utils";
import { Input as RadixInput } from "./ui/input";

export const Input = ({
    name,
    htmlFor,
    placeholder,
    type,
    color,
    bg,
    iconSize,
    value,
    onChange,
    disabled,
}: {
    name: string;
    htmlFor: string;
    placeholder: string;
    type: string;
    color?: "white" | "black";
    bg?: "white" | "grey";
    iconSize?: number;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}) => {
    const xcolor = color === "black" ? "text-black" : "text-white";
    const xbg = bg === "white" ? "bg-white" : "bg-grey";
    const xplaceholder = color === "black" ? "placeholder:text-black" : "placeholder:text-white";

    const handleClear = (e: React.MouseEvent<SVGSVGElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (onChange) {
            // Create a synthetic event to clear the input
            const syntheticEvent = {
                target: {
                    value: "",
                    name: name,
                },
                currentTarget: {
                    value: "",
                    name: name,
                },
            } as React.ChangeEvent<HTMLInputElement>;

            onChange(syntheticEvent);
        }
    };

    const hasValue = value !== undefined && value !== null && value !== "";

    return (
        <label htmlFor={htmlFor} className={cn("relative w-full max-w-[90%]", xcolor)}>
            <RadixInput
                type={type}
                name={name}
                id={htmlFor}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={cn("rounded-full h-10 w-full", xplaceholder, xbg)}
                disabled={disabled}
            />
            {hasValue && !disabled && (
                <PlusIcon
                    size={iconSize || 18}
                    className={cn(
                        "rotate-45 absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity",
                        xcolor
                    )}
                    onClick={handleClear}
                    role="button"
                    aria-label="Effacer le champ"
                />
            )}
        </label>
    );
};
