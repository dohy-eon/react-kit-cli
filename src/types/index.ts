export interface ProjectOptions {
  withTailwind?: boolean;
  withVitest?: boolean;
  withRedux?: boolean;
  withRecoil?: boolean;
}

export interface PackageJson {
  name: string;
  version: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface ConfigFile {
  path: string;
  content: string;
} 