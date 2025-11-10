import { logger } from '../shared';
import { Creator } from './core';

const main = async () => {
  const creator = new Creator();

  const number = await creator.create();

  logger().info({
    success: true,
    message: number
      ? '🎉 プルリクエストを作成しました'
      : '⚠️ プルリクエストの作成をスキップしました',
    data: {
      number: number ?? null
    }
  });
};

main();
