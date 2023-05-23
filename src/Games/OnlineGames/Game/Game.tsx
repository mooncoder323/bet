import React, {Component, RefObject} from 'react';
import Header, {NavigationOption} from "../../../Components/Header/Header";
import Footer from "../../../Components/Footer/Footer";
import {axiosGet} from "../../../Utilities/HTTPClient";
import {GameInformationResponse} from "../../../API/Game/GameInformationResponse";
import Tabs from "../../../Components/Tabs/Tabs";
import DiceGame from "./Impl/Dice/DiceGame";
import {BetOverviewResponse} from "../../../API/Wager/BetOverviewResponse";
import ProvablyFair from "./Fairness/ProvablyFair";
import {ProvablyFairSet} from "./Fairness/ProvablyFairSet";
import OnlineGamesSearch from "../OnlineGamesSearch";
import Crash from "./Impl/Crash/Crash";
import SlotsGame from "./Impl/Slots/SlotsGame";
import Roulette from './Impl/Roulette/RouletteGame';

export type GameProps = {
    searching: boolean
    options: Array<NavigationOption>
    balance: number
    activeHeader: number
    tab: number
    username?: string
    currency?: string
    clientSeed?: string
    headerOpacity: number
    toggleSearch: any
    openLoginModal: any
    switchTab: any
    setBalance: any
    setClientSeed: any
    changeSeed: any

    pageLoadedAt: Date
}

type GameState = {
    title: string
    verifying?: ProvablyFairSet
    liveBets: Array<BetOverviewResponse>
    myBets: Array<BetOverviewResponse>
}

class Game extends Component<GameProps, GameState> {

    private provablyFair: RefObject<HTMLInputElement> | undefined;

    constructor(props: GameProps) {
        super(props);
        this.state = {
            title: 'You must be logged in to play this game.',
            liveBets: [],
            myBets: []
        }
        this.getGame = this.getGame.bind(this)
        this.getActiveTab = this.getActiveTab.bind(this)
    }

    getBetInformation = async (id: string): Promise<BetOverviewResponse> => axiosGet(`/bet/${id}/general`)
    getGameInformation = async (key: string): Promise<GameInformationResponse> => axiosGet(`/game/${key}/info`)

    getGame(gameId: string) {
        switch(gameId) {
            case 'dice': {
                return (<>
                    <h2 className="MobilePadded">{this.state.title}</h2>
                    <DiceGame balance={this.props.balance} currency={this.props.currency} />
                    {this.getLiveBets()}
                </>)
            }
            case 'crash': {
                return (<>
                    <Crash balance={this.props.balance} username={this.props.username} currency={this.props.currency} />
                    {this.getLiveBets()}
                </>)
            }
            case 'slots': {
                return (<>
                    <h2 className="MobilePadded">{this.state.title}</h2>
                    <SlotsGame balance={this.props.balance} currency={this.props.currency} />
                    {this.getLiveBets()}
                </>)
            }
            case 'roulette': {                
                return (<>
                    <Roulette balance={this.props.balance} currency={this.props.currency} />
                    {this.getLiveBets()}
                </>)
            }
            default: {
                return (<div className="AltContainer" />)
            }
        }
    }

    getActiveTab(gameId: string) {
        switch (this.props.tab) {
            case 0: {
                return this.getGame(gameId)
            }
            case 1: {
                return <div className="Fairness">
                        <ProvablyFair ref={r => {
                            //@ts-ignore
                            this.provablyFair = r
                        }} clientSeed={this.props.clientSeed} changeSeed={this.props.changeSeed} setClientSeed={this.props.setClientSeed} verifying={this.state.verifying} />{this.getLiveBets()}
                    </div>
            }
        }
    }

    getLiveBets() {
        return (<div className="LiveBets">
            <div className="LiveBetsTabs">
                {/* @ts-ignore */}
                <Tabs>
                    {/* @ts-ignore */}
                    <div label="All Live Bets">
                        { this.getBetsTable(-1) }
                    </div>
                    {/* @ts-ignore */}
                    <div label="Dice Game">
                        { this.getBetsTable(1) }
                    </div>
                    {/* @ts-ignore */}
                    <div label="Crash">
                        { this.getBetsTable(2) }
                    </div>
                    {/* @ts-ignore */}
                    <div label="My Bets">
                        { this.getBetsTable(-2) }
                    </div>
                </Tabs>
            </div>
        </div>)
    }

