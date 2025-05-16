#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

program
	.name("react-kit")
	.description("리액트 프로젝트 세팅 도구")
	.version("1.0.0");

//기본 명령어(init)
program
	.command("init")
	.description("기본 템플릿 적용")
	.action(() => {
		console.log(chalk.green("템플릿 적용을 시작합니다."))
	});

program.parse();