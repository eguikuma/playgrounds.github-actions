import { Cli, logger, env, MissingEnvironmentVariableError } from '../shared';
import { Commentator } from './core';

const main = async () => {
  const { PR_NUMBER, COMMENT } = env(Cli);

  if (!PR_NUMBER) {
    throw new MissingEnvironmentVariableError('PR_NUMBER が指定されていません');
  }

  const commentator = new Commentator();

  await commentator.add(PR_NUMBER, COMMENT);

  logger().info({
    success: true,
    message: '🎉 コメントを追加しました',
    data: null
  });
};

main();
