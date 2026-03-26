/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{ts,tsx,js,jsx}", "./public/**/*.html", "./public/**/*.js"],
    theme: {
        extend: {
            colors: {
                zap: {
                    midnight: '#0B132B', // Main background
                    teal: '#48CAE4',     // Action Accent & Insights
                    yellow: '#E9FF70',   // High-Vis Utility/New tags
                    magenta: '#D886D6',  // Studio/Mind Map tools
                },
            },
            borderWidth: {
                '3': '3px', // For the Neo-Brutal heavy borders
            },
            boxShadow: {
                'brutal': '4px 4px 0px 0px rgba(0,0,0,1)', // Hard offset shadows
            },
            fontFamily: {
                display: ['"Space Grotesk"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
}
