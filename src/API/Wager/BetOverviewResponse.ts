export interface BetOverviewResponse {
    id: string,
    username: string,
    time: Date,
    game: number,
    value: number,
    clientSeed: string,
    serverSeed: string,
    nonce: number,
    earnings: number,
    wager: number,
    multiplier: number
}