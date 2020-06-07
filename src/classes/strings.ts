export const DEFAULT_FRACTION_DIGITS = 2

function minimumFractionDigits (value: number): number {
  return value % 1 !== 0 ? DEFAULT_FRACTION_DIGITS : 0
}

export function formatPrice (price: number, currency = 'USD', showCents = false): string {
  const currencyConfig = currency ? {
    style: 'currency',
    currency
  } : {}

  const formatter = new Intl.NumberFormat('en-US', {
    ...currencyConfig,
    minimumFractionDigits: showCents ? DEFAULT_FRACTION_DIGITS : minimumFractionDigits(price)
  })
  return formatter.format(price)
}

export function convertPriceFromCentsToDollarsNumber (price: number): number {
  return price / 100
}

export function convertPriceFromCentsToDollars (price: number, currency = 'USD'): string {
  return formatPrice(convertPriceFromCentsToDollarsNumber(price), currency)
}

export function getRandomInt (max: number): number {
  return Math.floor(Math.random() * Math.floor(max))
}
