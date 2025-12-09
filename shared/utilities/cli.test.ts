import { describe, expect, it } from 'vitest';

import { cli } from './cli';

describe('cli', () => {
  it('CLI インスタンスを作成できること', () => {
    const instance = cli('test', 'テスト用CLI');
    expect(instance).toBeDefined();
  });

  it('オプションを解析できること', () => {
    const instance = cli('test', 'テスト用CLI');
    const argv = instance.parseSync([]);
    expect(argv).toBeDefined();
  });
});
