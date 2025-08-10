#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class PreReleaseChecker {
  constructor() {
    this.packageJsonPath = path.join(__dirname, '..', 'package.json');
    this.packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
  }

  /**
   * Git 상태를 확인합니다.
   */
  checkGitStatus() {
    console.log(chalk.blue('🔍 Git 상태 확인 중...'));

    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });

      if (status.trim()) {
        console.log(chalk.yellow('⚠️  커밋되지 않은 변경사항:'));
        console.log(status);
        return false;
      }

      console.log(chalk.green('✅ Git 상태 깨끗함'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ Git 상태 확인 실패'));
      return false;
    }
  }

  /**
   * 브랜치를 확인합니다.
   */
  checkBranch() {
    console.log(chalk.blue('🌿 브랜치 확인 중...'));

    try {
      const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();

      if (currentBranch !== 'main') {
        console.log(chalk.yellow(`⚠️  현재 브랜치: ${currentBranch}`));
        console.log(chalk.yellow('   main 브랜치에서 릴리즈하는 것을 권장합니다.'));
        return false;
      }

      console.log(chalk.green('✅ main 브랜치에서 작업 중'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ 브랜치 확인 실패'));
      return false;
    }
  }

  /**
   * 원격 저장소와 동기화 상태를 확인합니다.
   */
  checkRemoteSync() {
    console.log(chalk.blue('🔄 원격 저장소 동기화 확인 중...'));

    try {
      execSync('git fetch origin', { stdio: 'pipe' });
      const localCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      const remoteCommit = execSync('git rev-parse origin/main', { encoding: 'utf8' }).trim();

      if (localCommit !== remoteCommit) {
        console.log(chalk.yellow('⚠️  로컬과 원격이 동기화되지 않음'));
        console.log(chalk.yellow('   git pull을 실행하여 동기화하세요.'));
        return false;
      }

      console.log(chalk.green('✅ 원격 저장소와 동기화됨'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ 원격 저장소 확인 실패'));
      return false;
    }
  }

  /**
   * 테스트를 실행합니다.
   */
  runTests() {
    console.log(chalk.blue('🧪 테스트 실행 중...'));

    try {
      execSync('npm test', { stdio: 'inherit' });
      console.log(chalk.green('✅ 테스트 통과'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ 테스트 실패'));
      return false;
    }
  }

  /**
   * 린트를 실행합니다.
   */
  runLint() {
    console.log(chalk.blue('🔍 린트 검사 중...'));

    try {
      execSync('npm run lint', { stdio: 'inherit' });
      console.log(chalk.green('✅ 린트 통과'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ 린트 실패'));
      return false;
    }
  }

  /**
   * 포맷팅을 확인합니다.
   */
  checkFormatting() {
    console.log(chalk.blue('🎨 포맷팅 확인 중...'));

    try {
      execSync('npm run format:check', { stdio: 'inherit' });
      console.log(chalk.green('✅ 포맷팅 확인 완료'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ 포맷팅 실패'));
      return false;
    }
  }

  /**
   * 빌드를 실행합니다.
   */
  runBuild() {
    console.log(chalk.blue('🏗️  빌드 중...'));

    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log(chalk.green('✅ 빌드 완료'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ 빌드 실패'));
      return false;
    }
  }

  /**
   * 현재 버전을 표시합니다.
   */
  showCurrentVersion() {
    console.log(chalk.cyan(`📦 현재 버전: ${this.packageJson.version}`));
  }

  /**
   * 다음 버전을 계산합니다.
   */
  calculateNextVersion(versionType) {
    const [major, minor, patch] = this.packageJson.version.split('.').map(Number);

    let nextVersion;
    switch (versionType) {
      case 'patch':
        nextVersion = `${major}.${minor}.${patch + 1}`;
        break;
      case 'minor':
        nextVersion = `${major}.${minor + 1}.0`;
        break;
      case 'major':
        nextVersion = `${major + 1}.0.0`;
        break;
      default:
        return null;
    }

    return nextVersion;
  }

  /**
   * 전체 사전 검사를 실행합니다.
   */
  async check(versionType) {
    console.log(chalk.cyan('🔍 릴리즈 사전 검사를 시작합니다...\n'));

    this.showCurrentVersion();

    if (versionType) {
      const nextVersion = this.calculateNextVersion(versionType);
      if (nextVersion) {
        console.log(chalk.cyan(`📈 다음 버전: ${nextVersion}`));
      }
    }

    console.log(''); // 빈 줄 추가

    const checks = [
      { name: 'Git 상태', fn: () => this.checkGitStatus() },
      { name: '브랜치', fn: () => this.checkBranch() },
      { name: '원격 동기화', fn: () => this.checkRemoteSync() },
      { name: '테스트', fn: () => this.runTests() },
      { name: '린트', fn: () => this.runLint() },
      { name: '포맷팅', fn: () => this.checkFormatting() },
      { name: '빌드', fn: () => this.runBuild() },
    ];

    const results = [];

    for (const check of checks) {
      console.log(chalk.blue(`\n${check.name} 확인 중...`));
      const result = check.fn();
      results.push({ name: check.name, passed: result });

      if (!result) {
        console.log(chalk.red(`❌ ${check.name} 실패`));
      } else {
        console.log(chalk.green(`✅ ${check.name} 통과`));
      }
    }

    // 결과 요약
    console.log(chalk.cyan('\n📊 검사 결과 요약:'));
    const passed = results.filter(r => r.passed).length;
    const total = results.length;

    results.forEach(result => {
      const status = result.passed ? chalk.green('✅') : chalk.red('❌');
      console.log(`  ${status} ${result.name}`);
    });

    console.log(chalk.cyan(`\n총 ${total}개 중 ${passed}개 통과`));

    if (passed === total) {
      console.log(chalk.green('\n🎉 모든 검사를 통과했습니다! 릴리즈를 진행할 수 있습니다.'));
      console.log(chalk.cyan('\n릴리즈 명령어:'));
      console.log(chalk.cyan(`  node scripts/release.js ${versionType || 'patch'}`));
    } else {
      console.log(chalk.red('\n❌ 일부 검사에 실패했습니다. 문제를 해결한 후 다시 시도하세요.'));
      process.exit(1);
    }
  }
}

// CLI 인자 처리
const args = process.argv.slice(2);
const versionType = args[0];

if (versionType && !['patch', 'minor', 'major'].includes(versionType)) {
  console.log(chalk.yellow('사용법: node scripts/pre-release.js [version-type]'));
  console.log(chalk.yellow('version-type: patch, minor, major (선택사항)'));
  process.exit(1);
}

// 사전 검사 실행
const checker = new PreReleaseChecker();
checker.check(versionType);
