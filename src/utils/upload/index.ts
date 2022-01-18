import config from '../../config';
import { AliOss } from './AliOss';
import { Oss } from './Oss';
import { QiniuOss } from './QiniuOss';

export const qiniuOss = Oss.init(QiniuOss, {
  bucket: config.oss.qiniu.bucket,
  secretKey: config.oss.qiniu.SecretKey,
  accessKey: config.oss.qiniu.AccessKey,
  domain: config.oss.qiniu.domain,
});

export const aliOss = Oss.init(AliOss, {
  bucket: config.oss.ali.bucket,
  secretKey: config.oss.ali.accessKeySecret,
  accessKey: config.oss.ali.accessKeyId,
  region: config.oss.ali.region,
});
