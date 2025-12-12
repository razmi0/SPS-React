import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export const calcPriceFromString = (n1: string | number, n2: string | number): number => {
    const temp1 = typeof n1 === "string" ? parseFloat(n1) : n1;
    const temp2 = typeof n2 === "string" ? parseFloat(n2) : n2;
    return temp1 * temp2;
};
