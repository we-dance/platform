const EUR = '€' // Euro
const USD = '$' // US Dollar
const AUD = '$' // Australian Dollar
const BDT = '৳' // Bangladeshi Taka
const CAD = '$' // Canadian Dollar
const CNY = '¥' // Chinese Yuan
const CRC = '₡' // Costa Rican Colón
const ETH = 'Ξ' // Ethereum
const GBP = '£' // British Pound Sterling
const GEL = 'ლ' // Georgian Lari
const HKD = '$' // Hong Kong Dollar
const ILS = '₪' // Israeli New Sheqel
const INR = '₹' // Indian Rupee
const JPY = '¥' // Japanese Yen
const KRW = '₩' // South Korean Won
const LTC = 'Ł' // Litecoin
const MXN = '$' // Mexican Peso
const NGN = '₦' // Nigerian Naira
const NZD = '$' // New Zealand Dollar
const PHP = '₱' // Philippine Peso
const PLN = 'zł' // Polish Zloty
const PYG = '₲' // Paraguayan Guarani
const RUB = '₽' // Russian Ruble
const SGD = '$' // Singapore Dollar
const THB = '฿' // Thai Baht
const TRY = '₺' // Turkish Lira
const UAH = '₴' // Ukrainian Hryvna
const VND = '₫' // Vietnamese Dong
const XMR = 'ɱ' // Monero
const BTC = '₿' // Bitcoin

const CURRENCY_SYMBOLS = {
  EUR,
  USD,
  AUD,
  BDT,
  CAD,
  CNY,
  CRC,
  ETH,
  GBP,
  GEL,
  HKD,
  ILS,
  INR,
  JPY,
  KRW,
  LTC,
  MXN,
  NGN,
  NZD,
  PHP,
  PLN,
  PYG,
  RUB,
  SGD,
  THB,
  TRY,
  UAH,
  VND,
  XMR,
  BTC,
}

export const useCurrencies = Object.keys(CURRENCY_SYMBOLS).map((c, ind) => {
  return {
    label: `${Object.values(CURRENCY_SYMBOLS)[ind] + ' ' + c}`,
    value: `${Object.values(CURRENCY_SYMBOLS)[ind] + ' ' + c}`,
  }
})
