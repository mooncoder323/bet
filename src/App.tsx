import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './Assets/css/App.scss';
import './Assets/css/App.responsive.scss';
import HeaderStatic from "./Components/Header/HeaderStatic";
import MainHeader from "./Components/Header/MainHeader";
import SportsBetting from "./Games/Sports/SportsBetting";
import LoginModal from "./Components/Login/LoginModal";
import {axiosGet} from "./Utilities/HTTPClient";
import Header, {NavigationOption} from "./Components/Header/Header";
import LiveCasino from "./Games/LiveCasino/LiveCasino";
import OnlineGames from "./Games/OnlineGames/OnlineGames";
import OnlineGamesSearch from "./Games/OnlineGames/OnlineGamesSearch";
import Game from "./Games/OnlineGames/Game/Game";
import {Offer} from "./Components/Offer/Offer";
import {AccountBalance, AccountInformationResponse} from "./API/Account/AccountInformationResponse";
import SaferGambling from "./SaferGambling/SaferGambling";
import Account from "./Games/Account/Account";
import {pingInterval} from "./Utilities/Tracking";

import "bootstrap/dist/css/bootstrap.min.css";
import Landing from "./Games/Landing/Landing";
import Admin from "./Games/Admin/Admin";


type AppState = {
    loginModal: boolean
    searching: boolean
    username?: string
    clientSeed?: string
    currency?: string
    balance: number
    headerOpacity: number
    tab: number
    gamesOffers: Array<Offer>
    balances?: Array<AccountBalance>

    pageLoadedAt: Date
}

class App extends Component<any, AppState> {

    private pingInterval: NodeJS.Timer | undefined;

    constructor(props: any) {
        super(props)
        this.state = {
            loginModal: false,
            searching: false,
            tab: 0,
            headerOpacity: 0.1,
            balance: 0,
            gamesOffers: [
                {
                    title: 'Cheltenham Tournament',
                    prize: 'Win up to £1,000 cash',
                    splash: '/assets/Offers/offer_1.jpeg',
                    action: 'Join the Race',
                    url: '/sports',
                    terms: 'In-game opt in required. Play eligible slots from 00:00 GMT 10/03/2023 until 23:59 GMT 17/03/2023 to place on the Tournament leaderboard. The top 2,500 players in the Tournament will win a cash or Free Spins prize. Max. prize, time limits, game restrictions and T&Cs apply.'
                },
                {
                    title: 'Drops & Wins',
                    prize: '£500,000 in cash prizes – it only takes a spin to win',
                    splash: '/assets/Offers/offer_2.jpeg',
                    action: 'Play',
                    url: '/game/dice',
                    terms: 'In-game opt in required. Play eligible slots from 8th March until 5th April 2023 to enter Weekly Tournaments and place on the leaderboard. The top 1,500 players will win a cash prize between £10 and £10,000. Qualifying stakes on eligible slots could trigger a Daily Drops cash prize. Max. prize, time limits, game restrictions and T&Cs apply.'
                },
                {
                    title: 'Live Drops & Wins',
                    prize: '£360,000 in cash prizes',
                    splash: '/assets/Offers/offer_3.jpeg',
                    action: 'Play',
                    url: '/game/crash',
                    terms: 'In-game opt in required. Play eligible slots from 8th March until 5th April 2023 to enter Weekly Tournaments and place on the leaderboard. The top 1,500 players will win a cash prize between £10 and £10,000. Qualifying stakes on eligible slots could trigger a Daily Drops cash prize. Max. prize, time limits, game restrictions and T&Cs apply.'
                }
            ],
            pageLoadedAt: new Date()
        }
        this.switchTab = this.switchTab.bind(this)
        this.setBalance = this.setBalance.bind(this)
        this.toggleSearch = this.toggleSearch.bind(this)
        this.setClientSeed = this.setClientSeed.bind(this)
        this.openLoginModal = this.openLoginModal.bind(this)
        this.closeLoginModal = this.closeLoginModal.bind(this)
        this.updateHeaderOpacity = this.updateHeaderOpacity.bind(this)
    }

    changeSeed = async (): Promise<string> => axiosGet(`/game/change-seed`)
    getAccountInformation = async (): Promise<AccountInformationResponse> => axiosGet(`/admin/auth/information`)

    componentDidMount() {
        const token = localStorage.getItem("bearer")
        if (token) {
            this.getAccountInformation().then((r: AccountInformationResponse) => {
                this.setState({
                    username: r.username,
                    currency: r.primaryCurrency,
                    balance: r.balance,
                    clientSeed: r.clientSeed,
                    balances: r.accountBalances
                }, () => {
                    this.pingInterval = pingInterval()
                })
            }).catch(e => {
                localStorage.removeItem("bearer")
            })
        }
    }

    setClientSeed(seed: string) {
        this.setState({clientSeed: seed})
    }

    openLoginModal() {
        this.setState({loginModal: true})
    }

    switchTab(tab: number, runnable: any) {
        this.setState({tab: tab}, () => {
            if (runnable) {
                runnable()
            }
        })
    }

    toggleSearch() {
        this.setState({searching: !this.state.searching})
    }

    setBalance(balance: number) {
        this.setState({balance: balance})
    }

    closeLoginModal() {
        this.setState({loginModal: false})
    }

    updateHeaderOpacity(scrollY: number) {
        this.setState({headerOpacity: Math.min(scrollY - 5, 96) / 100})
    }

