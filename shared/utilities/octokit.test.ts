import { beforeEach, describe, expect, it, vi } from 'vitest';

const logger = {
  trace: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn()
};

vi.mock('@actions/github', () => ({
  getOctokit: vi.fn().mockReturnValue({
    rest: {
      issues: {},
      pulls: {},
      git: {},
      repos: {}
    }
  })
}));

vi.mock('./logger', () => ({
  logger: vi.fn(() => logger)
}));

describe('octokit', async () => {
  const { octokit, onRateLimit, onSecondaryRateLimit } = await import('./octokit');

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GITHUB_TOKEN = 'test-token';
  });

  it('Octokitインスタンスを作成できること', () => {
    const instance = octokit();
    expect(instance).toBeDefined();
    expect(instance.rest).toBeDefined();
  });

  it('REST APIクライアントが利用可能であること', () => {
    const instance = octokit();
    expect(instance.rest.issues).toBeDefined();
    expect(instance.rest.pulls).toBeDefined();
    expect(instance.rest.git).toBeDefined();
    expect(instance.rest.repos).toBeDefined();
  });

  describe('onRateLimit', () => {
    it('count=0の場合、リトライを許可すること', () => {
      const shouldRetry = onRateLimit(
        60,
        { method: 'GET', url: '/repos/owner/repo/labels' },
        {},
        0
      );

      expect(shouldRetry).toBe(true);
    });

    it('count=1の場合、リトライを許可すること', () => {
      const shouldRetry = onRateLimit(
        60,
        { method: 'GET', url: '/repos/owner/repo/labels' },
        {},
        1
      );

      expect(shouldRetry).toBe(true);
    });

    it('count=2の場合、リトライを拒否すること', () => {
      const shouldRetry = onRateLimit(
        60,
        { method: 'GET', url: '/repos/owner/repo/labels' },
        {},
        2
      );

      expect(shouldRetry).toBe(false);
    });

    it('ログが出力されること', () => {
      vi.clearAllMocks();

      onRateLimit(120, { method: 'PATCH', url: '/repos/owner/repo/pulls/1' }, {}, 1);

      expect(logger.warn).toHaveBeenCalledWith({
        message: 'レート制限に達しました',
        method: 'PATCH',
        url: '/repos/owner/repo/pulls/1',
        delay: 120,
        count: 1
      });
    });

    it('異なるメソッド/URLでも正しくログが記録されること', () => {
      vi.clearAllMocks();

      onRateLimit(90, { method: 'DELETE', url: '/repos/owner/repo/git/refs/heads/branch' }, {}, 0);

      expect(logger.warn).toHaveBeenCalledWith({
        message: 'レート制限に達しました',
        method: 'DELETE',
        url: '/repos/owner/repo/git/refs/heads/branch',
        delay: 90,
        count: 0
      });
    });
  });

  describe('onSecondaryRateLimit', () => {
    it('count=0の場合、リトライを許可すること', () => {
      const shouldRetry = onSecondaryRateLimit(
        60,
        { method: 'POST', url: '/repos/owner/repo/issues' },
        {},
        0
      );

      expect(shouldRetry).toBe(true);
    });

    it('count=2の場合、リトライを拒否すること', () => {
      const shouldRetry = onSecondaryRateLimit(
        60,
        { method: 'POST', url: '/repos/owner/repo/issues' },
        {},
        2
      );

      expect(shouldRetry).toBe(false);
    });

    it('セカンダリレート制限特有のログが出力されること', () => {
      vi.clearAllMocks();

      onSecondaryRateLimit(180, { method: 'POST', url: '/repos/owner/repo/pulls' }, {}, 0);

      expect(logger.warn).toHaveBeenCalledWith({
        message: '短時間の大量リクエスト制限に達しました',
        method: 'POST',
        url: '/repos/owner/repo/pulls',
        delay: 180,
        count: 0
      });
    });
  });

  describe('エッジケース', () => {
    it('onRateLimitでcountが2を超える場合、リトライを拒否すること', () => {
      const shouldRetry100 = onRateLimit(60, { method: 'GET', url: '/test' }, {}, 100);
      const shouldRetry10 = onRateLimit(60, { method: 'GET', url: '/test' }, {}, 10);

      expect(shouldRetry100).toBe(false);
      expect(shouldRetry10).toBe(false);
    });

    it('onSecondaryRateLimitでcountが2を超える場合、リトライを拒否すること', () => {
      const shouldRetry50 = onSecondaryRateLimit(60, { method: 'POST', url: '/test' }, {}, 50);

      expect(shouldRetry50).toBe(false);
    });
  });
});
