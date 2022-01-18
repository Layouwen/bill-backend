import * as qiniu from 'qiniu';
import { Oss, OssConfig } from './Oss';

export interface QiniuOssConfig extends OssConfig {
  accessKey: string;
  secretKey: string;
  bucket: string;
  domain: string;
}

export class QiniuOss extends Oss {
  private static instance: QiniuOss = null;
  private readonly domain: string;
  private conf: qiniu.conf.Config;
  private token = '';

  constructor(config: QiniuOssConfig) {
    super(config);
    if (QiniuOss.instance) return QiniuOss.instance;
    this.domain = config.domain;
    this.initConf();
    this.updateToken();
    QiniuOss.instance = this;
  }

  private initConf() {
    const conf = new qiniu.conf.Config();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    conf.zone = qiniu.zone.Zone_z2;
    this.conf = conf;
  }

  private updateToken() {
    const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    const putPolicy = new qiniu.rs.PutPolicy({ scope: this.bucket });
    this.token = putPolicy.uploadToken(mac);
  }

  public uploadFile(file, name: string, path = ''): Promise<any> {
    const { buffer, originalname } = file;
    path = `${path.slice(1)}${name}`;
    const ext = originalname.split('.').pop();
    ext && (path += `.${ext}`);
    this.updateToken();
    const formUploader = new qiniu.form_up.FormUploader(this.conf);
    const putExtra = new qiniu.form_up.PutExtra();
    return new Promise((resolve, reject) => {
      formUploader.put(
        this.token,
        path,
        buffer,
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) reject(respErr);
          if (respInfo.statusCode == 200)
            resolve({ url: `${this.domain}/${path}` });
          else reject(respInfo.statusCode);
          resolve({ respInfo: respInfo.statusCode, respBody });
        },
      );
    });
  }
}
