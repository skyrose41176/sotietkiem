export const formatNumber = (value: string | number | undefined) => {
  if (typeof value === 'undefined') return '';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
  });
  return formatter.format(Number(value));
};
