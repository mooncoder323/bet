export interface AccountHistoryResponse {
    transactions: Array<Transaction>
    wagers: Array<HistoricalBet>
}

export interface Transaction {
    id: number
    date: Date
    amount: number
    currency: string
    status: string
}

export interface HistoricalBet {
    game: string
    date: Date
    amount: number
    newBalance: number
    change: number
}