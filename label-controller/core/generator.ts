import { Converter } from './converter';
import { GithubLabel, logger, type Logger } from '../../shared';

/**
 * 設定ファイルからラベルを生成する
 */
export class Generator {
  private names: string[];
  private readonly converter: Converter;
  private readonly label: GithubLabel;
  private readonly logger: Logger;

  constructor(args?: {
    names?: string[];
    converter?: Converter;
    label?: GithubLabel;
    logger?: Logger;
  }) {
    this.names = args?.names || [];
    this.converter = args?.converter || new Converter();
    this.label = args?.label || new GithubLabel();
    this.logger = args?.logger || logger({ context: 'generator' });
  }

  /**
   * 設定に基づいてラベルを同期する
   */
  async sync(replaceAll = false) {
    this.names = await this.label.get();

    if (replaceAll) {
      await this.clear();
    }

    await this.upsert();
  }

  /**
   * 全てのラベルを削除する
   */
  private async clear() {
    for (const name of this.names) {
      this.names = await this.label.delete({ name, names: this.names });

      this.logger.info(`🗑️ ${name} を削除しました`);
    }
  }

  /**
   * 設定に基づいてラベルを同期する
   */
  private async upsert() {
    const categories = this.converter.toCategories();

    for (const category of Object.values(categories)) {
      if (this.names.includes(category.name)) continue;

      await this.label.create(category);

      this.logger.info(`✨ ${category.name} を作成しました`);
    }
  }
}