    getHeader(tab: number, title: string, options: Array<NavigationOption>) {
        return (<Header pageTitle={title}
                active={tab}
                tab={this.state.tab}
                switchTab={this.switchTab}
                setBalance={this.setBalance}
                balance={this.state.balance}
                searching={this.state.searching}
                toggleSearch={this.toggleSearch}
                username={this.state.username}
                openLoginModal={this.openLoginModal}
                options={options}
                opacity={this.state.headerOpacity}
                currency={this.state.currency ? this.state.currency : 'GBP'}
                pageLoadedAt={this.state.pageLoadedAt}
        />)
    }

    render() {
        window.addEventListener('scroll', e => {
            this.updateHeaderOpacity(window.scrollY)
        })
        const gameOptions: Array<NavigationOption> = [
            { option: 'Game', },
            { option: 'Provably Fair', forceMobileNavigationBackground: true },
        ]
        const gamesOptions: Array<NavigationOption> = [
            { option: 'Games', },
            // { option: 'All Games', },
            { option: 'Offers', forceMobileNavigationBackground: true },
            // { option: 'New Player Offer',},
        ]
        const casinoOptions: Array<NavigationOption> = [
            { option: 'Live Casino' },
            { option: 'All Games', },
            { option: 'Offers', forceMobileNavigationBackground: true },
        ]
        const saferGamblingOptions: Array<NavigationOption> = [
            { option: 'Mission Statement', },
            { option: 'Activity', },
            { option: 'Timeout'},
            { option: 'Self Exclusion' },
        ]
        const accountOptions: Array<NavigationOption> = [
            { option: 'Overview', },
            { option: 'Wallet', },
            { option: 'Activity', },
            { option: 'History', },
            { option: 'Settings' },
        ]
        const adminOptions: Array<NavigationOption> = [
            { option: 'Dashboard', },
            { option: 'Players', },
            { option: 'Tickets', },
        ]
        return (
            <div className="App">
                <LoginModal visibility={this.state.loginModal} closeLoginModal={this.closeLoginModal}/>
                <BrowserRouter>
                    <Switch>
                        <Route path="/sports">
                            <HeaderStatic pageLoadedAt={this.state.pageLoadedAt}/>
                            <MainHeader username={this.state.username} openLoginModal={this.openLoginModal}/>
                            <SportsBetting/>
                        </Route>
                        <Route path="/live-casino">
                            { this.getHeader(2, "Live Casino", casinoOptions) }
                            <LiveCasino
                                offers={this.state.gamesOffers}
                                activeTab={this.state.tab}
                                pageLoadedAt={this.state.pageLoadedAt}
                            />
                        </Route>
                        <Route path="/games">
                            { this.getHeader(3, "Games", gamesOptions) }
                            {
                                this.state.searching ?
                                    <OnlineGamesSearch/> :
                                    <OnlineGames
                                        activeTab={this.state.tab}
                                        offers={this.state.gamesOffers}
                                        pageLoadedAt={this.state.pageLoadedAt}
                                    />
                            }
                        </Route>
                        <Route path="/safer-gambling">
                            { this.getHeader(4, "Your Safety", saferGamblingOptions) }
                            {
                                this.state.searching ?
                                    <OnlineGamesSearch/> :
                                <SaferGambling activeTab={this.state.tab} />
                            }
                        </Route>
                        <Route path="/account">
                            { this.getHeader(5, "My Account", accountOptions) }
                            {
                                this.state.searching ?
                                    <OnlineGamesSearch/> :
                                    <Account
                                        offers={this.state.gamesOffers}
                                        username={this.state.username!!}
                                        balance={this.state.balance}
                                        currency={this.state.currency}
                                        activeTab={this.state.tab}
                                    />
                            }
                        </Route>
                        <Route path="/game/:game" render={(props) =>
                                <Game
                                    activeHeader={3}
                                    headerOpacity={this.state.headerOpacity}
                                    tab={this.state.tab}
                                    options={gameOptions}
                                    switchTab={this.switchTab}
                                    searching={this.state.searching}
                                    toggleSearch={this.toggleSearch}
                                    openLoginModal={this.openLoginModal}
                                    clientSeed={this.state.clientSeed}
                                    changeSeed={this.changeSeed}
                                    setClientSeed={this.setClientSeed}
                                    setBalance={this.setBalance}
                                    balance={this.state.balance}
                                    username={this.state.username}
                                    currency={this.state.currency ? this.state.currency : 'GBP'}
                                    pageLoadedAt={this.state.pageLoadedAt}
                                    {...props}
                                />
                            }/>
                        <Route path="/admin" render={(props) =>
                            <Admin
                                activeHeader={0}
                                headerOpacity={this.state.headerOpacity}
                                tab={this.state.tab}
                                options={adminOptions}
                                switchTab={this.switchTab}
                                searching={this.state.searching}
                                toggleSearch={this.toggleSearch}
                                balance={this.state.balance}
                                balances={this.state.balances}
                                setBalance={this.setBalance}
                                activeTab={this.state.tab}
                                username={this.state.username}
                                currency={this.state.currency ? this.state.currency : 'GBP'}
                                pageLoadedAt={this.state.pageLoadedAt}
                                openLoginModal={this.openLoginModal}
                            />
                        }/>
                        <Route path="/" render={(props) =>
                            <Landing
                                balance={this.state.balance}
                                balances={this.state.balances}
                                username={this.state.username}
                                currency={this.state.currency ? this.state.currency : 'GBP'}
                                pageLoadedAt={this.state.pageLoadedAt}
                                openLoginModal={this.openLoginModal}
                            />
                        }/>
                        <Route path="/">
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
