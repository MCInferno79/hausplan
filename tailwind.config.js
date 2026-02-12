/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#000000',
                glass: 'rgba(18, 18, 18, 0.8)',
                'border-glass': '#333333',
                'waste-bio': '#795548',   // Brown
                'waste-paper': '#2196F3', // Blue
                'waste-yellow': '#FBC02D',// Yellow/Gold
                'waste-rest': '#616161',  // Grey
            },
        },
    },
    plugins: [],
}
