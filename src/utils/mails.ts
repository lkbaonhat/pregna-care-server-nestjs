import * as path from 'path';

export const getFullTemplatePath = (templatePath: string): string => {
  return path.join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'templates',
    ...templatePath.split('/'),
  );
};
