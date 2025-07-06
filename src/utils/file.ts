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
  const packageJsonContent = await fs.readFile(
    path.join(templatePath, 'package.json'), 
    'utf-8'
  );
  const processedPackageJson = await processTemplateContent(
    packageJsonContent, 
    projectName
  );
  await fs.writeFile(
    path.join(projectPath, 'package.json'), 
    processedPackageJson
  );

  // 나머지 파일 복사
  await fs.copy(templatePath, projectPath, {
    filter: src => !src.endsWith('package.json'),
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
