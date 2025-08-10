# React Kit CLI

React Kit CLI는 React 프로젝트를 빠르게 설정하고 시작하도록 도와주는 CLI 도구입니다.

TypeScript, ESLint, Prettier, Tailwind CSS, Vitest 등의 개발 도구들을 자동으로 설정해주어 개발 환경 구축 시간을 단축시키는데 목표를 두었습니다.

## 🏗️ 아키텍처

React Kit CLI는 클래스 기반의 모듈화된 아키텍처를 사용하여 유지보수성과 확장성을 보장합니다:

### 핵심 클래스들

- **`ProjectValidator`**: 프로젝트 이름과 옵션 검증
- **`ProjectGenerator`**: 프로젝트 생성 프로세스 관리
- **`ConfigManager`**: 다양한 설정(Tailwind, Vitest, Redux, Recoil) 추가
- **`Commands`**: CLI 명령어 처리

### 디렉토리 구조

```
src/
├── cli/           # CLI 관련 클래스들
├── config/        # 설정 파일들 (Tailwind, Vitest, Redux, Recoil)
├── types/         # TypeScript 타입 정의
└── utils/         # 유틸리티 클래스들과 함수들
```

### 에러 처리

- **`ProjectCreationError`**: 프로젝트 생성 중 발생하는 에러
- **`ValidationError`**: 검증 실패 시 발생하는 에러
- **`TemplateError`**: 템플릿 처리 중 발생하는 에러

## 🛠️ 해결하고자 하는 문제

React 프로젝트를 시작할 때마다 반복되는 설정 작업들:

- TypeScript 설정
- ESLint와 Prettier 설정
- Tailwind CSS 설정
- 테스트 환경 구축
- 빌드 도구 설정
- 상태관리 설정

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

- **상태관리 통합**

  - `--with-redux` 옵션으로 Redux 설정 추가
  - `--with-recoil` 옵션으로 Recoil 설정 추가
  - 기본 상태관리 템플릿 제공
  - TypeScript 타입 지원

- **자동화된 CI/CD**

  - GitHub Actions를 통한 자동 빌드 및 테스트
  - 린트, 포맷팅, 타입 체크 자동화
  - npm 배포 자동화 (태그 기반)

- **테스트 환경**
  - Jest를 통한 단위 테스트
  - 80% 이상의 코드 커버리지 요구
  - TypeScript 테스트 지원

## ⚡ 시작하기

### 설치

npm을 통한 전역 설치:

```bash
npm install -g react-kit-cli@latest
```

특정 버전 설치:

```bash
npm install -g react-kit-cli@1.1.0
```

설치 확인:

```bash
react-kit --version
```

### 사용법

기본 프로젝트 생성:

```bash
react-kit create my-project
```

Tailwind CSS 포함:

```bash
react-kit create my-project --with-tailwind
```

Vitest 포함:

```bash
react-kit create my-project --with-vitest
```

Redux 포함:

```bash
react-kit create my-project --with-redux
```

Recoil 포함:

```bash
react-kit create my-project --with-recoil
```

모든 기능 포함:

```bash
react-kit create my-project --with-tailwind --with-vitest --with-redux
```

### 프로젝트 이름 규칙

- 소문자, 숫자, 하이픈(-)만 사용 가능
- 1-50자 사이
- 예: `my-project`, `react-app-2024`, `todo-app`

### 린트 및 포맷팅

```bash
# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 코드 포맷팅
npm run format
```

## 🚀 릴리즈 및 배포

### 릴리즈 프로세스

React Kit CLI는 자동화된 릴리즈 프로세스를 제공합니다:

#### 1. 사전 검사 (Pre-release Check)

릴리즈 전 모든 검사를 수행합니다:

```bash
# 기본 사전 검사
npm run pre-release

# 특정 버전 타입으로 사전 검사
npm run pre-release patch
npm run pre-release minor
npm run pre-release major

# 원격 동기화 검사 건너뛰기
npm run pre-release patch -- --skip-remote-check
```

