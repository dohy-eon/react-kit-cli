#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 색상 출력을 위한 chalk (선택사항)
const chalk = require('chalk');

class ReleaseManager {
  constructor() {
    this.packageJsonPath = path.join(__dirname, '..', 'package.json');
    this.packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
  }

  /**
   * 현재 git 상태를 확인합니다.
   */
  checkGitStatus() {
    console.log(chalk.blue('🔍 Git 상태 확인 중...'));

    try {
      // 변경사항이 있는지 확인
      const status = execSync('git status --porcelain', { encoding: 'utf8' });

      if (status.trim()) {
        console.log(chalk.yellow('⚠️  커밋되지 않은 변경사항이 있습니다:'));
        console.log(status);
        throw new Error('모든 변경사항을 커밋한 후 릴리즈를 진행하세요.');
      }

      // 최신 상태인지 확인
      execSync('git fetch origin', { stdio: 'pipe' });
      const localCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      const remoteCommit = execSync('git rev-parse origin/main', { encoding: 'utf8' }).trim();

      if (localCommit !== remoteCommit) {
        throw new Error(
          '로컬 브랜치가 원격 브랜치와 동기화되지 않았습니다. git pull을 실행하세요.'
        );
      }

      console.log(chalk.green('✅ Git 상태 확인 완료'));
    } catch (error) {
      console.error(chalk.red('❌ Git 상태 확인 실패:'), error.message);
      process.exit(1);
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
    } catch (error) {
      console.error(chalk.red('❌ 테스트 실패'));
      process.exit(1);
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
    } catch (error) {
      console.error(chalk.red('❌ 린트 실패'));
      process.exit(1);
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
    } catch (error) {
      console.error(chalk.red('❌ 포맷팅 실패'));
      process.exit(1);
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
    } catch (error) {
      console.error(chalk.red('❌ 빌드 실패'));
      process.exit(1);
    }
  }

  /**
   * 버전을 업데이트합니다.
   */
  updateVersion(versionType) {
    console.log(chalk.blue(`📦 ${versionType} 버전 업데이트 중...`));

    try {
      execSync(`npm version ${versionType} --no-git-tag-version`, { stdio: 'inherit' });

      // 업데이트된 package.json 읽기
      const updatedPackageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
      const newVersion = updatedPackageJson.version;

      console.log(chalk.green(`✅ 버전이 ${newVersion}로 업데이트되었습니다`));
      return newVersion;
    } catch (error) {
      console.error(chalk.red('❌ 버전 업데이트 실패'));
      process.exit(1);
    }
  }

  /**
   * 변경사항을 커밋합니다.
   */
  commitChanges(version) {
    console.log(chalk.blue('💾 변경사항 커밋 중...'));

    try {
      execSync('git add .', { stdio: 'inherit' });
      execSync(`git commit -m "chore: release v${version}"`, { stdio: 'inherit' });
      console.log(chalk.green('✅ 변경사항 커밋 완료'));
    } catch (error) {
      console.error(chalk.red('❌ 커밋 실패'));
      process.exit(1);
    }
  }

  /**
   * 태그를 생성합니다.
   */
  createTag(version) {
    console.log(chalk.blue('🏷️  태그 생성 중...'));

    try {
      execSync(`git tag v${version}`, { stdio: 'inherit' });
      console.log(chalk.green(`✅ 태그 v${version} 생성 완료`));
    } catch (error) {
      console.error(chalk.red('❌ 태그 생성 실패'));
      process.exit(1);
    }
  }

  /**
   * 원격 저장소에 푸시합니다.
   */
  pushToRemote() {
    console.log(chalk.blue('🚀 원격 저장소에 푸시 중...'));

    try {
      execSync('git push origin main', { stdio: 'inherit' });
      execSync('git push origin --tags', { stdio: 'inherit' });
      console.log(chalk.green('✅ 원격 저장소 푸시 완료'));
    } catch (error) {
      console.error(chalk.red('❌ 푸시 실패'));
      process.exit(1);
    }
  }

  /**
   * npm에 배포합니다.
   */
  publishToNpm() {
    console.log(chalk.blue('📦 npm에 배포 중...'));

    try {
      execSync('npm publish', { stdio: 'inherit' });
      console.log(chalk.green('✅ npm 배포 완료'));
    } catch (error) {
      console.error(chalk.red('❌ npm 배포 실패'));
      process.exit(1);
    }
  }

  /**
   * 전체 릴리즈 프로세스를 실행합니다.
   */
  async release(versionType) {
    console.log(chalk.cyan('🚀 릴리즈 프로세스를 시작합니다...\n'));

    try {
      // 1. 사전 검사
      this.checkGitStatus();
      this.runTests();
      this.runLint();
      this.checkFormatting();
      this.runBuild();

      // 2. 버전 업데이트
      const newVersion = this.updateVersion(versionType);

      // 3. 변경사항 커밋 및 태그 생성
      this.commitChanges(newVersion);
      this.createTag(newVersion);

      // 4. 원격 저장소에 푸시
      this.pushToRemote();

      // 5. npm 배포
      this.publishToNpm();

      console.log(chalk.green('\n🎉 릴리즈가 성공적으로 완료되었습니다!'));
      console.log(chalk.cyan(`📦 버전: v${newVersion}`));
      console.log(chalk.cyan('🔗 npm: https://www.npmjs.com/package/react-kit-cli'));
    } catch (error) {
      console.error(chalk.red('\n❌ 릴리즈 프로세스가 실패했습니다:'), error.message);
      process.exit(1);
    }
  }
}

// CLI 인자 처리
const args = process.argv.slice(2);
const versionType = args[0];

if (!versionType || !['patch', 'minor', 'major'].includes(versionType)) {
  console.log(chalk.yellow('사용법: node scripts/release.js <version-type>'));
  console.log(chalk.yellow('version-type: patch, minor, major'));
  console.log(chalk.cyan('\n예시:'));
  console.log(chalk.cyan('  node scripts/release.js patch  # 1.2.0 → 1.2.1'));
  console.log(chalk.cyan('  node scripts/release.js minor  # 1.2.0 → 1.3.0'));
  console.log(chalk.cyan('  node scripts/release.js major  # 1.2.0 → 2.0.0'));
  process.exit(1);
}

// 릴리즈 실행
const releaseManager = new ReleaseManager();
releaseManager.release(versionType);
