import { defaultCategory } from '../constant';

export const createDefaultCategory = (userId: string) => {
  return defaultCategory.map((category) => {
    return {
      ...category,
      user: userId,
    };
  });
};
