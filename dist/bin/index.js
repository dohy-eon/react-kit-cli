#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../src/utils/logger");
const file_1 = require("../src/utils/file");
const tailwind_1 = require("../src/config/tailwind");
const vitest_1 = require("../src/config/vitest");
const state_management_1 = require("../src/config/state-management");
const program = new commander_1.Command();
async function addTailwindConfig(projectPath) {
    logger_1.logger.info('Tailwind CSS 설정을 추가합니다...');
    await (0, file_1.writeConfigFile)(projectPath, tailwind_1.tailwindConfig.path, tailwind_1.tailwindConfig.content);
    await (0, file_1.writeConfigFile)(projectPath, tailwind_1.postcssConfig.path, tailwind_1.postcssConfig.content);
    await (0, file_1.updatePackageJson)(projectPath, (pkg) => ({
        ...pkg,
        devDependencies: {
            ...pkg.devDependencies,
            ...tailwind_1.tailwindDependencies,
        },
    }));
    await (0, file_1.writeConfigFile)(projectPath, 'src/index.css', tailwind_1.tailwindCssContent);
}
async function addVitestConfig(projectPath) {
    logger_1.logger.info('Vitest 설정을 추가합니다...');
    await (0, file_1.writeConfigFile)(projectPath, vitest_1.vitestConfig.path, vitest_1.vitestConfig.content);
    await (0, file_1.updatePackageJson)(projectPath, (pkg) => ({
        ...pkg,
        devDependencies: {
            ...pkg.devDependencies,
            ...vitest_1.vitestDependencies,
        },
        scripts: {
            ...pkg.scripts,
            ...vitest_1.vitestScripts,
        },
    }));
    await (0, file_1.writeConfigFile)(projectPath, 'src/test/setup.ts', vitest_1.testSetupContent);
}
async function addReduxConfig(projectPath) {
    logger_1.logger.info('Redux 설정을 추가합니다...');
    await (0, file_1.writeConfigFile)(projectPath, state_management_1.reduxConfig.path, state_management_1.reduxConfig.content);
    await (0, file_1.writeConfigFile)(projectPath, state_management_1.reduxSliceConfig.path, state_management_1.reduxSliceConfig.content);
    await (0, file_1.updatePackageJson)(projectPath, (pkg) => ({
        ...pkg,
        dependencies: {
            ...pkg.dependencies,
            ...state_management_1.reduxDependencies,
        },
    }));
}
async function addRecoilConfig(projectPath) {
    logger_1.logger.info('Recoil 설정을 추가합니다...');
    await (0, file_1.writeConfigFile)(projectPath, state_management_1.recoilConfig.path, state_management_1.recoilConfig.content);
    await (0, file_1.updatePackageJson)(projectPath, (pkg) => ({
        ...pkg,
        dependencies: {
            ...pkg.dependencies,
            ...state_management_1.recoilDependencies,
        },
    }));
}
async function initProject(projectName, options) {
    try {
        if (!projectName) {
            throw new Error('프로젝트 이름을 입력해주세요.');
        }
        const projectPath = path_1.default.join(process.cwd(), projectName);
        const templatePath = path_1.default.resolve(__dirname, '../templates/base');
        logger_1.logger.debug(`템플릿 경로: ${templatePath}`);
        logger_1.logger.debug(`package.json 존재 여부: ${path_1.default.join(templatePath, 'package.json')}`);
        await (0, file_1.createProjectDirectory)(projectPath);
        await (0, file_1.copyTemplateFiles)(templatePath, projectPath);
        if (options.withTailwind) {
            await addTailwindConfig(projectPath);
        }
        if (options.withVitest) {
            await addVitestConfig(projectPath);
        }
        if (options.withRedux) {
            await addReduxConfig(projectPath);
        }
        if (options.withRecoil) {
            await addRecoilConfig(projectPath);
        }
        logger_1.logger.success('\n프로젝트 생성이 완료되었습니다!');
        logger_1.logger.warning('\n다음 명령어로 시작하세요:');
        logger_1.logger.info(`  cd ${projectName}`);
        logger_1.logger.info('  npm install');
        logger_1.logger.info('  npm run dev');
    }
    catch (error) {
        logger_1.logger.error('프로젝트 생성 중 오류가 발생했습니다:', error);
        process.exit(1);
    }
}
program
    .name('react-kit')
    .description('리액트 프로젝트 세팅 도구')
    .version('1.0.0');
program
    .command('init')
    .description('기본 템플릿 적용')
    .argument('[projectName]', '프로젝트 이름')
    .option('--with-tailwind', 'Tailwind CSS 포함')
    .option('--with-vitest', 'Vitest 포함')
    .option('--with-redux', 'Redux 포함')
    .option('--with-recoil', 'Recoil 포함')
    .action(initProject);
program.parse();
