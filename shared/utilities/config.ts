import * as fs from 'node:fs';
import * as path from 'node:path';
import { isAbsolute } from 'node:path';

import { configDotenv } from 'dotenv';
import * as yaml from 'js-yaml';

import defaultConfig from '../../release-butler.config';
import { MissingConfigFileError, MissingEnvironmentVariableError } from '../errors';
import { env, Github } from '../schemas/environment';

import type { AppConfig } from '../definitions';

export const Config = {
  /**
   * 基本の設定ファイルを読み込む
   */
  load: (toPath?: string) => load(toPath),
  /**
   * GitHubの設定情報を読み込む
   */
  Github: {
    load: () => {
      configDotenv({ quiet: true });

      try {
        const { GITHUB_TOKEN } = env(Github);

        return {
          token: GITHUB_TOKEN
        };
      } catch (error) {
        throw new MissingEnvironmentVariableError(
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  }
} as const;

const load = (toPath?: string) => {
  if (!toPath) return defaultConfig;

  const formattedToPath = isAbsolute(toPath) ? toPath : path.join(process.cwd(), toPath);

  if (!fs.existsSync(formattedToPath)) {
    throw new MissingConfigFileError(`\n\n🚫 指定したパスに設定ファイルが存在しません`);
  }

  return merge(
    defaultConfig,
    yaml.load(fs.readFileSync(formattedToPath, 'utf8')) as Partial<AppConfig>
  ) as AppConfig;
};

const merge = (defaults: AppConfig, source: Partial<AppConfig>): AppConfig => {
  return {
    label: {
      lgtm: source.label?.lgtm ?? defaults.label.lgtm,
      categories: source.label?.categories ?? defaults.label.categories
    },
    release: {
      base: source.release?.base ?? defaults.release.base,
      head: source.release?.head ?? defaults.release.head,
      title: source.release?.title ?? defaults.release.title,
      categories: source.release?.categories ?? defaults.release.categories,
      version: {
        rules: {
          ...(source.release?.version?.rules ?? defaults.release.version.rules)
        },
        defaults: {
          ...(source.release?.version?.defaults ?? defaults.release.version.defaults)
        }
      }
    }
  };
};
