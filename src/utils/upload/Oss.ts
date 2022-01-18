import { AliConfig, AliOss } from './AliOss';
import { QiniuOss, QiniuOssConfig } from './QiniuOss';

export interface OssConfig {
  bucket: string;
  accessKey: string;
  secretKey: string;
}

export class Oss {
  protected readonly bucket: string;
  protected readonly accessKey: string;
  protected readonly secretKey: string;

  constructor(config: OssConfig) {
    this.bucket = config.bucket;
    this.accessKey = config.accessKey;
    this.secretKey = config.secretKey;
  }

  static init<T extends typeof QiniuOss>(
    OssModule: T,
    config: QiniuOssConfig,
  ): QiniuOss;
  static init<T extends typeof AliOss>(OssModule: T, config: AliConfig): AliOss;
  static init(OssModule: any, config) {
    return new OssModule(config);
  }
}
