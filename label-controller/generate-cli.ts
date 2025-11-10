import * as fs from 'node:fs';
import * as path from 'node:path';

import { logger } from '../shared';
import { Converter } from './core/converter';

const main = async () => {
  const converter = new Converter();

  fs.writeFileSync(
    path.join(process.cwd(), '.github', 'pr-labels.yml'),
    converter.toYaml(),
    'utf8'
  );

  logger().info({
    success: true,
    message: '🎉 .github/pr-labels.yml の生成に成功しました',
    data: null
  });
};

main();
