import { ProjectConfig, TemplateError } from '../types';
import { logger } from './logger';
import { writeConfigFile, updatePackageJson } from './file';
import {
  tailwindConfig,
  postcssConfig,
  tailwindDependencies,
  tailwindCssContent,
} from '../config/tailwind';
import {
  vitestConfig,
  vitestDependencies,
  vitestScripts,
  testSetupContent,
} from '../config/vitest';
import {
  reduxDependencies,
  recoilDependencies,
  reduxConfig,
  reduxSliceConfig,
  recoilConfig,
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

    await writeConfigFile(projectPath, 'src/index.css', tailwindCssContent);
  }

  /**
   * Vitest 설정을 추가
   */
  private async addVitestConfig(): Promise<void> {
    logger.progress('Vitest 설정을 추가합니다...');

    const { projectPath } = this.config;

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

  /**
   * Redux 설정을 추가
   */
  private async addReduxConfig(): Promise<void> {
    logger.progress('Redux 설정을 추가합니다...');

    const { projectPath } = this.config;

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

  /**
   * Recoil 설정을 추가
   */
  private async addRecoilConfig(): Promise<void> {
    logger.progress('Recoil 설정을 추가합니다...');

    const { projectPath } = this.config;

    await writeConfigFile(projectPath, recoilConfig.path, recoilConfig.content);

    await updatePackageJson(projectPath, pkg => ({
      ...pkg,
      dependencies: {
        ...pkg.dependencies,
        ...recoilDependencies,
      },
    }));
  }
}
