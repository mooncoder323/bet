export interface AccountOverviewResponse {
    status: string
    balanceChange: string
    availableBalance: number
    fillsBalance: number
    netBalance : number
    netBalanceChange: string
    netWithdrawals : number
    onlineTime : number
    playTime : number
    playTimeChange: string
    recentActivity: Array<SessionActivity>
    wagers: Array<WinningBet>
}

export interface WinningBet {
    date: Date
    profit: number
    mega: boolean
}

export interface SessionActivity {
    activity: string
    delta: Date
    duration: number
}