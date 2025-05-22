import { ConfigFile } from '../types';

export const tailwindConfig: ConfigFile = {
  path: 'tailwind.config.js',
  content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
};

export const postcssConfig: ConfigFile = {
  path: 'postcss.config.js',
  content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
};

export const tailwindDependencies = {
  tailwindcss: '^3.4.1',
  postcss: '^8.4.35',
  autoprefixer: '^10.4.17',
};

export const tailwindCssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;`;
