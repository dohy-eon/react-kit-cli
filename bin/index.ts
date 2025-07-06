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

function validateProjectName(projectName: string): void {
  if (!/^[a-z0-9-]+$/.test(projectName)) {
    throw new Error(
      '프로젝트 이름은 소문자, 숫자, 하이픈만 사용할 수 있습니다.'
    );
  }
  
  if (projectName.length < 1 || projectName.length > 50) {
    throw new Error('프로젝트 이름은 1-50자 사이여야 합니다.');
  }
}

function validateOptions(options: ProjectOptions): void {
  if (options.withRedux && options.withRecoil) {
    logger.warning('Redux와 Recoil을 동시에 사용하는 것은 권장하지 않습니다.');
    logger.info('하나의 상태관리 라이브러리만 선택하는 것을 권장합니다.');
  }
}

async function addTailwindConfig(projectPath: string): Promise<void> {
  logger.progress('Tailwind CSS 설정을 추가합니다...');

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
  logger.progress('Vitest 설정을 추가합니다...');

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
  logger.progress('Redux 설정을 추가합니다...');

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
  logger.progress('Recoil 설정을 추가합니다...');

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

    // 프로젝트 이름 검증
    validateProjectName(projectName);
    
    // 옵션 검증
    validateOptions(options);

    const projectPath = path.join(process.cwd(), projectName);
    const templatePath = path.resolve(__dirname, '../templates/base');

    logger.debug(`템플릿 경로: ${templatePath}`);
    logger.debug(`package.json 존재 여부: ${path.join(templatePath, 'package.json')}`);

    await createProjectDirectory(projectPath);
    await copyTemplateFiles(templatePath, projectPath, projectName);

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

    logger.success('\n🎉 프로젝트 생성이 완료되었습니다!');
    logger.info('\n📋 다음 단계를 따라하세요:');
    logger.info(`   1. cd ${projectName}`);
    logger.info('   2. npm install');
    logger.info('   3. npm run dev');
    logger.info('\n🛠️  유용한 명령어:');
    logger.info('   npm run build    # 프로덕션 빌드');
    logger.info('   npm run lint     # 코드 검사');
    logger.info('   npm run preview  # 빌드 미리보기');
  } catch (error) {
    logger.error('프로젝트 생성 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

program.name('react-kit').description('리액트 프로젝트 세팅 도구').version('1.2.0');

program
  .command('create')
  .description('새로운 React 프로젝트 생성')
  .argument('<projectName>', '프로젝트 이름')
  .option('--with-tailwind', 'Tailwind CSS 포함')
  .option('--with-vitest', 'Vitest 포함')
  .option('--with-redux', 'Redux 포함')
  .option('--with-recoil', 'Recoil 포함')
  .action(initProject);

program.parse();
