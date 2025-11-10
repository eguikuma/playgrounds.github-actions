import { cli, logger } from '../shared';
import { Generator } from './core/generator';

const main = async () => {
  const options = cli('labels:sync', 'ラベルをGitHubに同期します')
    .option('replace-all', {
      type: 'boolean',
      description: '全ラベルを削除して再作成',
      default: false
    })
    .parseSync();

  const generator = new Generator();

  await generator.sync(options.replaceAll);

  logger().info({
    success: true,
    message: '🎉 ラベルを同期しました',
    data: null
  });
};

main();
