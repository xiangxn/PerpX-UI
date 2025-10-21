export function cutTxId(txId: string) {
  if (!txId || txId.length < 16) return txId;
  return txId.substring(0, 8) + '...' + txId.substring(txId.length - 8)
}

/**
 * 将字符串的首字母大写
 * @param str 要处理的字符串
 * @returns 首字母大写后的字符串
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatNumberCN(num: number): string {
  if (num >= 1e8) {
    // 亿
    return (num / 1e8).toFixed(2).replace(/\.00$/, '') + '亿';
  } else if (num >= 1e4) {
    // 万
    return (num / 1e4).toFixed(2).replace(/\.00$/, '') + '万';
  }
  return num.toFixed(2).replace(/\.00$/, ''); // 小于 1 万保持原值
}

export function formatNumberEN(num: number): string {
  if (!num) return "0"
  if (num >= 1e3 && num < 1e6) {
    return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'K';
  } else if (num >= 1e6 && num < 1e9) {
    return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'M';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2).replace(/\.00$/, '') + 'B';
  }
  return num.toFixed(2).replace(/\.00$/, ''); // 小于 1K 保持原值
}

export function printFloat(num: number, digits: number = 2) {
  return num.toFixed(digits).replace(/\.?0+$/, '');
}
