import pino from 'pino';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type Logger = {
  trace: (message: string | object, ...args: unknown[]) => void;
  debug: (message: string | object, ...args: unknown[]) => void;
  info: (message: string | object, ...args: unknown[]) => void;
  warn: (message: string | object, ...args: unknown[]) => void;
  error: (message: string | object | Error, ...args: unknown[]) => void;
  fatal: (message: string | object | Error, ...args: unknown[]) => void;
};

/**
 * ロガー
 */
export const logger = (options?: { level?: LogLevel; context?: string }): Logger => {
  const isCI = process.env.CI === 'true';
  const level = options?.level || (process.env.LOG_LEVEL as LogLevel) || 'info';
  const context = options?.context || 'cli';

  return pino({
    level,
    name: context,
    ...(!isCI && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname'
        }
      }
    })
  }) as Logger;
};
