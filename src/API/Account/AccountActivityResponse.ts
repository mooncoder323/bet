export interface AccountActivityResponse {
    safetyRating: number
    netGains: Array<NetGain>
    onlineTime : number
    playTime : number
    netDeposit: number
    netWithdraw: number
    performance: Performance
    ochl: Array<OCHL>
}

export type NetGain = {
    date: Date
    onlineTime: number
    playTime: number
    netGain: number
}

export type Performance = {
    changeToday: number
    changeWeek: number
    changeMonth: number
    changeSixMonth: number
    changeYearToDate: number
    changeYear: number
}

export type OCHL = {
    date: number
    open: number
    close: number
    high: number
    low: number
}