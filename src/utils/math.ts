import * as math from 'mathjs';

export default {
  add(num1, num2) {
    return math.add(math.bignumber(num1), math.bignumber(num2));
  },
};
