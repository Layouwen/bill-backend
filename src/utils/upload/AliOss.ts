import * as Ali from 'ali-oss';
import { Oss, OssConfig } from './Oss';

export interface AliConfig extends OssConfig {
  region: string;
}

export class AliOss extends Oss {
  private static instance: AliOss = null;
  private readonly client: Ali;

  constructor(config: AliConfig) {
    super(config);
    if (AliOss.instance) return AliOss.instance;
    this.client = new Ali({
      region: config.region,
      accessKeyId: this.accessKey,
      accessKeySecret: this.secretKey,
      bucket: this.bucket,
    });
    AliOss.instance = this;
  }

  public uploadFile(file, name, path = '') {
    const { mineType, buffer, originalname } = file;
    path = `${path}${name}`;
    const ext = originalname.split('.').pop();
    ext && (path += `.${ext}`);
    console.log(path, '路径');
    return this.client.put(path, buffer, { mime: mineType });
  }
}
