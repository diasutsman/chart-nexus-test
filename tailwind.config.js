/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js}"],
	darkMode: "selector",
	theme: {
		extend: {
			keyframes: {
				flash: {
					"0%, 100%": { backgroundColor: "inherit" },
					"50%": { backgroundColor: "orange" },
				},
			},
			animation: {
				flash: "flash 1s ease-in-out",
			},
		},
	},
	plugins: [],
};
