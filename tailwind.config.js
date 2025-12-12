/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";
export default {
    content: ["./src/**/*.{ts,tsx,js,jsx}", "./public/**/*.html"],
    theme: {
        extend: {
            colors: {
                primary: "#093C6F",
                secondary: "#D6AD3A",
                dark: {
                    primary: "#1D1D1F",
                    secondary: "#2C2C2C",
                },
                grey: "#757575",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [tailwindcssAnimate],
};
