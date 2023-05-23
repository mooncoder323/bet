import React, {Component} from 'react';
import {axiosGet} from "../../../../../Utilities/HTTPClient";
import CrashGameCanvas from "./CrashGameCanvas";

import './Crash.css';
import DiceTabs from "../Dice/DiceTabs/DiceTabs";
import {currencies} from "../../../../../Utilities/Currencies";

type CrashState = {
    gameId: number
    gameTime: number
    wagerId: number
    wagerAmount: number
    earnings: number
    crashed: number | boolean
    stopOnMultiplier: number
    defaultTimer: number
    participants: Array<any>
    roundHistory: Array<number>
    rolling?: boolean
    autoing?: boolean
    skipUpdate?: boolean
}

class Crash extends Component<any, CrashState> {

    private autoInterval?: NodeJS.Timer;

    constructor(props: any) {
        super(props);
        this.state = {
            gameId: -1,
            gameTime: 0,
            wagerId: -1,
            wagerAmount: 0.02,
            earnings: 0,
            participants: [],
            crashed: -1,
            stopOnMultiplier: 1.1,
            defaultTimer: -1,
            roundHistory: []
        }
        this.placeBet = this.placeBet.bind(this)
        this.setGameId = this.setGameId.bind(this)
        this.setWagerId = this.setWagerId.bind(this)
        this.getParticipants = this.getParticipants.bind(this)
        this.setParticipants = this.setParticipants.bind(this)
        this.setCrashed = this.setCrashed.bind(this)
        this.addRoundToHistory = this.addRoundToHistory.bind(this)
    }

    current = async () => axiosGet(`/game/crash-state`)
    placeWager = async (amount: number, gameId: number) => axiosGet(`/game/crash/wager?&wager_amount=${amount}&wager_parameters=${gameId}:wager`)
    withdrawWager = async () => axiosGet(`/game/crash/wager?&wager_amount=0&wager_parameters=${this.state.gameId}:withdraw`)

    setGameId(gameId: number) {
        this.setState({gameId: gameId, gameTime: Date.now() })
    }

    addRoundToHistory(value: number) {
        let roundHistory = [ value ]
        this.state.roundHistory.map(h => roundHistory.push(h))
        this.setState({roundHistory: roundHistory})
    }

    setCrashed(crashed: boolean) {
        this.setState({crashed: crashed})
    }

    setWagerId(wagerId: number) {
        this.setState({wagerId: wagerId})
    }

    setParticipants(participants: Array<any>) {
        this.setState({participants: participants})
    }

    getParticipants() {
        return this.state.participants
    }

    componentDidMount() {
        this.current().then(r => {
            if (Number(r.state) > -1) {
                // @ts-ignore
                this.state.defaultTimer = Number(r.state)
                r.currentBets.map((b: any) => {
                    if (b.name == this.props.username) {
                        // @ts-ignore
                        this.state.wagerId = b.multiplier > 0 ? -1 : 1
                        // @ts-ignore
                        this.state.crashed = -1
                    }
                })
            }
            this.setState({gameId: r.gameId, roundHistory: r.roundHistory, participants: r.currentBets})
        })
    }

    render() {
        return (
        <div className="DiceGame">
            <ul className="CrashGameContent">
                <li className="Small">

                    <div className="Crash-GameTabs">
                        <DiceTabs padding={10}>
                            {/*@ts-ignore*/}
                            <div label="Manual">
                                {
                                    this.renderCrashOptions(0)
                                }
                            </div>
                            {/*@ts-ignore*/}
                            <div label="Auto">
                                {
                                    this.renderCrashOptions(1)
                                }
                            </div>
                        </DiceTabs>
                    </div>
                </li>
                <li className="Large">
                    <div className="ChartCanvas" style={{ height: '100%', width: '100%' }}>
                        <CrashGameCanvas setParentGameId={this.setGameId}
                                         getParticipants={this.getParticipants}
                                         setParticipants={this.setParticipants}
                                         setWagerId={this.setWagerId}
                                         setParentCrashed={this.setCrashed}
                                         addRoundToHistory={this.addRoundToHistory}
                        />
                    </div>
                    <ul className="CrashRoundHistory">
                        {
                            this.state.roundHistory.map(score => {
                                return <li className={score > 2 ? "Positive" : ""}>{score}</li>
                            })
                        }
                    </ul>
                </li>

            </ul>
            <div className="GameContentBar"></div>
        </div>);
    }

