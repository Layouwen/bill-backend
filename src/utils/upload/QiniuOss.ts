import * as qiniu from 'qiniu';
import { Oss, OssConfig } from './Oss';

export class QiniuOss extends Oss {
  private static instance: QiniuOss = null;
  private token = '';
  private conf: qiniu.conf.Config;

  constructor(config: OssConfig) {
    super(config);
    if (QiniuOss.instance) return QiniuOss.instance;
    this.initConf();
    this.updateToken();
    QiniuOss.instance = this;
  }

  private initConf() {
    const conf = new qiniu.conf.Config();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    conf.zone = qiniu.zone.Zone_z0;
    this.conf = conf;
  }

  private updateToken() {
    const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    const putPolicy = new qiniu.rs.PutPolicy({ scope: this.bucket });
    this.token = putPolicy.uploadToken(mac);
  }

  public getToken() {
    return this.token;
  }

  public uploadFile(localFile, name: string) {
    this.updateToken();
    console.log(this.token, 'new token');
    const formUploader = new qiniu.form_up.FormUploader(this.conf);
    const putExtra = new qiniu.form_up.PutExtra();
    return new Promise((resolve, reject) => {
      formUploader.putFile(
        this.token,
        name,
        localFile,
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) reject(respErr);
          if (respInfo.statusCode == 200) resolve(respBody);
          else resolve({ respInfo: respInfo.statusCode, respBody });
        },
      );
    });
  }
}
