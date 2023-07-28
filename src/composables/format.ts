const numberFormat = new Intl.NumberFormat();

export function useNumberFormat(price: number) {
  return numberFormat.format(price)
}