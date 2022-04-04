export const successObject = (message: string = RESPONSE_MESSAGE.SUCCESS) => ({
  statusCode: RESPONSE_STATUS_CODE.SUCCESS,
  message,
});

export const failObject = (message: string = RESPONSE_MESSAGE.ERROR) => ({
  statusCode: RESPONSE_STATUS_CODE.ERROR,
  message,
});

export const createdObject = (message: string = RESPONSE_MESSAGE.CREATED) => ({
  statusCode: RESPONSE_STATUS_CODE.SUCCESS,
  message,
});

export const updatedObject = (message: string = RESPONSE_MESSAGE.UPDATED) => ({
  statusCode: RESPONSE_STATUS_CODE.SUCCESS,
  message,
});

export const deletedObject = (message: string = RESPONSE_MESSAGE.DELETED) => ({
  statusCode: RESPONSE_STATUS_CODE.SUCCESS,
  message,
});

export enum RESPONSE_MESSAGE {
  SUCCESS = '成功',
  ERROR = '失败',
  CREATED = '创建成功',
  UPDATED = '更新成功',
  DELETED = '删除成功',
}

export enum RESPONSE_STATUS_CODE {
  SUCCESS = 200,
  ERROR = 400,
}
