export interface ProjectOptions {
  withTailwind?: boolean;
  withVitest?: boolean;
  withRedux?: boolean;
  withRecoil?: boolean;
}

export interface PackageJson {
  name: string;
  version: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface ConfigFile {
  path: string;
  content: string;
}

// 에러 타입
export class ProjectCreationError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ProjectCreationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class TemplateError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'TemplateError';
  }
}

// CLI 관련 타입
export interface CreateProjectParams {
  projectName: string;
  options: ProjectOptions;
}

export interface ProjectConfig {
  projectPath: string;
  templatePath: string;
  projectName: string;
  options: ProjectOptions;
}

// 설정 관련 타입
export interface ConfigModule {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  files?: Array<{
    path: string;
    content: string;
  }>;
}
