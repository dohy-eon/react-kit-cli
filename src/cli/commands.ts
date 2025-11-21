import { Command } from 'commander';
import { ProjectOptions } from '../types';
import { ProjectGenerator } from '../utils/project-generator';

export class Commands {
  private program: Command;
  private projectGenerator: ProjectGenerator;

  constructor() {
    this.program = new Command();
    this.projectGenerator = new ProjectGenerator();
    this.setupCommands();
  }

  /**
   * CLI 명령어들을 설정합니다.
   */
  private setupCommands(): void {
    this.program.name('react-kit').description('리액트 프로젝트 세팅 도구').version('1.2.0');

    this.program
      .command('create')
      .description('새로운 React 프로젝트 생성')
      .argument('<projectName>', '프로젝트 이름')
      .option('--with-tailwind', 'Tailwind CSS 포함')
      .option('--with-vitest', 'Vitest 포함')
      .option('--with-redux', 'Redux 포함')
      .option('--with-recoil', 'Recoil 포함')
      .option('--with-zustand', 'Zustand 포함')
      .action(this.handleCreateCommand.bind(this));
  }

  /**
   * create 명령어를 처리합니다.
   * @param projectName 프로젝트 이름
   * @param options 프로젝트 옵션
   */
  private async handleCreateCommand(projectName: string, options: ProjectOptions): Promise<void> {
    await this.projectGenerator.createProject({
      projectName,
      options,
    });
  }

  /**
   * CLI를 실행합니다.
   */
  parse(): void {
    this.program.parse();
  }
}
