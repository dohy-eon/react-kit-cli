import { ConfigFile } from '../types';

// vite.config.ts에 병합할 test 설정 내용
export const vitestTestConfig = `  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },`;

// vite.config.ts 파일에 test 설정을 추가하는 헬퍼 함수
export function mergeVitestConfigToViteConfig(existingContent: string): string {
  // 이미 test 설정이 있는지 확인
  if (existingContent.includes('test:')) {
    return existingContent; // 이미 있으면 그대로 반환
  }

  let content = existingContent;

  // /// <reference types="vitest" /> 주석 추가 (없는 경우)
  if (!content.includes('/// <reference types="vitest" />')) {
    // 첫 번째 import 문 앞에 추가
    const firstImportIndex = content.indexOf('import');
    if (firstImportIndex !== -1) {
      content =
        content.substring(0, firstImportIndex) +
        '/// <reference types="vitest" />\n' +
        content.substring(firstImportIndex);
    } else {
      // import가 없으면 맨 앞에 추가
      content = `/// <reference types="vitest" />\n${content}`;
    }
  }

  // defineConfig({ ... }) 패턴을 찾아서 test를 추가
  // plugins 다음에 test를 추가하는 것이 가장 안전
  const pluginsPattern = /(plugins:\s*\[[^\]]*\],?)/;
  const pluginsMatch = content.match(pluginsPattern);
  
  if (pluginsMatch) {
    // plugins 다음에 test 추가
    const insertIndex = pluginsMatch.index! + pluginsMatch[0].length;
    // 다음 줄로 넘어가기 전에 줄바꿈 확인
    const afterPlugins = content.substring(insertIndex);
    const needsNewline = !afterPlugins.match(/^\s*\n/);
    const newline = needsNewline ? '\n' : '';
    
    content =
      content.substring(0, insertIndex) +
      newline +
      vitestTestConfig +
      content.substring(insertIndex);
  } else {
    // plugins를 찾을 수 없으면 defineConfig({ 바로 다음에 추가 시도
    const defineConfigPattern = /defineConfig\(\s*\{/;
    const defineConfigMatch = content.match(defineConfigPattern);
    if (defineConfigMatch) {
      const insertIndex = defineConfigMatch.index! + defineConfigMatch[0].length;
      content =
        content.substring(0, insertIndex) +
        '\n' +
        vitestTestConfig +
        content.substring(insertIndex);
    } else {
      // defineConfig를 찾을 수 없으면 파일 끝에 추가 (fallback)
      content = content + '\n\nexport default defineConfig({\n' + vitestTestConfig + '\n});';
    }
  }

  return content;
}

export const vitestDependencies = {
  vitest: '^1.2.2',
  '@testing-library/react': '^14.2.1',
  '@testing-library/jest-dom': '^6.4.2',
  jsdom: '^24.0.0',
};

export const vitestScripts = {
  test: 'vitest',
  'test:ui': 'vitest --ui',
  coverage: 'vitest run --coverage',
};

export const testSetupContent = `import '@testing-library/jest-dom';`;
