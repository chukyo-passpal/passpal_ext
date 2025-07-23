/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // Optional: Add the `pages` directory to include HTML pages.
        "./pages/**/*.{html,js,ts,jsx,tsx,mdx}",

        // Include all relevant files for the extension.
        "./**/*.{html,js,ts,jsx,tsx,mdx}",

        // For projects using a `src` directory:
        "./src/**/*.{html,js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("shadcn-ui/tailwind")],
};