    getBetsTable(game: number) {
        if (game === -2) {
            let liveBets: Array<any> = []
            if (this.state.myBets) {
                this.state.myBets.map((l: any) => {
                    liveBets.push(l)
                })
            }
            return (<div className="LiveBetsTable" key={this.state.myBets ? this.state.myBets.slice(0, 1)[0] ? this.state.myBets.slice(0, 1)[0].id : -1 : -1}>
                    <div className="LiveBetsTableHeaders">
                        <ul>
                            <li>Bet ID</li>
                            <li>User</li>
                            <li>Time</li>
                            <li>Bet</li>
                            <li>Multiplier</li>
                            <li>Result</li>
                            <li>Payout</li>
                        </ul>
                    </div>
                    <div className="LiveBetsTableBody">
                        {
                            liveBets.filter((l, i) => i < 10).map((l,id) => {
                                return (<ul className="SwitchboardValues" key={id} onClick={() => {
                                    window.alert('SwitchboardValues')
                                }}>
                                    <li>{l.id}</li>
                                    <li>{l.username}</li>
                                    <li>{new Date(l.time).toLocaleDateString()}</li>
                                    <li>{l.wager.toFixed(7)}</li>
                                    <li>{l.multiplier.toFixed(3)}</li>
                                    <li>{l.value}</li>
                                    <li>{l.earnings.toFixed(7)}</li>
                                </ul>)
                            })
                        }
                    </div>
                </div>
            )
        }
        let liveBets: Array<any> = []
        if (this.state.liveBets) {
            this.state.liveBets.map((l: any) => {
                if (game === -1) {
                    liveBets.push(l)
                } else if (game === l.game) {
                    liveBets.push(l)
                }
            })
        }
        return (<div className="LiveBetsTable">
                <div className="LiveBetsTableHeaders">
                    <ul>
                        <li>Bet ID</li>
                        <li>User</li>
                        <li>Time</li>
                        <li>Bet</li>
                        <li>Multiplier</li>
                        <li>Result</li>
                        <li>Payout</li>
                    </ul>
                </div>
                <div className="LiveBetsTableBody">
                    {
                        liveBets.filter((l, i) => i < 10).map((l, id) => {
                            return (<ul className="SwitchboardValues" key={id} onClick={() => {
                                this.setState({verifying: l}, () => {
                                    this.props.switchTab(1, () => {
                                        if (this.provablyFair) {
                                            //@ts-ignore
                                            this.provablyFair.forceProofTab()
                                        }
                                    })
                                })
                            }}>
                                <li>{l.id}</li>
                                <li>{l.username}</li>
                                <li>{new Date(l.time).toLocaleDateString()}</li>
                                <li>{l.wager.toFixed(7)}</li>
                                <li>{l.multiplier.toFixed(3)}</li>
                                <li>{l.value}</li>
                                <li>{l.earnings.toFixed(7)}</li>
                            </ul>)
                        })
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        // @ts-ignore
        let id = this.props.match.params.game
        this.getGameInformation(id).then(r => {
            this.setState({title: r.title})

            const client = new EventSource("https://betsse.onyxtechnology.co.uk/api/wallet/live_bets");
            client.addEventListener("live_bets",jmsevent => {
                if (jmsevent.data === 'keep-alive') return;
                this.getBetInformation(jmsevent.data).then((bet: BetOverviewResponse) => {
                    let newBets = []
                    newBets.push(bet)
                    this.state.liveBets.map((b: BetOverviewResponse) => { newBets.push(b) })
                    if (newBets.length > 10) {
                        newBets = newBets.slice(0, 10)
                    }
                    if (bet.username === this.props.username) {
                        let myNewBets = []
                        myNewBets.push(bet)
                        this.state.myBets.map((b: BetOverviewResponse) => { myNewBets.push(b) })
                        this.setState({myBets: myNewBets})
                    }
                    this.setState({liveBets: newBets})
                })
            })
        }).catch(e => this.setState({title: e.response.status === 403 ? 'You must be logged in to play this game.' :  '404: Game Not Found.'}))
    }

    render() {
        /** Search function check */
        if (this.props.searching) {
            return (<>
                <Header pageTitle="Games" currency={this.props.currency ? this.props.currency : ''} setBalance={this.props.setBalance} balance={this.props.balance} tab={this.props.tab} switchTab={this.props.switchTab} active={this.props.activeHeader} searching={this.props.searching} toggleSearch={this.props.toggleSearch}
                        username={this.props.username} openLoginModal={this.props.openLoginModal}
                        options={this.props.options} opacity={this.props.headerOpacity}
                        pageLoadedAt={this.props.pageLoadedAt}/>
                <OnlineGamesSearch/>
                </>)
        }
        // @ts-ignore
        let id = this.props.match.params.game
        if (!this.props.username) {
            return (
                <>
                    { this.getHeader(2, "Games", this.props.options) }
                    <div className="BetlockerSplash HeadingSpace">
                        <div className="GameContainer" style={{backgroundImage: `url(/assets/games/online/${id}/background.jpeg)`}}>
                            <div className="AltContainer MobilePadded">
                                <h2>{this.state.title}</h2>
                            </div>
                            <Footer />
                        </div>
                    </div>
                </>
            );
        }
        return (
            <>
                { this.getHeader(2, "Games", this.props.options) }
                <div className="BetlockerSplash HeadingSpace">
                    <div className="GameContainer" style={{backgroundImage: `url(/assets/games/online/${id}/background.jpeg)`}}>
                        { this.getActiveTab(id) }
                        <Footer />

                    </div>
                </div>
            </>
        );
    }

    getHeader(tab: number, title: string, options: Array<NavigationOption>) {
        return (<Header pageTitle={title}
                        active={tab}
                        tab={this.props.tab}
                        switchTab={this.props.switchTab}
                        setBalance={this.props.setBalance}
                        balance={this.props.balance}
                        searching={this.props.searching}
                        toggleSearch={this.props.toggleSearch}
                        username={this.props.username}
                        openLoginModal={this.props.openLoginModal}
                        options={options}
                        opacity={this.props.headerOpacity}
                        currency={this.props.currency ? this.props.currency : 'GBP'}
                        pageLoadedAt={this.props.pageLoadedAt}
        />)
    }
}

export default Game;