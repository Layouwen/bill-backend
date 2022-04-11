import * as crypto from 'crypto';

export { default as math } from './math';
export * from './response';
export * from './upload';
export * from './validation';

export const getFileHash = (file) => {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(file.buffer);
  return hashSum.digest('hex');
};
