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

/**
 * 기존 CSS 내용에 Tailwind 지시문을 추가합니다.
 * @param existingContent 기존 CSS 내용
 * @returns Tailwind 지시문이 추가된 CSS 내용
 */
export function mergeTailwindCssContent(existingContent: string): string {
  // 이미 Tailwind 지시문이 있으면 그대로 반환
  if (
    existingContent.includes('@tailwind base') ||
    existingContent.includes('@tailwind components') ||
    existingContent.includes('@tailwind utilities')
  ) {
    return existingContent;
  }

  // 기존 내용이 있으면 앞에 Tailwind 지시문 추가
  if (existingContent.trim()) {
    return `${tailwindCssContent}\n\n${existingContent}`;
  }

  // 기존 내용이 없으면 Tailwind 지시문만 반환
  return tailwindCssContent;
}
