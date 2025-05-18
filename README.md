# React Kit CLI

React Kit CLI는 React 프로젝트를 빠르게 설정하고 시작하도록 도와주는 CLI 도구입니다.  

TypeScript, ESLint, Prettier, Tailwind CSS, Vitest 등의 개발 도구들을 자동으로 설정해주어 개발 환경 구축 시간을 단축시키는데 목표를 두었습니다.

## 🛠️ 해결하고자 하는 문제

React 프로젝트를 시작할 때마다 반복되는 설정 작업들:
- TypeScript 설정
- ESLint와 Prettier 설정
- Tailwind CSS 설정
- 테스트 환경 구축
- 빌드 도구 설정

이러한 반복적인 설정 작업을 자동화하여 일종의 보일러플레이트를 제공하고자 했습니다.

## ✨ 주요 기능

- **기본 React + TypeScript 프로젝트 생성**
  - Vite 기반의 빠른 개발 환경
  - TypeScript 설정 완료
  - ESLint와 Prettier 설정 완료

- **Tailwind CSS 통합**
  - `--with-tailwind` 옵션으로 Tailwind CSS 설정 추가
  - PostCSS 설정 자동화
  - 기본 스타일 설정

- **테스트 환경 구축**
  - `--with-vitest` 옵션으로 Vitest 설정 추가
  - React Testing Library 설정
  - 테스트 스크립트 자동 추가

## ⚡ 시작하기

### 설치

```bash
npm install -g react-kit-cli
```

### 사용법

기본 프로젝트 생성:
```bash
react-kit init my-project
```

Tailwind CSS 포함:
```bash
react-kit init my-project --with-tailwind
```

Vitest 포함:
```bash
react-kit init my-project --with-vitest
```

모든 기능 포함:
```bash
react-kit init my-project --with-tailwind --with-vitest
```

### 린트 및 포맷팅
```bash
# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 코드 포맷팅
npm run format
```

## 📁 프로젝트 구조

```
react-kit-cli/
├── bin/              # CLI 실행 파일
├── src/              # 소스 코드
│   ├── config/       # 설정 파일
│   ├── types/        # 타입 정의
│   └── utils/        # 유틸리티 함수
├── templates/        # 프로젝트 템플릿
└── dist/            # 빌드 결과물
```

## 📚 라이브러리 레퍼런스

### Commander
- [공식 문서](https://github.com/tj/commander.js/)
- CLI 인터페이스 구현에 사용했습니다. 

### Vite
- [공식 문서](https://vitejs.dev/)
- 개발 서버 빌드 부분에서 사용했습니다. 

### Tailwind CSS
- [공식 문서](https://tailwindcss.com/)
- [설정 가이드](https://tailwindcss.com/docs/configuration)
- 설정 파일 생성 및 의존성 추가 부분에서 사용했습니다.

### Vitest
- [공식 문서](https://vitest.dev/)
- 테스트 환경설정 부분에서 사용했습니다. 

### TypeScript
- [공식 문서](https://www.typescriptlang.org/)
- [핸드북](https://www.typescriptlang.org/docs/handbook/intro.html)
- 타입 정의 및 컴파일 시에 사용했습니다. 

### ESLint & Prettier
- [ESLint 공식 문서](https://eslint.org/)
- [Prettier 공식 문서](https://prettier.io/)
- 코드 품질 관리 및 환경 설정 부분에서 사용했습니다.

### fs-extra
- [공식 문서](https://github.com/jprichardson/node-fs-extra)
- 파일 복사 및 디렉토리 생성등의 작업에 사용했습니다. 

### chalk
- [공식 문서](https://github.com/chalk/chalk)
- [색상 목록](https://github.com/chalk/chalk#colors)
- 콘솔 출력시 색상 정의 부분에서 사용했습니다. 
