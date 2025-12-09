import { z } from 'zod';

export const Github = z.object({
  GITHUB_TOKEN: z.string().min(1, 'GITHUB_TOKEN が設定されていません')
});

export type Github = z.infer<typeof Github>;

export const Cli = z.object({
  PR_NUMBER: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value, 10) : undefined))
    .refine((value) => value === undefined || (!isNaN(value) && value > 0), {
      message: 'PR_NUMBER は正の整数である必要があります'
    }),
  LABELS: z
    .string()
    .optional()
    .transform((values) =>
      values
        ? values
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean)
        : []
    ),
  COMMENT: z.string().optional()
});

export type Cli = z.infer<typeof Cli>;

export const env = <T extends z.ZodTypeAny>(schema: T): z.infer<T> => {
  const result = schema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue: z.core.$ZodIssue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`\n\n🚫 環境変数のバリデーションに失敗しました:\n${errors}\n`);
  }

  return result.data;
};
