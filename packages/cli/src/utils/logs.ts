import chalk from 'chalk';

const isUnicodeSupported = () => {
  // 操作系统平台是否为 win32（Windows）
  if (process.platform !== 'win32') {
    // 判断 process.env.TERM 是否为 'linux'，
    // 这表示在 Linux 控制台（内核）环境中。
    return process.env.TERM !== 'linux'; // Linux console (kernel)
  }

  return (Boolean(process.env.CI) || // 是否在持续集成环境中
    Boolean(process.env.WT_SESSION) || // Windows 终端环境（Windows Terminal）中的会话标识
    Boolean(process.env.TERMINUS_SUBLIME) || // Terminus 插件标识
    process.env.ConEmuTask === '{cmd::Cmder}' || // ConEmu 和 cmder 终端中的任务标识
    process.env.TERM_PROGRAM === 'Terminus-Sublime' || process.env.TERM_PROGRAM === 'vscode' || // 终端程序的标识，可能是 'Terminus-Sublime' 或 'vscode'
    process.env.TERM === 'xterm-256color' || process.env.TERM === 'alacritty' || // 终端类型，可能是 'xterm-256color' 或 'alacritty'
    process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm' // 终端仿真器的标识，可能是 'JetBrains-JediTerm'
  );
};

const main = {
  info: chalk.blue('ℹ'),
  success: chalk.green('✔'),
  warning: chalk.yellow('⚠'),
  error: chalk.red('✖'),
  star: chalk.cyan('✵'),
  arrow: chalk.yellow('➦')
};

const fallback = {
  info: chalk.blue('i'),
  success: chalk.green('√'),
  warning: chalk.yellow('‼'),
  error: chalk.red('×'),
  star: chalk.cyan('*'),
  arrow: chalk.yellow('->')
};

export const logs = isUnicodeSupported() ? main : fallback;
