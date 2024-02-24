import { z as zod } from 'zod';
import { Exception } from '@/utils/exception';

const environmentVariablesSchema = zod.object({
  PORT: zod.coerce.number(),
});

const _env = environmentVariablesSchema.safeParse(process.env);

if (!_env.success) {
  const error = _env.error.format();
  const errorMessage = `
    Please verify '.env' file, this file have undeclared variables

    ${JSON.stringify(error)}
  `;

  throw new Exception(errorMessage);
}

export const env = _env.data;
