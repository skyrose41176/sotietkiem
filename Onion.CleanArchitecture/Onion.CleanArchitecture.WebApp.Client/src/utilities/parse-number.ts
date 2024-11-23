export const parseNumber = (num: any) => {
  const result = Number(num);
  if (isNaN(result)) return 0;
  return result;
};
