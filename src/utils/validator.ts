import { ProjectOptions, ValidationError } from '../types';
import { logger } from './logger';

export class ProjectValidator {
  private static readonly PROJECT_NAME_REGEX = /^[a-z0-9-]+$/;
  private static readonly MIN_PROJECT_NAME_LENGTH = 1;
  private static readonly MAX_PROJECT_NAME_LENGTH = 50;

  /**
   * 프로젝트 이름을 검증합니다.
   * @param projectName 검증할 프로젝트 이름
   * @throws ValidationError 프로젝트 이름이 유효하지 않은 경우
   */
  static validateProjectName(projectName: string): void {
    if (!projectName) {
      throw new ValidationError('프로젝트 이름을 입력해주세요.');
    }

    if (!this.PROJECT_NAME_REGEX.test(projectName)) {
      throw new ValidationError('프로젝트 이름은 소문자, 숫자, 하이픈만 사용할 수 있습니다.');
    }

    if (
      projectName.length < this.MIN_PROJECT_NAME_LENGTH ||
      projectName.length > this.MAX_PROJECT_NAME_LENGTH
    ) {
      throw new ValidationError(
        `프로젝트 이름은 ${this.MIN_PROJECT_NAME_LENGTH}-${this.MAX_PROJECT_NAME_LENGTH}자 사이여야 합니다.`
      );
    }
  }

  /**
   * 프로젝트 옵션을 검증합니다.
   * @param options 검증할 프로젝트 옵션
   */
  static validateOptions(options: ProjectOptions): void {
    const stateLibs = [options.withRedux, options.withRecoil, options.withZustand].filter(Boolean);

    if (stateLibs.length > 1) {
      logger.warning(
        '두 개 이상의 상태 관리 라이브러리가 선택되었습니다 (Redux, Recoil, Zustand).'
      );
      logger.info('하나의 라이브러리만 선택하는 것을 권장합니다.');
    }
  }

  /**
   * 프로젝트 생성 파라미터를 검증합니다.
   * @param params 검증할 프로젝트 생성 파라미터
   */
  static validateCreateProjectParams(params: {
    projectName: string;
    options: ProjectOptions;
  }): void {
    this.validateProjectName(params.projectName);
    this.validateOptions(params.options);
  }
}
