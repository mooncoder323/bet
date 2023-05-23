export type Currency = {
    img: string
    symbol: string
}

export function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const currencies: Map<string, Currency> = new Map();
currencies.set('OSRS', {
    img: 'dollar-currency.svg',
    symbol: ''
})
currencies.set('RS3', {
    img: 'british-pound-currency.svg',
    symbol: ''
})
currencies.set('USD', {
    img: 'dollar-currency.svg',
     symbol: '€'
})