import { env, cli, logger, Cli, MissingEnvironmentVariableError } from '../shared';
import { Attacher } from './core/attacher';

const main = async () => {
  const { PR_NUMBER, LABELS } = env(Cli);
  const options = cli('labels:attach', 'プルリクエストにラベルを追加します')
    .option('lgtm', {
      type: 'boolean',
      description: 'LGTMラベルを追加',
      default: false
    })
    .parseSync();

  if (!PR_NUMBER || (!LABELS.length && !options.lgtm)) {
    throw new MissingEnvironmentVariableError('PR_NUMBER, LABELS が指定されていません');
  }

  const attacher = new Attacher();

  await attacher.attach({ number: PR_NUMBER, labels: LABELS, lgtm: options.lgtm });

  logger().info({
    success: true,
    message: '🎉 ラベルを追加しました',
    data: null
  });
};

main();
