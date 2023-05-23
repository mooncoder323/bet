export type DiceGameState = {
    balance: number,
    rollOver: boolean,
    skipUpdate?: boolean,
    rolling: boolean,
    rollThreshold: number,
    multiplier: number,
    winChance: number,
    w: number,
    wagerAmount: number,
    onWin: number,
    onWinIncreaseBy: number,
    onLoss: number,
    onLossIncreaseBy: number,
    stopOnLoss: number,
    stopOnWin: number,
    sessionProfit: number,
    previousResult: number | null,
    rollHistory: Array<any>,
    earnings: number
    autoing: boolean
    wonPrevious: boolean
    wagered: number
    wager: number
    profit: number
    wins: number | undefined
    losses: number | undefined
    winningsData: Array<any>
    lossesData: Array<any>
}