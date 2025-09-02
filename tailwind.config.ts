import type { Config } from 'tailwindcss';


const config: Config = {
darkMode: ['class', '.dark'],
content: [
'.src/app/**/*.{ts,tsx}',
'.src/components/**/*.{ts,tsx}',
],
theme: {
extend: {
borderRadius: { '2xl': '1rem' },
},
},
plugins: [],
};
export default config;