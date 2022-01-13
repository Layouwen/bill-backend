import * as crypto from 'crypto';

export * from './response';
export * from './oss';

export const getFileHash = (file) => {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(file.buffer);
  return hashSum.digest('hex');
};
