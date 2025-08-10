#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class RollbackManager {
  constructor() {
    this.packageJsonPath = path.join(__dirname, '..', 'package.json');
  }

  /**
   * 최근 태그를 가져옵니다.
   */
  getLatestTag() {
    try {
      const tags = execSync('git tag --sort=-version:refname', { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(tag => tag.startsWith('v'));

      return tags[0] || null;
    } catch (error) {
      console.error(chalk.red('❌ 태그 조회 실패'));
      return null;
    }
  }

  /**
   * 현재 브랜치의 최신 커밋을 가져옵니다.
   */
  getCurrentCommit() {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      console.error(chalk.red('❌ 현재 커밋 조회 실패'));
      return null;
    }
  }

  /**
   * 특정 태그의 커밋을 가져옵니다.
   */
  getTagCommit(tag) {
    try {
      return execSync(`git rev-parse ${tag}`, { encoding: 'utf8' }).trim();
    } catch (error) {
      console.error(chalk.red(`❌ 태그 ${tag}의 커밋 조회 실패`));
      return null;
    }
  }

  /**
   * Git 상태를 확인합니다.
   */
  checkGitStatus() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });

      if (status.trim()) {
        console.log(chalk.yellow('⚠️  커밋되지 않은 변경사항이 있습니다:'));
        console.log(status);
        console.log(chalk.yellow('   변경사항을 커밋하거나 stash한 후 롤백을 진행하세요.'));
        return false;
      }

      return true;
    } catch (error) {
      console.error(chalk.red('❌ Git 상태 확인 실패'));
      return false;
    }
  }

  /**
   * 특정 커밋으로 리셋합니다.
   */
  resetToCommit(commit) {
    try {
      console.log(chalk.blue(`🔄 커밋 ${commit.substring(0, 7)}로 리셋 중...`));
      execSync(`git reset --hard ${commit}`, { stdio: 'inherit' });
      console.log(chalk.green('✅ 리셋 완료'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ 리셋 실패'));
      return false;
    }
  }

  /**
   * 태그를 삭제합니다.
   */
  deleteTag(tag) {
    try {
      console.log(chalk.blue(`🗑️  태그 ${tag} 삭제 중...`));
      execSync(`git tag -d ${tag}`, { stdio: 'inherit' });
      console.log(chalk.green('✅ 로컬 태그 삭제 완료'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ 태그 삭제 실패'));
      return false;
    }
  }

  /**
   * 원격 태그를 삭제합니다.
   */
  deleteRemoteTag(tag) {
    try {
      console.log(chalk.blue(`🗑️  원격 태그 ${tag} 삭제 중...`));
      execSync(`git push origin :refs/tags/${tag}`, { stdio: 'inherit' });
      console.log(chalk.green('✅ 원격 태그 삭제 완료'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ 원격 태그 삭제 실패'));
      return false;
    }
  }

  /**
   * 원격 브랜치를 강제 푸시합니다.
   */
  forcePush() {
    try {
      console.log(chalk.blue('🚀 원격 브랜치 강제 푸시 중...'));
      execSync('git push origin main --force', { stdio: 'inherit' });
      console.log(chalk.green('✅ 강제 푸시 완료'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ 강제 푸시 실패'));
      return false;
    }
  }

  /**
   * 롤백을 실행합니다.
   */
  async rollback(targetTag = null) {
    console.log(chalk.cyan('🔄 롤백 프로세스를 시작합니다...\n'));

    // 1. Git 상태 확인
    if (!this.checkGitStatus()) {
      process.exit(1);
    }

    // 2. 롤백할 태그 결정
    let rollbackTag = targetTag;
    if (!rollbackTag) {
      rollbackTag = this.getLatestTag();
      if (!rollbackTag) {
        console.log(chalk.red('❌ 롤백할 태그를 찾을 수 없습니다.'));
        process.exit(1);
      }
    }

    console.log(chalk.cyan(`📦 롤백 대상: ${rollbackTag}`));

    // 3. 태그의 커밋 가져오기
    const tagCommit = this.getTagCommit(rollbackTag);
    if (!tagCommit) {
      process.exit(1);
    }

    // 4. 현재 커밋과 비교
    const currentCommit = this.getCurrentCommit();
    if (currentCommit === tagCommit) {
      console.log(chalk.yellow('⚠️  이미 해당 태그 상태입니다.'));
      return;
    }

    // 5. 롤백 실행
    console.log(chalk.blue(`\n🔄 ${rollbackTag}로 롤백 중...`));

    if (!this.resetToCommit(tagCommit)) {
      process.exit(1);
    }

    // 6. 최신 태그가 롤백 대상과 다른 경우 삭제
    const latestTag = this.getLatestTag();
    if (latestTag && latestTag !== rollbackTag) {
      console.log(chalk.blue(`\n🗑️  최신 태그 ${latestTag} 삭제 중...`));

      if (!this.deleteTag(latestTag)) {
        console.log(chalk.yellow('⚠️  로컬 태그 삭제 실패 (수동으로 삭제하세요)'));
      }

      if (!this.deleteRemoteTag(latestTag)) {
        console.log(chalk.yellow('⚠️  원격 태그 삭제 실패 (수동으로 삭제하세요)'));
      }
    }

    // 7. 강제 푸시
    console.log(chalk.blue('\n🚀 변경사항을 원격 저장소에 푸시 중...'));
    if (!this.forcePush()) {
      console.log(chalk.yellow('⚠️  강제 푸시 실패 (수동으로 푸시하세요)'));
    }

    console.log(chalk.green('\n🎉 롤백이 완료되었습니다!'));
    console.log(chalk.cyan(`📦 현재 버전: ${rollbackTag}`));
    console.log(chalk.cyan('💡 npm에서 패키지를 언배포하려면 npm unpublish를 사용하세요.'));
  }

  /**
   * 사용 가능한 태그 목록을 표시합니다.
   */
  showAvailableTags() {
    try {
      const tags = execSync('git tag --sort=-version:refname', { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(tag => tag.startsWith('v'));

      if (tags.length === 0) {
        console.log(chalk.yellow('사용 가능한 태그가 없습니다.'));
        return;
      }

      console.log(chalk.cyan('사용 가능한 태그:'));
      tags.forEach((tag, index) => {
        const commit = this.getTagCommit(tag);
        const shortCommit = commit ? commit.substring(0, 7) : 'N/A';
        console.log(`  ${index + 1}. ${tag} (${shortCommit})`);
      });
    } catch (error) {
      console.error(chalk.red('❌ 태그 목록 조회 실패'));
    }
  }
}

// CLI 인자 처리
const args = process.argv.slice(2);
const targetTag = args[0];

if (args.includes('--list') || args.includes('-l')) {
  const rollbackManager = new RollbackManager();
  rollbackManager.showAvailableTags();
  process.exit(0);
}

if (targetTag && !targetTag.startsWith('v')) {
  console.log(chalk.yellow('사용법: node scripts/rollback.js [tag]'));
  console.log(chalk.yellow('tag: v1.2.0 형식의 태그 (선택사항)'));
  console.log(chalk.yellow('옵션:'));
  console.log(chalk.yellow('  --list, -l    사용 가능한 태그 목록 표시'));
  process.exit(1);
}

// 롤백 실행
const rollbackManager = new RollbackManager();
rollbackManager.rollback(targetTag);
