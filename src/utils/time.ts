import * as dayjs from 'dayjs';

export const getStartAndEndTime = () => ({
  startTime: dayjs().startOf('day').format(),
  endTime: dayjs().endOf('day').format(),
  nowTime: dayjs().format(),
});
