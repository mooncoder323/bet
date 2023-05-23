import React, {Component} from 'react';
import {AccountBalance} from "../../API/Account/AccountInformationResponse";
import {LivefeedWager, PlatformStatistics} from "../../API/PlatformStatistics";
import LandingHeader from "../../Components/Header/LandingHeader";
import LandingFeed from "../../Components/Landing/LandingFeed";
import {numberWithCommas} from "../../Utilities/Currencies";
import {gambleResponsiblyAwareness} from "../../SaferGambling/Safety";
import Footer from "../../Components/Footer/Footer";
import {axiosGet} from "../../Utilities/HTTPClient";

type LandingProps = {
    balance: number
    balances?: Array<AccountBalance>
    username?: string
    currency?: string
    
    pageLoadedAt: Date
    openLoginModal: any
}

type LandingState = {
    online: number
    jackpot: number
    paidOutCurrencyOne: number
    paidOutCurrencyTwo: number
    wagersPlaced: number
    players: number
    wagers: Array<LivefeedWager>,
    timeLeft: number
}

class Landing extends Component<LandingProps, LandingState> {

    private eventInterval?: NodeJS.Timer;

    constructor(props: LandingProps) {
        super(props);
        this.state = {
            timeLeft: 1000,
            online: 0,
            jackpot: 0,
            paidOutCurrencyOne: 0,
            paidOutCurrencyTwo: 0,
            wagersPlaced: 0,
            players: 0,
            wagers: [],
        }
        this.updateTimer = this.updateTimer.bind(this)
    }
    
    platformStatistics = async (): Promise<PlatformStatistics> => axiosGet(`/api/statistics`)

    componentDidMount() {
        this.platformStatistics().then(platformStats => {
            this.setState({
                online: platformStats.online,
                jackpot: platformStats.jackpot,
                paidOutCurrencyOne: platformStats.paidOutCurrencyOne,
                paidOutCurrencyTwo: platformStats.paidOutCurrencyTwo,
                wagersPlaced: platformStats.wagersPlaced,
                players: platformStats.players,
                wagers: platformStats.wagers,
                timeLeft: platformStats.eventTime
            }, () => {
                const client = new EventSource("https://betsse.onyxtechnology.co.uk/api/statistics/platform");
                client.addEventListener("landing",jmsevent => {
                    const message = jmsevent.data
                    if (message.startsWith("feed")) {
                        const wagerParameters = message.substring(5, message.length).split(' ')
                        const wagers: Array<LivefeedWager> = []
                        wagers.push({
                            username: wagerParameters[1],
                            game: wagerParameters[2],
                            payout: Number(wagerParameters[3])
                        })
                        this.state.wagers.map(w => wagers.push(w))
                        this.setState({wagers: wagers})
                        return
                    }
                    const data = message.split(':')
                    switch(data[0]) {
                        case 'jackpot': {
                            this.setState({ jackpot: Number(data[1]) })
                            break
                        }
                        case 'wagers': {
                            this.setState({ wagersPlaced: Number(data[1]) })
                            break
                        }
                        case 'osrs': {
                            this.setState({ paidOutCurrencyOne: Number(data[1]) })
                            break
                        }
                        case 'rs3': {
                            this.setState({ paidOutCurrencyTwo: Number(data[1]) })
                            break
                        }
                        case 'online': {
                            this.setState({ online: Number(data[1]) })
                            break
                        }
                    }
                })
                if (this.eventInterval == null) {
                    this.eventInterval = setInterval(() => this.updateTimer(), 1000)
                }
            })
        })
    }

    updateTimer() {
        this.setState({
            timeLeft: this.state.timeLeft - 1000
        })
    }

    msToTime(ms: number): any {
        let days = Math.floor(ms / (24*60*60*1000));
        let daysms= ms % (24*60*60*1000);
        let hours = Math.floor((daysms)/(60*60*1000));
        let hoursms=ms % (60*60*1000);
        let minutes = Math.floor((hoursms)/(60*1000));
        let minutesms=ms % (60*1000);
        let sec = Math.floor((minutesms)/(1000));
        return {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: sec
        };
    }

