// TCR - Test && Commit || Revert
// Auto-detecting project type and running tests

export interface TcrOptions {
  projectPath: string;
}

export function runTcr(options: TcrOptions): Promise<string> {
  return Promise.resolve(`TCR would run in ${options.projectPath}`);
}
