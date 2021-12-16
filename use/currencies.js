const EUR = '€' // Euro
const USD = '$' // US Dollar
const BDT = '৳' // Bangladeshi Taka
const CRC = '₡' // Costa Rican Colón
const ETH = 'Ξ' // Ethereum
const GBP = '£' // British Pound Sterling
const GEL = 'ლ' // Georgian Lari
const ILS = '₪' // Israeli New Sheqel
const INR = '₹' // Indian Rupee
const JPY = '¥' // Japanese Yen
const KRW = '₩' // South Korean Won
const LTC = 'Ł' // Litecoin
const NGN = '₦' // Nigerian Naira
const PHP = '₱' // Philippine Peso
const PLN = 'zł' // Polish Zloty
const PYG = '₲' // Paraguayan Guarani
const RUB = '₽' // Russian Ruble
const THB = '฿' // Thai Baht
const TRY = '₺' // Turkish Lira
const UAH = '₴' // Ukrainian Hryvna
const VND = '₫' // Vietnamese Dong
const XMR = 'ɱ' // Monero
const BTC = '₿' // Bitcoin

const CURRENCY_SYMBOLS = {
  EUR,
  USD,
  BDT,
  CRC,
  ETH,
  GBP,
  GEL,
  ILS,
  INR,
  JPY,
  KRW,
  LTC,
  NGN,
  PHP,
  PLN,
  PYG,
  RUB,
  THB,
  TRY,
  UAH,
  VND,
  XMR,
  BTC,
}

export const useCurrencies = Object.keys(CURRENCY_SYMBOLS).map((c, ind) => {
  return {
    label: `${Object.values(CURRENCY_SYMBOLS)[ind]}`,
    value: `${Object.values(CURRENCY_SYMBOLS)[ind]}`,
  }
})
