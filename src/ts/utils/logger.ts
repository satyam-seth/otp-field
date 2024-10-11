import { LogLevel } from './types';

export default class Logger {
  // eslint-disable-next-line no-use-before-define
  private static _instance?: Logger;

  private logLevels: Array<LogLevel> = ['log', 'info', 'warn', 'error'];

  private logLevel: LogLevel = 'log';

  // eslint-disable-next-line no-useless-constructor, no-empty-function
  private constructor() { }

  setLevel(logLevel: LogLevel) {
    // Set the log level
    this.logLevel = logLevel;
  }

  static get instance() {
    // eslint-disable-next-line no-underscore-dangle
    if (Logger._instance === undefined) {
      // eslint-disable-next-line no-underscore-dangle
      Logger._instance = new Logger();
    }
    // eslint-disable-next-line no-underscore-dangle
    return Logger._instance;
  }

  // Helper method to get the current timestamp
  // eslint-disable-next-line class-methods-use-this
  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  // Method to check if a message should be logged based on log level
  private shouldLog(level: LogLevel): boolean {
    const currentLevelIndex = this.logLevels.indexOf(this.logLevel);
    const messageLevelIndex = this.logLevels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  // Main log method that accepts multiple arguments
  public log(...args: unknown[]): void {
    if (this.shouldLog('log')) {
      // eslint-disable-next-line no-console
      console.log(
        '%cLOG:',
        'color: white; background-color: #405d27',
        `[${this.getTimestamp()}]`,
        ...args
      );
    }
  }

  // Method to log errors
  public error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      // eslint-disable-next-line no-console
      console.error(
        '%cERROR:',
        'color: white; background-color: #c94c4c',
        `[${this.getTimestamp()}]`,
        ...args
      );
    }
  }

  // Method to log warnings
  public warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      // eslint-disable-next-line no-console
      console.warn(
        '%cWARNING:',
        'color: black; background-color: #feb236',
        `[${this.getTimestamp()}]`,
        ...args
      );
    }
  }

  // Method to log info
  public info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.info(
        '%cINFO:',
        'color: white; background-color: #4040a1',
        `[${this.getTimestamp()}]`,
        ...args
      );
    }
  }
}
