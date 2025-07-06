module.exports = {
  preset: 'ts-jest',

  // Node.js 환경에서 테스트 실행
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],

  // 테스트 파일 패턴
  // 1. __tests__ 폴더 안의 모든 .ts 파일
  // 2. .spec.ts 또는 .test.ts로 끝나는 파일
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],

  // TypeScript 파일을 JavaScript로 변환하는 설정
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // 코드 커버리지를 수집할 파일
  // src 폴더의 모든 .ts 파일 (타입 정의 파일과 테스트 파일 제외)
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/__tests__/**'],

  // 코드 커버리지 최소 기준 (80% 이상)
  coverageThreshold: {
    global: {
      branches: 80, // 조건문 분기
      functions: 80, // 함수 실행
      lines: 80, // 코드 라인
      statements: 80, // 구문 실행
    },
  },
};
