import path from 'path';
import { CreateProjectParams, ProjectConfig, ProjectCreationError, TemplateError } from '../types';
import { logger } from './logger';
import { createProjectDirectory, copyTemplateFiles } from './file';
import { ProjectValidator } from './validator';
import { ConfigManager } from './config-manager';

export class ProjectGenerator {
  private readonly templatePath: string;

  constructor() {
    this.templatePath = path.resolve(__dirname, '../../templates/base');
  }

  /**
   * 새로운 React 프로젝트를 생성합니다.
   * @param params 프로젝트 생성 파라미터
   */
  async createProject(params: CreateProjectParams): Promise<void> {
    try {
      // 1. 파라미터 검증
      ProjectValidator.validateCreateProjectParams(params);

      // 2. 프로젝트 설정 생성
      const config = this.createProjectConfig(params);

      // 3. 디버그 정보 출력
      this.logDebugInfo(config);

      // 4. 프로젝트 디렉토리 생성
      await createProjectDirectory(config.projectPath);

      // 5. 템플릿 파일 복사
      await this.copyTemplateFiles(config);

      // 6. 설정 추가
      await this.addConfigurations(config);

      // 7. 성공 메시지 출력
      this.showSuccessMessage(config.projectName);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 프로젝트 설정을 생성합니다.
   * @param params 프로젝트 생성 파라미터
   * @returns 프로젝트 설정
   */
  private createProjectConfig(params: CreateProjectParams): ProjectConfig {
    const { projectName, options } = params;
    const projectPath = path.join(process.cwd(), projectName);

    return {
      projectPath,
      templatePath: this.templatePath,
      projectName,
      options,
    };
  }

  /**
   * 디버그 정보를 출력합니다.
   * @param config 프로젝트 설정
   */
  private logDebugInfo(config: ProjectConfig): void {
    logger.debug(`템플릿 경로: ${config.templatePath}`);
    logger.debug(`package.json 존재 여부: ${path.join(config.templatePath, 'package.json')}`);
  }

  /**
   * 템플릿 파일을 복사합니다.
   * @param config 프로젝트 설정
   */
  private async copyTemplateFiles(config: ProjectConfig): Promise<void> {
    try {
      await copyTemplateFiles(config.templatePath, config.projectPath, config.projectName);
    } catch (error) {
      throw new TemplateError('템플릿 파일 복사 중 오류가 발생했습니다.', error as Error);
    }
  }

  /**
   * 설정을 추가합니다.
   * @param config 프로젝트 설정
   */
  private async addConfigurations(config: ProjectConfig): Promise<void> {
    const configManager = new ConfigManager(config);
    await configManager.addAllConfigs();
  }

  /**
   * 성공 메시지를 출력합니다.
   * @param projectName 프로젝트 이름
   */
  private showSuccessMessage(projectName: string): void {
    logger.success('\n🎉 프로젝트 생성이 완료되었습니다!');
    logger.info('\n📋 다음 단계를 따라하세요:');
    logger.info(`   1. cd ${projectName}`);
    logger.info('   2. npm install');
    logger.info('   3. npm run dev');
    logger.info('\n🛠️  유용한 명령어:');
    logger.info('   npm run build    # 프로덕션 빌드');
    logger.info('   npm run lint     # 코드 검사');
    logger.info('   npm run preview  # 빌드 미리보기');
  }

  /**
   * 에러를 처리합니다.
   * @param error 발생한 에러
   */
  private handleError(error: unknown): never {
    if (error instanceof ProjectCreationError || error instanceof TemplateError) {
      logger.error('프로젝트 생성 중 오류가 발생했습니다:', error);
    } else {
      logger.error('예상치 못한 오류가 발생했습니다:', error);
    }
    process.exit(1);
  }
}
