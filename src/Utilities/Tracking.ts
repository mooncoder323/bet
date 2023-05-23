import {axiosGet} from "./HTTPClient"

const activities: Map<string, string> = new Map()
activities.set('/', 'browse:landing')
activities.set('/sports', 'browse:sports')
activities.set('/games', 'browse:games')
activities.set('/live-casino', 'browse:casino')
activities.set('/account', 'browse:account')
activities.set('/safer-gambling', 'browse:safety')
activities.set('/register', 'browse:register')

const ping = async (): Promise<string> => axiosGet(`/admin/auth/p`)
const activity = async (k: string, d: number): Promise<string> => axiosGet(`/admin/auth/a?k=${k}&d=${d}`)

export function pingInterval() {
    return setInterval(() => ping().catch(), 60_000)
}

export function safelyNavigateToPage(loaded: Date, url: string) {
    const activityKey = window.location.pathname.split('?')[0]
    const key = activities.get(activityKey)
    const duration = new Date().getTime() - loaded.getTime()
    if (!key) {
        // @ts-ignore
        window.location = url
    } else {
        activity(key, duration).then(r => {
            // @ts-ignore
            window.location = url
        }).catch(e => {
            // @ts-ignore
            window.location = url
        })
    }
}