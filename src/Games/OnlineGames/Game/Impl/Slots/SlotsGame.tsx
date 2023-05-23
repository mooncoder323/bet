import React, {Component} from 'react';

import './Slots.scss'
import DiceTabs from "../Dice/DiceTabs/DiceTabs";
import {currencies} from "../../../../../Utilities/Currencies";
import Slots from "./Slots";
import {axiosGet} from "../../../../../Utilities/HTTPClient";

type SlotsState = {
    payLines: number,
    autoing?: boolean
    spinning?: boolean
    wagerId?: number
    wagerAmount: number
    stopOnMultiplier?: number
    skipUpdate?: boolean
    participants: Array<any>
}

class SlotsGame extends Component<any, SlotsState> {

    private slotsRef?: React.Ref<any>;
    private autoInterval?: NodeJS.Timer;

    constructor(props: any) {
        super(props);
        this.state = {
            payLines: 1,
            wagerAmount: 0.02,
            participants: [],
        }
    }

    wager = async (amount: number, payLineCount: number) => axiosGet(`/game/slots/wager?&wager_amount=${amount}&wager_parameters=${payLineCount}`)

    render() {
        return (
            <div className="DiceGame">
                <ul className="CrashGameContent">
                    <li className="Small">

                        <div className="DiceGame-GameTabs">
                            <DiceTabs>
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
                    <li className="Large" style={{padding: '2%'}}>
                            <Slots ref={this.slotsRef} timer={1000} />
                    </li>

                </ul>
                <div className="GameContentBar"></div>
            </div>);
    }

    renderCrashOptions(type: number) {
        let buttonState = ""
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
                                    <img src={this.props.usdMode ? '/assets/games/dollar-currency.svg' : "/assets/games/btc.svg"} className="Currency"/>
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
                        if (this.state.autoing) {
                            if (this.autoInterval) {
                                clearInterval(this.autoInterval)
                            }
                            this.setState({spinning: false, autoing: false})
                            return;
                        }
                        if (this.state.spinning) return
                        this.setState({spinning: true}, () => {
                            if (type == 1) {
                                this.setState({autoing: true}, () => {
                                    this.autoInterval = setInterval(() => {
                                        //TODO
                                    }, 500)
                                })
                            } else {
                                this.placeBet()
                            }
                        })
                    }}>Spin</button>
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
                            this.state.participants.map((p: any, id) => {
                                return (<ul key={id}>
                                    <li>{p.name}</li>
                                    <li>
                                            <span className="dRrTFD positive">
                                                <img src="/assets/games/btc.svg" className="eiogy Currency" />
                                                <span className="ixoRjG">{p.amount}</span>
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
        this.wager(this.state.wagerAmount, this.state.payLines).then(r => {
            if (r.result == -1) {
                window.alert('Bet failed')
            }
        })
    }

    getAutomaticForm() {
        return (
        <div className="CanvasRow">
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
                            <div className="ProfitCurrency"><img src="/assets/games/btc.svg" className="Currency"/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default SlotsGame;