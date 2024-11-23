// generate list color avatar
const colors = {
  a: '#FF5733',
  ă: '#B71C1C',
  â: '#FFEB3B',
  b: '#F06292',
  c: '#E91E63',
  d: '#D824F8',
  đ: '#6A1B9A',
  e: '#2196F3',
  ê: '#03A9F4',
  g: '#4CAF50',
  h: '#8BC34A',
  i: '#CDDC39',
  k: '#9E9E9E',
  l: '#795548',
  m: '#607D8B',
  n: '#009688',
  o: '#FF9800',
  ô: '#FFC107',
  ơ: '#FF5722',
  p: '#673AB7',
  q: '#00BCD4',
  r: '#10796C',
  s: '#8E24AA',
  t: '#C74415',
  u: '#03B8AF',
  ư: '#FF9800',
  v: '#97C7B0',
  x: '#BDBDBD',
  y: '#FFC107',
};
export const generateAvatarName = (name: string) => {
  const arrName = name?.trim().toUpperCase().split(' ');
  const nameVisible = arrName
    ? arrName.length === 1
      ? arrName[0][0] === undefined
        ? 'None'
        : arrName[0][0]
      : arrName[arrName.length - 1][0] + arrName[0][0]
    : 'None';
  return nameVisible;
};
export function generateAvatarColor(name: string) {
  const n = generateAvatarName(name)[0].toLocaleLowerCase() as keyof typeof colors;
  return colors[n] ?? '#F44336';
}
