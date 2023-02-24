import { dirname, join } from 'path';

export const basepath = (...paths: string[]) =>
  join(dirname(__filename), '..', '..', '..', ...paths);
