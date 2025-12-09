import { beforeEach, describe, expect, it, vi } from 'vitest';

import { logger } from './logger';

describe('logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.LOG_LEVEL;
    delete process.env.CI;
  });

  it('デフォルトのロガーを作成できること', () => {
    expect(logger()).toBeDefined();
    expect(logger().info).toBeInstanceOf(Function);
    expect(logger().error).toBeInstanceOf(Function);
  });

  it('コンテキスト付きのロガーを作成できること', () => {
    expect(logger({ context: 'test' })).toBeDefined();
  });

  it('ログレベルを指定できること', () => {
    expect(logger({ level: 'debug' })).toBeDefined();
  });

  it('環境変数からログレベルを取得できること', () => {
    process.env.LOG_LEVEL = 'debug';
    expect(logger()).toBeDefined();
  });
});
