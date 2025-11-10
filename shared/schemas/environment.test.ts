import { beforeEach, describe, expect, it } from 'vitest';

import { Cli, env, Github } from './environment';

describe('Github', () => {
  beforeEach(() => {
    delete process.env.GITHUB_TOKEN;
  });

  it('GITHUB_TOKENが設定されている場合、バリデーションが成功すること', () => {
    process.env.GITHUB_TOKEN = 'test-token';
    const result = env(Github);
    expect(result.GITHUB_TOKEN).toBe('test-token');
  });

  it('GITHUB_TOKENが設定されていない場合、エラーを投げること', () => {
    expect(() => env(Github)).toThrow('環境変数のバリデーションに失敗しました');
  });

  it('GITHUB_TOKENが空文字の場合、エラーを投げること', () => {
    process.env.GITHUB_TOKEN = '';
    expect(() => env(Github)).toThrow('環境変数のバリデーションに失敗しました');
  });
});

describe('Cli', () => {
  beforeEach(() => {
    delete process.env.PR_NUMBER;
    delete process.env.LABELS;
    delete process.env.COMMENT;
  });

  it('PR_NUMBERが数値文字列の場合、数値に変換されること', () => {
    process.env.PR_NUMBER = '123';
    const result = env(Cli);
    expect(result.PR_NUMBER).toBe(123);
  });

  it('PR_NUMBERが未設定の場合、undefinedになること', () => {
    const result = env(Cli);
    expect(result.PR_NUMBER).toBeUndefined();
  });

  it('PR_NUMBERが不正な値の場合、エラーを投げること', () => {
    process.env.PR_NUMBER = 'abc';
    expect(() => env(Cli)).toThrow('PR_NUMBER は正の整数である必要があります');
  });

  it('PR_NUMBERが負の数の場合、エラーを投げること', () => {
    process.env.PR_NUMBER = '-1';
    expect(() => env(Cli)).toThrow('PR_NUMBER は正の整数である必要があります');
  });

  it('LABELSがカンマ区切りの文字列の場合、配列に変換されること', () => {
    process.env.LABELS = 'bug,feature,enhancement';
    const result = env(Cli);
    expect(result.LABELS).toEqual(['bug', 'feature', 'enhancement']);
  });

  it('LABELSに空白が含まれる場合、トリムされること', () => {
    process.env.LABELS = ' bug , feature , enhancement ';
    const result = env(Cli);
    expect(result.LABELS).toEqual(['bug', 'feature', 'enhancement']);
  });

  it('LABELSが未設定の場合、空配列になること', () => {
    const result = env(Cli);
    expect(result.LABELS).toEqual([]);
  });

  it('COMMENTが設定されている場合、その値が取得できること', () => {
    process.env.COMMENT = 'test comment';
    const result = env(Cli);
    expect(result.COMMENT).toBe('test comment');
  });

  it('COMMENTが未設定の場合、undefinedになること', () => {
    const result = env(Cli);
    expect(result.COMMENT).toBeUndefined();
  });
});

describe('env', () => {
  it('バリデーションに失敗した場合、詳細なエラーメッセージを表示すること', () => {
    delete process.env.GITHUB_TOKEN;
    expect(() => env(Github)).toThrow('環境変数のバリデーションに失敗しました');
  });
});
