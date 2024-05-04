const sizeUnits = ["b", "KiB", "MiB", "GiB", "PiB", "EiB", "ZiB", "YiB"];
const factor = 1024;

export function truncateNumber(number, maxDecimals=2) {
  const exp = 10 ** maxDecimals;
  return Math.round(number * exp) / exp;
}

export function formatFileSize(size, decimals = 1) {
  if (!size) return "0b";
  const i = Math.floor(Math.log(size) / Math.log(factor));
  return `${truncateNumber(size / Math.pow(factor, i), decimals)} ${
    sizeUnits[i]
  }`;
}