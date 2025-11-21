import path from 'path';
import fs from 'fs-extra';
import { PackageJson } from '../types';

export async function createProjectDirectory(projectPath: string): Promise<void> {
  if (fs.existsSync(projectPath)) {
    throw new Error(`'${path.basename(projectPath)}' 폴더가 이미 존재합니다.`);
  }
  await fs.mkdir(projectPath);
}

export async function processTemplateContent(
  content: string,
  projectName: string
): Promise<string> {
  return content.replace(/\{\{projectName\}\}/g, projectName);
}

export async function copyTemplateFiles(
  templatePath: string,
  projectPath: string,
  projectName: string
): Promise<void> {
  // package.json 처리
  const packageJsonContent = await fs.readFile(path.join(templatePath, 'package.json'), 'utf-8');
  const processedPackageJson = await processTemplateContent(packageJsonContent, projectName);
  await fs.writeFile(path.join(projectPath, 'package.json'), processedPackageJson);

  // _gitignore를 .gitignore로 변환하여 복사
  const gitignorePath = path.join(templatePath, '_gitignore');
  if (await fs.pathExists(gitignorePath)) {
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);
  }

  // 나머지 파일 복사 (_gitignore 제외)
  await fs.copy(templatePath, projectPath, {
    filter: src => !src.endsWith('package.json') && !src.endsWith('_gitignore'),
  });
}

export async function updatePackageJson(
  projectPath: string,
  updateFn: (pkg: PackageJson) => PackageJson
): Promise<void> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  const updatedPackageJson = updateFn(packageJson);
  await fs.writeJson(packageJsonPath, updatedPackageJson, { spaces: 2 });
}

export async function writeConfigFile(
  projectPath: string,
  filePath: string,
  content: string
): Promise<void> {
  const fullPath = path.join(projectPath, filePath);
  await fs.ensureDir(path.dirname(fullPath));
  await fs.writeFile(fullPath, content);
}

/**
 * 기존 파일을 읽어서 내용을 병합합니다.
 * @param projectPath 프로젝트 경로
 * @param filePath 파일 경로 (프로젝트 루트 기준)
 * @param mergeFn 기존 내용을 받아서 병합된 내용을 반환하는 함수
 */
export async function mergeConfigFile(
  projectPath: string,
  filePath: string,
  mergeFn: (existingContent: string) => string
): Promise<void> {
  const fullPath = path.join(projectPath, filePath);
  let existingContent = '';

  if (await fs.pathExists(fullPath)) {
    existingContent = await fs.readFile(fullPath, 'utf-8');
  }

  const mergedContent = mergeFn(existingContent);
  await fs.ensureDir(path.dirname(fullPath));
  await fs.writeFile(fullPath, mergedContent);
}
