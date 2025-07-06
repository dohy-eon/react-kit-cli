#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import { ProjectOptions } from '../src/types';
import { logger } from '../src/utils/logger';
import {
  createProjectDirectory,
  copyTemplateFiles,
  updatePackageJson,
  writeConfigFile,
} from '../src/utils/file';
import {
  tailwindConfig,
  postcssConfig,
  tailwindDependencies,
  tailwindCssContent,
} from '../src/config/tailwind';
import {
  vitestConfig,
  vitestDependencies,
  vitestScripts,
  testSetupContent,
} from '../src/config/vitest';
import {
  reduxDependencies,
  recoilDependencies,
  reduxConfig,
  reduxSliceConfig,
  recoilConfig,
} from '../src/config/state-management';

const program = new Command();

async function addTailwindConfig(projectPath: string): Promise<void> {
  logger.info('Tailwind CSS 설정을 추가합니다...');

  await writeConfigFile(projectPath, tailwindConfig.path, tailwindConfig.content);
  await writeConfigFile(projectPath, postcssConfig.path, postcssConfig.content);

  await updatePackageJson(projectPath, pkg => ({
    ...pkg,
    devDependencies: {
      ...pkg.devDependencies,
      ...tailwindDependencies,
    },
  }));

  await writeConfigFile(projectPath, 'src/index.css', tailwindCssContent);
}

async function addVitestConfig(projectPath: string): Promise<void> {
  logger.info('Vitest 설정을 추가합니다...');

  await writeConfigFile(projectPath, vitestConfig.path, vitestConfig.content);

  await updatePackageJson(projectPath, pkg => ({
    ...pkg,
    devDependencies: {
      ...pkg.devDependencies,
      ...vitestDependencies,
    },
    scripts: {
      ...pkg.scripts,
      ...vitestScripts,
    },
  }));

  await writeConfigFile(projectPath, 'src/test/setup.ts', testSetupContent);
}

async function addReduxConfig(projectPath: string): Promise<void> {
  logger.info('Redux 설정을 추가합니다...');

  await writeConfigFile(projectPath, reduxConfig.path, reduxConfig.content);
  await writeConfigFile(projectPath, reduxSliceConfig.path, reduxSliceConfig.content);

  await updatePackageJson(projectPath, pkg => ({
    ...pkg,
    dependencies: {
      ...pkg.dependencies,
      ...reduxDependencies,
    },
  }));
}

async function addRecoilConfig(projectPath: string): Promise<void> {
  logger.info('Recoil 설정을 추가합니다...');

  await writeConfigFile(projectPath, recoilConfig.path, recoilConfig.content);

  await updatePackageJson(projectPath, pkg => ({
    ...pkg,
    dependencies: {
      ...pkg.dependencies,
      ...recoilDependencies,
    },
  }));
}

async function initProject(projectName: string, options: ProjectOptions): Promise<void> {
  try {
    if (!projectName) {
      throw new Error('프로젝트 이름을 입력해주세요.');
    }

    const projectPath = path.join(process.cwd(), projectName);
    const templatePath = path.resolve(__dirname, '../templates/base');

    logger.debug(`템플릿 경로: ${templatePath}`);
    logger.debug(`package.json 존재 여부: ${path.join(templatePath, 'package.json')}`);

    await createProjectDirectory(projectPath);
    await copyTemplateFiles(templatePath, projectPath);

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

    logger.success('\n프로젝트 생성이 완료되었습니다!');
    logger.warning('\n다음 명령어로 시작하세요:');
    logger.info(`  cd ${projectName}`);
    logger.info('  npm install');
    logger.info('  npm run dev');
  } catch (error) {
    logger.error('프로젝트 생성 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

program.name('react-kit').description('리액트 프로젝트 세팅 도구').version('1.0.0');

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
