// 判断是否是数字
export const validateNumber = (value: string) => {
  const reg = /^[0-9]*$/;
  return reg.test(value);
};

// 8-20个字符
export const validatePassword = (value: string) => {
  const reg = /^[A-Za-z\d@$!%*?&]{8,20}$/;
  return reg.test(value);
};