**검사 항목:**

- ✅ Git 상태 확인 (커밋되지 않은 변경사항)
- ✅ 브랜치 확인 (main 브랜치)
- ✅ 원격 저장소 동기화 확인
- ✅ 테스트 실행
- ✅ 린트 검사
- ✅ 포맷팅 확인
- ✅ 빌드 테스트

#### 2. 릴리즈 실행

모든 검사를 통과한 후 릴리즈를 실행합니다:

```bash
# 패치 버전 릴리즈 (1.2.0 → 1.2.1)
npm run release:patch

# 마이너 버전 릴리즈 (1.2.0 → 1.3.0)
npm run release:minor

# 메이저 버전 릴리즈 (1.2.0 → 2.0.0)
npm run release:major
```

**릴리즈 프로세스:**

1. 🔍 사전 검사 실행
2. 📦 버전 업데이트
3. 💾 변경사항 커밋
4. 🏷️ 태그 생성
5. 🚀 원격 저장소 푸시
6. 📦 npm 배포

#### 3. 롤백 (Rollback)

릴리즈 실패 시 이전 버전으로 롤백할 수 있습니다:

```bash
# 최신 태그로 롤백
npm run rollback

# 특정 태그로 롤백
npm run rollback v1.2.0

# 사용 가능한 태그 목록 확인
npm run rollback:list
```

**롤백 프로세스:**

1. 🔍 Git 상태 확인
2. 🔄 특정 커밋으로 리셋
3. 🗑️ 최신 태그 삭제 (필요시)
4. 🚀 강제 푸시

### 버전 관리

- **Patch (패치)**: 버그 수정 (1.2.0 → 1.2.1)
- **Minor (마이너)**: 새로운 기능 추가 (1.2.0 → 1.3.0)
- **Major (메이저)**: 호환성 깨지는 변경 (1.2.0 → 2.0.0)

### 안전 기능

- **자동 검사**: 릴리즈 전 모든 품질 검사 자동 실행
- **에러 처리**: 각 단계별 상세한 에러 메시지
- **롤백 지원**: 실패 시 안전한 롤백 기능
- **선택적 검사**: 원격 동기화 검사 건너뛰기 옵션

## 📁 프로젝트 구조

```
react-kit-cli/
├── .github/          # GitHub Actions 워크플로우
├── bin/              # CLI 실행 파일
├── src/              # 소스 코드
│   ├── cli/          # CLI 명령어 처리
│   ├── config/       # 설정 파일
│   ├── types/        # 타입 정의
│   └── utils/        # 유틸리티 클래스 및 함수
├── templates/        # 프로젝트 템플릿
│   ├── base/         # 기본 템플릿
│   ├── redux/        # Redux 템플릿
│   └── recoil/       # Recoil 템플릿
├── scripts/          # 빌드 및 릴리즈 스크립트
│   ├── release.js    # 릴리즈 자동화
│   ├── pre-release.js # 사전 검사
│   └── rollback.js   # 롤백 스크립트
├── dist/            # 빌드 결과물
└── __tests__/       # 테스트 파일
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

### Redux

- [공식 문서](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- 상태관리 설정 및 템플릿 생성에 사용했습니다.

### Recoil

- [공식 문서](https://recoiljs.org/)
- 상태관리 설정 및 템플릿 생성에 사용했습니다.

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

### Jest

- [공식 문서](https://jestjs.io/)
- [TypeScript 설정 가이드](https://jestjs.io/docs/getting-started#using-typescript)
- 단위 테스트 및 코드 커버리지 측정에 사용했습니다.

### GitHub Actions

- [공식 문서](https://docs.github.com/en/actions)
- [Node.js 워크플로우 가이드](https://docs.github.com/en/actions/guides/building-and-testing-nodejs)
- CI/CD 파이프라인 구축에 사용했습니다.
