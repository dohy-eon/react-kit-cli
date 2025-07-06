import chalk from 'chalk';

export const logger = {
  info: (message: string) => console.log(chalk.blue('ℹ️  ' + message)),
  success: (message: string) => console.log(chalk.green('✅ ' + message)),
  error: (message: string, error?: unknown) => {
    console.error(chalk.red('❌ ' + message));
    if (error instanceof Error) {
      console.error(chalk.red(`   ${error.message}`));
    } else if (error) {
      console.error(chalk.red(`   ${String(error)}`));
    }
  },
  warning: (message: string) => console.log(chalk.yellow('⚠️  ' + message)),
  progress: (message: string) => console.log(chalk.cyan('🔄 ' + message)),
  debug: (message: string) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray(`[DEBUG] ${message}`));
    }
  },
};
