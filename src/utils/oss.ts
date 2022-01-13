import * as OSS from 'ali-oss';
import config from '../config';
import { getFileHash } from './index';

const client = new OSS({
  region: 'oss-cn-guangzhou',
  accessKeyId: config.oss.accessKeyId,
  accessKeySecret: config.oss.accessKeySecret,
  bucket: 'bill-rearend',
});

export async function uploadFile(file) {
  const hash = getFileHash(file);
  const { mineType, buffer } = file;
  return await client.put(hash, buffer, {
    mime: mineType,
  });
}
