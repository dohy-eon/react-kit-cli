import chalk from 'chalk';

export const logger = {
  info: (message: string) => console.log(chalk.blue(message)),
  success: (message: string) => console.log(chalk.green(message)),
  error: (message: string, error?: unknown) => {
    console.error(chalk.red(message));
    if (error) {
      console.error(error);
    }
  },
  warning: (message: string) => console.log(chalk.yellow(message)),
  debug: (message: string) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray(`[DEBUG] ${message}`));
    }
  },
};
