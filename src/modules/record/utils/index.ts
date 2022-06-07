import * as dayjs from 'dayjs';
import { math } from '../../../utils';

export function calcEachMonthAmount(data) {
  const monthList = {};
  data.forEach((i) => {
    const month = dayjs(i.time).month() + 1;
    if (!(month in monthList)) monthList[month] = [];
    monthList[month].push([i.type, i.amount]);
  });

  const totalYearAmount = { expand: 0, income: 0, balance: 0 } as BillItem;

  const eachMonthAmount = Object.keys(monthList).reduce((pre, cur) => {
    pre[cur] = monthList[cur].reduce(
      (res, [type, amount]) => {
        if (type === '-') {
          res.expand = math.add(res.expand, amount).toNumber();
        } else if (type === '+') {
          res.income = math.add(res.income, amount).toNumber();
        }
        return res;
      },
      { income: 0, expand: 0 },
    );
    pre[cur].balance = math
      .subtract(pre[cur].income, pre[cur].expand)
      .toNumber();

    // Calculate the total bill
    totalYearAmount.income = math
      .add(pre[cur].income, totalYearAmount.income)
      .toNumber();
    totalYearAmount.expand = math
      .add(pre[cur].expand, totalYearAmount.expand)
      .toNumber();
    totalYearAmount.balance = math
      .add(pre[cur].balance, totalYearAmount.balance)
      .toNumber();
    return pre;
  }, {} as { [month: string]: BillItem });

  return {
    month: eachMonthAmount,
    all: totalYearAmount,
  };
}

type BillItem = {
  income: number;
  expand: number;
  balance: number;
};
