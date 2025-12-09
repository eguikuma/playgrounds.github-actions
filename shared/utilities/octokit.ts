import { getOctokit } from '@actions/github';
import { throttling } from '@octokit/plugin-throttling';

import { Config } from './config';
import { logger } from './logger';

import type { Octokit } from '../definitions/octokit';

/**
 * レート制限時のハンドラー（最大2回まで自動リトライ）
 */
export const onRateLimit = (
  delay: number,
  options: { method: string; url: string },
  _instance: unknown,
  count: number
): boolean => {
  logger().warn({
    message: 'レート制限に達しました',
    method: options.method,
    url: options.url,
    delay,
    count
  });

  return count < 2;
};

/**
 * セカンダリレート制限時のハンドラー（短時間の大量リクエスト制限）
 */
export const onSecondaryRateLimit = (
  delay: number,
  options: { method: string; url: string },
  _instance: unknown,
  count: number
): boolean => {
  logger().warn({
    message: '短時間の大量リクエスト制限に達しました',
    method: options.method,
    url: options.url,
    delay,
    count
  });

  return count < 2;
};

/**
 * レート制限対応のOctokitインスタンス
 */
export const octokit = (): Octokit => {
  const { token } = Config.Github.load();

  return getOctokit(
    token,
    {
      throttle: {
        onRateLimit,
        onSecondaryRateLimit
      }
    },
    throttling as unknown as Parameters<typeof getOctokit>[2]
  ) as Octokit;
};
