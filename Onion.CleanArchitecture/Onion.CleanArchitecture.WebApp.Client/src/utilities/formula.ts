export function sum(...numbers: (number | string | undefined)[]) {
  const result = numbers
    .map((i) =>
      typeof i === "number" ? i : typeof i === "undefined" ? 0 : Number(i)
    )
    .reduce((a, b) => {
      return (a * 1000 + b * 1000) / 1000;
    }, 0);
  if (isNaN(result)) return 0;
  return result;
}

export function minus(...numbers: (number | string | undefined)[]) {
  const result = numbers
    .map((i) =>
      typeof i === "number" ? i : typeof i === "undefined" ? 0 : Number(i)
    )
    .reduce((a, b) => {
      return (-a * 1000 - b * 1000) / 1000;
    }, 0);
  if (isNaN(result)) return 0;
  return result;
}

export function multiplication(number: number) {
  const b = 0.05;
  const result = number * b;
  if (isNaN(result)) return 0;

  return result;
}

export function division(
  ...numbers: [number | string | undefined, number | string | undefined]
) {
  let result = 0;
  const a = Number(numbers[0]);
  const b = Number(numbers[1]);
  if (b !== 0) {
    result = a / b;
  }
  if (isNaN(result)) return 0;
  return result;
}
