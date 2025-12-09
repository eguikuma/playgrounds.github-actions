import { Cli, logger, env, MissingEnvironmentVariableError } from '../shared';
import { Creator } from './core';

const main = async () => {
  const { PR_NUMBER } = env(Cli);

  if (!PR_NUMBER) {
    throw new MissingEnvironmentVariableError('PR_NUMBER が指定されていません');
  }

  const creator = new Creator();

  await creator.create(PR_NUMBER);

  logger().info({
    success: true,
    message: '🎉 リリースを作成しました',
    data: null
  });
};

main();