    render() {
        const eventTime = this.msToTime(this.state.timeLeft)
        return (
            <>
                <LandingHeader
                    balance={this.props.balance}
                    balances={this.props.balances}
                    username={this.props.username}
                    currency={this.props.currency ? this.props.currency : 'GBP'}
                    pageLoadedAt={this.props.pageLoadedAt}
                    online={this.state.online}
                    openLoginModal={this.props.openLoginModal}
                />
                <LandingFeed wagers={this.state.wagers} />
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="svg-settings">
                    <defs>
                        <linearGradient id="linear">
                            <stop className="linear-stop1" offset="0%"></stop>
                            <stop className="linear-stop2" offset="100%"></stop>
                        </linearGradient>

                        <radialGradient id="radial">
                            <stop className="radial-stop1" offset="0%"></stop>
                            <stop className="radial-stop2" offset="100%"></stop>
                        </radialGradient>
                        <linearGradient id="linear2">
                            <stop className="linear-stop3" offset="0%"></stop>
                            <stop className="linear-stop4" offset="100%"></stop>
                        </linearGradient>

                        <radialGradient id="radial2">
                            <stop className="radial-stop3" offset="0%"></stop>
                            <stop className="radial-stop4" offset="100%"></stop>
                        </radialGradient>
                    </defs>
                </svg>
                <div className="LandingContentContainer">
                    <div className="LandingStats">

                        <div className="main-stat">
                            <div className="main-stat__icon">
                                <i className="fa-solid fa-slot-machine fill-gradient-radial"></i>
                            </div>
                            <div className="main-stat__count">
                                {numberWithCommas(this.state.jackpot)}
                            </div>
                            <div className="main-stat__title">
                                Jackpot (OSRS)
                            </div>
                        </div>
                        <div className="main-stat">
                            <div className="main-stat__icon">
                                <i className="fa-solid fa-money-bill-trend-up fill-gradient-radial"></i>
                            </div>
                            <div className="main-stat__count">
                                {numberWithCommas(this.state.paidOutCurrencyOne)}
                            </div>
                            <div className="main-stat__title">
                                Total OSRS paid out
                            </div>
                        </div>
                        <div className="main-stat">
                            <div className="main-stat__icon">
                                <i className="fa-regular fa-money-bill-trend-up fill-gradient-radial"></i>

                            </div>
                            <div className="main-stat__count">
                                {numberWithCommas(this.state.paidOutCurrencyTwo)}
                            </div>
                            <div className="main-stat__title">
                                Total RS3 paid out
                            </div>
                        </div>
                        <div className="main-stat">
                            <div className="main-stat__icon">
                                <i className="fa-regular fa-money-from-bracket fill-gradient-radial"></i>

                            </div>
                            <div className="main-stat__count">
                                {numberWithCommas(this.state.wagersPlaced)}
                            </div>
                            <div className="main-stat__title">
                                Wagers Placed
                            </div>
                        </div>
                        <div className="main-stat">
                            <div className="main-stat__icon">
                                <i className="fa-solid fa-users fill-gradient-radial"></i>
                            </div>
                            <div className="main-stat__count">
                                {numberWithCommas(this.state.players)}
                            </div>
                            <div className="main-stat__title">
                                Players
                            </div>
                        </div>

                    </div>
                    <div className="LandingPromo">
                        <div className="Promotional">
                            <div className="PromoContainer">
                                <div className="PromoAvatar"></div>
                                <div className="PromoSplash">
                                    <div className="PromoHeader"></div>
                                    <div className="PromoTimer">

                                        <div className="PromoTimerContainer">
                                            <ul>
                                                <li className="TimeValue">{eventTime.days}</li>
                                                <li>Days</li>
                                            </ul>
                                            <ul>
                                                <li>:</li>
                                            </ul>
                                            <ul>
                                                <li className="TimeValue">{eventTime.hours}</li>
                                                <li>Hours</li>
                                            </ul>
                                            <ul>
                                                <li>:</li>
                                            </ul>
                                            <ul>
                                                <li className="TimeValue">{eventTime.minutes}</li>
                                                <li>Minutes</li>
                                            </ul>
                                            <ul>
                                                <li>:</li>
                                            </ul>
                                            <ul>
                                                <li className="TimeValue">{eventTime.seconds}</li>
                                                <li>Seconds</li>
                                            </ul>
                                        </div>

                                    </div>
                                    <div className="PromoAction">
                                        <button>Go to event</button>
                                    </div>
                                </div>
                                <div className="PromoAvatar AltAvatar"></div>
                            </div>
                        </div>
                    </div>
                    <br/><br/><br/>
                    <div className="BetlockerSplash">
                        <div className="AltContainer">
                            {
                                gambleResponsiblyAwareness()
                            }
                        </div>
                    </div>

                    <Footer />
                </div>
            </>
        );
    }
}

export default Landing;