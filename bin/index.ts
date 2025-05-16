#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";

const program = new Command();

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
			const templatePath = path.join(__dirname, "../templates/base");
			await fs.copy(templatePath, projectPath);

			// 4. 옵션에 따른 추가 설정
			if (options.withTailwind) {
				console.log(chalk.blue("Tailwind CSS 설정을 추가합니다..."));
				// TODO: Tailwind 설정 추가
			}

			if (options.withVitest) {
				console.log(chalk.blue("Vitest 설정을 추가합니다..."));
				// TODO: Vitest 설정 추가
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