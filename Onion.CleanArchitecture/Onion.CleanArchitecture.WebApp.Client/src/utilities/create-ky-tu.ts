export * from "./avatar";
export { formatDatetime } from "./format-datetime";
export { formatNumber } from "./format-number";
export * as formula from "./formula";
export { localLocale } from "./localLocale";
export { readMoney } from "./readMoney";
// export {removeUnnecessaryPropertiesNest} from './removeBaseProperties';
export * from "./storage";
// export * from './trangThaiToTrinh';
export * from "./parse-number";

export const insertSpacePascalCase = (str: string) => {
  return str.replace(/([A-Z])/g, " $1").trim();
};
export const newRgbaColor = (color: string, opacity: string) =>
  color.replace(/[^,]+(?=\))/, opacity);

export function toRoman(number: number) {
  var romanNumerals = [
    "M",
    "CM",
    "D",
    "CD",
    "C",
    "XC",
    "L",
    "XL",
    "X",
    "IX",
    "V",
    "IV",
    "I",
  ];
  var arabicNumerals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  var romanNumeral = "";
  for (var i = 0; i < arabicNumerals.length; i++) {
    while (number >= arabicNumerals[i]) {
      romanNumeral += romanNumerals[i];
      number -= arabicNumerals[i];
    }
  }
  return romanNumeral;
}
