#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";

const program = new Command();

// Tailwind CSS 설정 추가 함수
async function addTailwindConfig(projectPath: string) {
	const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

	const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

	await fs.writeFile(path.join(projectPath, "tailwind.config.js"), tailwindConfig);
	await fs.writeFile(path.join(projectPath, "postcss.config.js"), postcssConfig);

	// package.json에 의존성 추가
	const packageJsonPath = path.join(projectPath, "package.json");
	const packageJson = await fs.readJson(packageJsonPath);
	
	packageJson.devDependencies = {
		...packageJson.devDependencies,
		"tailwindcss": "^3.4.1",
		"postcss": "^8.4.35",
		"autoprefixer": "^10.4.17"
	};

	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

	// src/index.css에 Tailwind 지시어 추가
	const cssPath = path.join(projectPath, "src/index.css");
	await fs.writeFile(cssPath, `@tailwind base;
@tailwind components;
@tailwind utilities;`);
}

// Vitest 설정 추가 함수
async function addVitestConfig(projectPath: string) {
	const vitestConfig = `/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})`;

	await fs.writeFile(path.join(projectPath, "vitest.config.ts"), vitestConfig);

	// package.json에 의존성과 스크립트 추가
	const packageJsonPath = path.join(projectPath, "package.json");
	const packageJson = await fs.readJson(packageJsonPath);
	
	packageJson.devDependencies = {
		...packageJson.devDependencies,
		"vitest": "^1.2.2",
		"@testing-library/react": "^14.2.1",
		"@testing-library/jest-dom": "^6.4.2",
		"jsdom": "^24.0.0"
	};

	packageJson.scripts = {
		...packageJson.scripts,
		"test": "vitest",
		"test:ui": "vitest --ui",
		"coverage": "vitest run --coverage"
	};

	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

	// 테스트 설정 파일 생성
	const testSetupPath = path.join(projectPath, "src/test/setup.ts");
	await fs.ensureDir(path.dirname(testSetupPath));
	await fs.writeFile(testSetupPath, `import '@testing-library/jest-dom';`);
}

program
	.name("react-kit")
	.description("리액트 프로젝트 세팅 도구")
	.version("1.0.0");

//기본 명령어(init)
program
	.command("init")
	.description("기본 템플릿 적용")
	.argument("[projectName]", "프로젝트 이름")
	.option("--with-tailwind", "Tailwind CSS 포함")
	.option("--with-vitest", "Vitest 포함")
	.action(async (projectName, options) => {
		try {
			// 1. 프로젝트 이름 확인
			if (!projectName) {
				console.log(chalk.red("프로젝트 이름을 입력해주세요."));
				process.exit(1);
			}

			// 2. 프로젝트 폴더 생성
			const projectPath = path.join(process.cwd(), projectName);
			if (fs.existsSync(projectPath)) {
				console.log(chalk.red(`'${projectName}' 폴더가 이미 존재합니다.`));
				process.exit(1);
			}

			console.log(chalk.green(`'${projectName}' 프로젝트를 생성합니다...`));
			await fs.mkdir(projectPath);

			// 3. 템플릿 복사
			const templatePath = path.resolve(__dirname, "../templates/base");
			console.log("[DEBUG] 템플릿 경로:", templatePath);
			console.log("[DEBUG] package.json 존재 여부:", fs.existsSync(path.join(templatePath, "package.json")));

			// package.json 복사
			fs.copyFileSync(path.join(templatePath, "package.json"), path.join(projectPath, "package.json"));

			// 나머지 파일 복사
			fs.copySync(templatePath, projectPath, { filter: (src) => !src.endsWith('package.json') });

			console.log("[DEBUG] 복사 후 package.json 존재 여부:", fs.existsSync(path.join(projectPath, "package.json")));

			// 4. 옵션에 따른 추가 설정
			if (options.withTailwind) {
				console.log(chalk.blue("Tailwind CSS 설정을 추가합니다..."));
				await addTailwindConfig(projectPath);
			}

			if (options.withVitest) {
				console.log(chalk.blue("Vitest 설정을 추가합니다..."));
				await addVitestConfig(projectPath);
			}

			console.log(chalk.green("\n프로젝트 생성이 완료되었습니다!"));
			console.log(chalk.yellow("\n다음 명령어로 시작하세요:"));
			console.log(chalk.cyan(`  cd ${projectName}`));
			console.log(chalk.cyan("  npm install"));
			console.log(chalk.cyan("  npm run dev"));

		} catch (error) {
			console.error(chalk.red("프로젝트 생성 중 오류가 발생했습니다:"), error);
			process.exit(1);
		}
	});

program.parse();