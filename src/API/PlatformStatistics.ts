export type LivefeedWager = {
    payout: number
    username: string
    game: string

}

export type PlatformStatistics = {
    online: number
    jackpot: number
    paidOutCurrencyOne: number
    paidOutCurrencyTwo: number
    wagersPlaced: number
    players: number
    wagers: Array<LivefeedWager>
    eventTime: number
}