    renderCrashOptions(type: number) {
        let buttonState = this.state.autoing || type == 1 ? "" : "Disabled"
        if (this.state.crashed != -1) {
            if (this.state.wagerId == -1) {
                buttonState = ""
            }
        } else if (this.state.gameId != -1 && this.state.wagerId != -1) {
            buttonState = ""
        }
        return (<div>
            {/*@ts-ignore*/}
            <div width="730" className="CrashGameCanvas">
                <div className="CanvasRow">
                    <div className="RowHeader">
                        <div className="Left">Bet Amount</div>
                        <div
                            className="Right">{currencies.get(this.props.currency)!!.symbol + this.state.wagerAmount.toFixed(2)}</div>
                    </div>
                    <div className="RowHeader">
                        <div className="CanvasField">
                            <div className="AmountField">
                                <div className="Value">
                                    <div className="ValueIcon">
                                        {
                                            <input type="number" step=".01" min={0} max={1000}
                                                   key={this.state.wagerAmount} onChange={(e: any) => {
                                                this.setState({
                                                    wagerAmount: Number(e.target.value),
                                                    skipUpdate: true
                                                })
                                            }} defaultValue={this.state.wagerAmount.toFixed(2)}/>
                                        }
                                    </div>
                                    <img src={`/assets/currencies/${currencies.get(this.props.currency ? this.props.currency : 'USD')!!.img}`} className="Currency"/>
                                </div>
                                <div className="Action" onClick={() => {
                                    if (this.state.wagerAmount > 0) {
                                        this.setState({wagerAmount: this.state.wagerAmount / 2})
                                    }
                                }}>½</div>
                                <a className="ValueDivider"></a>
                                <div className="Action" onClick={() => {
                                    if (this.state.wagerAmount > 0 && this.state.wagerAmount * 2 < this.props.balance) {
                                        this.setState({wagerAmount: this.state.wagerAmount * 2})
                                    }
                                }}>2x</div>
                                <a className="ValueDivider"></a>
                                <div className="Action" onClick={() => {
                                    if (this.props.balance > 0) {
                                        this.setState({wagerAmount: this.props.balance })
                                    }
                                }}>max</div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    type == 1 ? this.getAutomaticForm() : <div/>
                }
                <div className="CanvasRow">
                    <div className="RollDiceCanvas"><button className={buttonState} onClick={() => {
                        if (buttonState) return;
                        if (this.state.autoing) {
                            if (this.autoInterval) {
                                clearInterval(this.autoInterval)
                            }
                            this.setState({rolling: false, autoing: false})
                            return;
                        }
                        
                        if (this.state.rolling) return;
                        this.setState({rolling: true}, () => {
                            if (type == 1) {
                                this.setState({autoing: true}, () => {
                                    this.autoInterval = setInterval(() => {
                                        
                                        if (this.state.crashed != -1 && this.state.wagerId == -1) {
                                            this.placeBet()
                                        } else if (this.state.gameId != -1 && this.state.wagerId != -1) {
                                            let time_elapsed = (Date.now() - this.state.gameTime) / 1000.0
                                            let multiplier = 1.0024 * Math.pow(1.0718, time_elapsed)                                            
                                            if (multiplier >= this.state.stopOnMultiplier) {
                                                this.placeBet()
                                            }
                                        }
                                    }, 500)
                                })
                            } else {
                                this.placeBet()
                            }
                        })
                    }}>{this.state.autoing ? "Stop Autoing" : type == 1 ? ("Automate rounds") :  (this.state.crashed != -1 ? (this.state.wagerId == -1 ? "Bet" : "Waiting...") : this.state.wagerId == -1 ? "Waiting..." : "Withdraw")}</button>
                    </div>
                </div>
                <div className="CanvasRow">
                    <div className="CrashParticipants">
                        <ul className="Headers">
                            <li>Name</li>
                            <li>Amount</li>
                            <li>Multiplier</li>
                        </ul>
                        {
                            this.state.participants.map((p: any) => {
                                return (<ul>
                                    <li>{p.name}</li>
                                    <li>
                                            <span className="dRrTFD positive">
                                                <img
                                                    src={`/assets/currencies/${currencies.get(p.currency ? p.currency : 'USD')!!.img}`} className="eiogy Currency" />
                                                <span className="ixoRjG">{Number(p.amount).toFixed(2)}</span>
                                            </span>
                                    </li>
                                    <li>
                                        <span className="ixoRjG">{p.multiplier ? Number(p.multiplier).toFixed(2) + 'x' : '-'}</span>
                                    </li>
                                </ul>)
                            })
                        }
                    </div>
                </div>
            </div>
        </div>)
    }

    placeBet() {
        if (this.state.gameId != -1 && this.state.wagerId == -1) {
            return;
        }
        
        let audio = new Audio("/assets/games/online/crash/bet.mp3")
        if (localStorage.getItem("mute-sounds") != "true")
        audio.play()
        if (this.state.wagerId != -1) {
            this.withdrawWager().then(r => {
                if (r.newBalance != -1) {
                    this.setState({gameId: -1})
                    //@ts-ignore
                    this.state.rolling = false
                    //@ts-ignore
                    this.state.wagerId = -1
                }
            })
        } else {
            this.placeWager(this.state.wagerAmount, this.state.gameId).then(r => {
                if (r.newBalance != -1) {
                    //@ts-ignore
                    this.state.wagerId = 1
                    //@ts-ignore
                    this.state.rolling = false
                }
            })
        }
    }

    getAutomaticForm() {
        return (<div className="CanvasRow">
            <div className="RowHeader">
                <div className="Left">Stop on Multiplier</div>
            </div>
            <div className="RowHeader">
                <div className="CanvasField">
                    <div className="AmountField">
                        <div className="IconValue">
                            <div className="ProfitValue">
                                <input type="number" step="0.01" min={1.1} max={100} onChange={e => this.setState({stopOnMultiplier: Number(e.target.value)})} defaultValue={this.state.stopOnMultiplier} />
                            </div>
                            <div className="ProfitCurrency"><img
                                src={`/assets/currencies/${currencies.get(this.props.currency ? this.props.currency : 'USD')!!.img}`} className="Currency"/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default Crash;