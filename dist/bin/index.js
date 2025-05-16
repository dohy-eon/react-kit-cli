#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name("react-kit")
    .description("리액트 프로젝트 세팅 도구")
    .version("1.0.0");
//기본 명령어(init)
program
    .command("init")
    .description("기본 템플릿 적용")
    .action(() => {
    console.log(chalk_1.default.green("템플릿 적용을 시작합니다."));
});
program.parse();
