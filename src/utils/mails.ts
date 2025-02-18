import * as path from 'path';

export const getFullTemplatePath = () => {
  return path.join(__dirname, '..', '..', 'templates');
};
