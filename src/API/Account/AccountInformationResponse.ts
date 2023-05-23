export type AccountBalance = {
    currency: string,
    balance: number
}

export interface AccountInformationResponse {
    username: string
    primaryCurrency: string
    balance: number
    clientSeed: string
    accountBalances: Array<AccountBalance>
}