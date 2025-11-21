import { ProjectConfig, TemplateError } from '../types';
import { logger } from './logger';
import { writeConfigFile, updatePackageJson, mergeConfigFile } from './file';
import {
  tailwindConfig,
  postcssConfig,
  tailwindDependencies,
  mergeTailwindCssContent,
} from '../config/tailwind';
import {
  vitestDependencies,
  vitestScripts,
  testSetupContent,
  mergeVitestConfigToViteConfig,
} from '../config/vitest';
import {
  reduxDependencies,
  recoilDependencies,
  reduxConfig,
  reduxSliceConfig,
  reduxAppConfig,
  reduxCounterConfig,
  recoilConfig,
  recoilMainConfig,
  recoilAppConfig,
  recoilCounterConfig,
} from '../config/state-management';

export class ConfigManager {
  private config: ProjectConfig;

  constructor(config: ProjectConfig) {
    this.config = config;
  }

  /**
   * 모든 설정을 추가
   */
  async addAllConfigs(): Promise<void> {
    try {
      if (this.config.options.withTailwind) {
        await this.addTailwindConfig();
      }

      if (this.config.options.withVitest) {
        await this.addVitestConfig();
      }

      if (this.config.options.withRedux) {
        await this.addReduxConfig();
      }

      if (this.config.options.withRecoil) {
        await this.addRecoilConfig();
      }
    } catch (error) {
      throw new TemplateError('설정 추가 중 오류가 발생했습니다.', error as Error);
    }
  }

  /**
   * Tailwind CSS 설정을 추가
   */
  private async addTailwindConfig(): Promise<void> {
    logger.progress('Tailwind CSS 설정을 추가합니다...');

    const { projectPath } = this.config;

    await writeConfigFile(projectPath, tailwindConfig.path, tailwindConfig.content);
    await writeConfigFile(projectPath, postcssConfig.path, postcssConfig.content);

    await updatePackageJson(projectPath, pkg => ({
      ...pkg,
      devDependencies: {
        ...pkg.devDependencies,
        ...tailwindDependencies,
      },
    }));

    // 기존 CSS 내용을 유지하면서 Tailwind 지시문 추가
    await mergeConfigFile(projectPath, 'src/index.css', mergeTailwindCssContent);
  }

  /**
   * Vitest 설정을 추가
   */
  private async addVitestConfig(): Promise<void> {
    logger.progress('Vitest 설정을 추가합니다...');

    const { projectPath } = this.config;

    // vite.config.ts에 test 설정 병합
    await mergeConfigFile(projectPath, 'vite.config.ts', mergeVitestConfigToViteConfig);

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

  /**
   * Redux 설정을 추가
   */
  private async addReduxConfig(): Promise<void> {
    logger.progress('Redux 설정을 추가합니다...');

    const { projectPath } = this.config;

    // Store 설정 파일
    await writeConfigFile(projectPath, reduxConfig.path, reduxConfig.content);
    await writeConfigFile(projectPath, reduxSliceConfig.path, reduxSliceConfig.content);

    // App.tsx와 Counter.tsx를 Redux 버전으로 교체
    await writeConfigFile(projectPath, reduxAppConfig.path, reduxAppConfig.content);
    await writeConfigFile(projectPath, reduxCounterConfig.path, reduxCounterConfig.content);

    await updatePackageJson(projectPath, pkg => ({
      ...pkg,
      dependencies: {
        ...pkg.dependencies,
        ...reduxDependencies,
      },
    }));
  }

  /**
   * Recoil 설정을 추가
   */
  private async addRecoilConfig(): Promise<void> {
    logger.progress('Recoil 설정을 추가합니다...');

    const { projectPath } = this.config;

    // Store 설정 파일
    await writeConfigFile(projectPath, recoilConfig.path, recoilConfig.content);

    // main.tsx에 RecoilRoot 추가
    await writeConfigFile(projectPath, recoilMainConfig.path, recoilMainConfig.content);

    // App.tsx와 Counter.tsx를 Recoil 버전으로 교체
    await writeConfigFile(projectPath, recoilAppConfig.path, recoilAppConfig.content);
    await writeConfigFile(projectPath, recoilCounterConfig.path, recoilCounterConfig.content);

    await updatePackageJson(projectPath, pkg => ({
      ...pkg,
      dependencies: {
        ...pkg.dependencies,
        ...recoilDependencies,
      },
    }));
  }
}
