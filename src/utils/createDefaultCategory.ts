import { defaultCategoryExpend, defaultCategoryIncome } from '../constant';

export type CategoryRecord = {
  name: string;
  icon: string;
  type: '-' | '+';
  user: string | number;
};

export const createDefaultCategoryExpend = (userId: string) => {
  return defaultCategoryExpend.map((category) => {
    return {
      ...category,
      user: userId,
      type: '-',
    } as CategoryRecord;
  });
};

export const createDefaultCategoryIncome = (userId: string) => {
  return defaultCategoryIncome.map((category) => {
    return {
      ...category,
      user: userId,
      type: '+',
    } as CategoryRecord;
  });
};

export const createDefaultCategory = (userId: string) => {
  return [
    ...createDefaultCategoryExpend(userId),
    ...createDefaultCategoryIncome(userId),
  ];
};
