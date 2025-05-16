#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
	.name("react-kit")
	.description("리액트 프로젝트 세팅 도구")
	.version("1.0.0");

program.parse();
