import { logger } from '../shared';
import { Updater } from './core';

const main = async () => {
  const updater = new Updater();

  const number = await updater.update();

  logger().info({
    success: true,
    message: '🎉 プルリクエストを更新しました',
    data: {
      number: number ?? null
    }
  });
};

main();
