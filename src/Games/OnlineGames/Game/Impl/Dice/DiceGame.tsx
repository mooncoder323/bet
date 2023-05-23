import React, {Component, RefObject} from 'react';
import {DiceGameState} from "./DiceGameState";
import {SliderThumb} from "@mui/material";
import DiceTabs from "./DiceTabs/DiceTabs";
import './DiceGame.css';
import { LineChart, Line, ResponsiveContainer } from "recharts";
import {axiosGet} from "../../../../../Utilities/HTTPClient";
import {RollSlider, RollSliderLost, DifficultySlider, DifficultySliderReverse} from "./DifficultySlider";
import {currencies} from "../../../../../Utilities/Currencies";


function DifficultySliderThumbComponent(props: any) {
    const { children, ...other } = props;
    return (<SliderThumb {...other}>
        {children}
        <span className="airbnb-bar" />
        <span className="airbnb-bar" />
        <span className="airbnb-bar" />
    </SliderThumb>);
}

function RollSliderThumbComponent(props: any) {
    const { children, ...other } = props;
    return (
        <SliderThumb {...other}>
            {children}
            <img src="/assets/games/online/dice/dice.svg" width={50}/>
        </SliderThumb>
    );
}

class DiceGame extends Component<any, DiceGameState> {

    private slider: RefObject<HTMLInputElement>;
    private autoInterval?: NodeJS.Timer;

    constructor(props: any) {
        super(props);
        let threshold = 50.49
        let win = Math.round((100 - threshold + Number.EPSILON) * 100) / 100
        this.state = {
            balance: 0,
            rolling: false,
            rollOver: true,
            rollThreshold: threshold,
            multiplier: ( - ( 99 / ((threshold)+0.01-100))),
            winChance: win,
            w: Number(win.toFixed(1)),
            wagerAmount: 0.02,
            onWin: 0,
            onWinIncreaseBy: 0,
            onLoss: 0,
            onLossIncreaseBy: 0,
            stopOnLoss: 0,
            stopOnWin: 0,
            sessionProfit: 0,
            previousResult: null,
            rollHistory: [],
            earnings: 0,
            autoing: false,
            wonPrevious: false,
            wager: 0,
            wagered: 0,
            winningsData: [],
            lossesData: [],
            profit: 0,
            wins: undefined,
            losses: undefined
        }
        this.slider = React.createRef();
        this.calc = this.calc.bind(this)
        this.updateChart = this.updateChart.bind(this)
        this.renderDiceGame = this.renderDiceGame.bind(this)
        this.getDifficultySlider = this.getDifficultySlider.bind(this)
    }

    roll = async () => axiosGet(`/game/dice/wager?wager_amount=${this.state.wagerAmount}&wager_parameters=${this.state.rollOver + ":" + this.state.rollThreshold}`)

    render() {
        return (
            <div className="DiceGame">
                <ul className="GameContent">
                    <li className="Large">

                        <div className="DiceGame-GameTabs">
                            <DiceTabs>
                                {/*// @ts-ignore*/}
                                <div label="Manual">
                                    {
                                        this.renderDiceGame(0)
                                    }
                                </div>
                                {/*// @ts-ignore*/}
                                <div label="Auto">
                                    {
                                        this.renderDiceGame(1)
                                    }
                                </div>
                            </DiceTabs>
                        </div>

                    </li>
                    <div className="GameContentBar GameContentBarMobile">
                        {
                            this.getDifficultySlider(true)
                        }
                        <br />
                    </div>
                    <li className="Small">
                        <div className="DiceLiveStats">
                            <div className="Header">
                                <div className="LiveStatsRefreshIcon">
                                    <img src="/assets/games/online/dice/refresh.svg" width={12}/>
                                </div>
                                <div className="LiveStatsHeader">
                                    Live Stats
                                </div>
                                <div className="LiveStatsCloseIcon">
                                    <img src="/assets/games/online/dice/close.svg" width={14}/>
                                </div>
                            </div>
                            <div className="LiveStatsContent">
                                <div className="Wagers">
                                    <div className="FXjzv">
                                        <span className="DiceRow">
                                            <span className="HeadingColour">
                                                <span>Wagered</span>
                                            </span>
                                            <span className="ValueColour">
                                                <span color="unset" className="fIoMcB"></span>
                                                <span className="dRrTFD">
                                                    <img src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`} className="eiogy Currency"/>
                                                    <span className="ixoRjG">{Number(this.state.wagered).toFixed(2)}</span>
                                                </span>
                                            </span>
                                        </span>
                                        <span className="DiceRow">
                                            <span className="HeadingColour">
                                                <span>Profit</span>
                                            </span>
                                            <span className="ValueColour">
                                                <span className="kDRnKL positive"></span>
                                                <span className="dRrTFD positive">
                                                    <img src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`} className="eiogy Currency"/>
                                                    <span className="ixoRjG">{Number(this.state.profit).toFixed(2)}</span>
                                                </span>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="DiceGraph">
                                    <ResponsiveContainer width='100%' height='100%' aspect={3}>
                                        <LineChart width={300} height={100} data={this.state.winningsData}>
                                            <Line
                                                type='monotone'
                                                dataKey='earnings'
                                                dot={false}
                                                stroke='rgb(0, 228, 73)'
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="Total">
                                    <div className="FXjzv">
                                        <span className="DiceRowInline">
                                            <span className="HeadingColour">
                                                <span>Wins</span></span>
                                            <span className="ValueColour">
                                                <span color="unset" className="fIoMcB"></span>
                                                <span style={{ color: 'rgb(0, 228, 73)'}}> </span>
                                            </span>
                                        </span>
                                        <span className="DiceRowInline">
                                            <span className="HeadingColour">
                                                <span> </span>
                                            </span>
                                            <span className="ValueColour">
                                                <span color="unset" className="fIoMcB"></span>
                                                <span style={{ color: 'rgb(0, 228, 73)'}}>{this.state.wins ? this.state.wins : 0}</span>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div className="GameContentBar GameContentBarDesktop">
                    {
                        this.getDifficultySlider(false)
                    }
                    <br />
                </div>
            </div>
        );
    }


    getDifficultySlider(mobile: boolean) {
        return (<div className={`${mobile ? '' :'Full'} DifficultySlider`}>
            {this.state.previousResult ? this.state.wonPrevious ? <RollSlider
                ref={this.slider}
                slots={{thumb: RollSliderThumbComponent}}
                getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                defaultValue={this.state.previousResult}
                key={this.state.previousResult}
                valueLabelDisplay="on"
                onChange={(e) => {
                    this.setState({previousResult: null})
                }}
                marks={[{value: 0, label: '0',}, {value: 100, label: '100'}]}
            /> : <RollSliderLost
                ref={this.slider}
                slots={{thumb: RollSliderThumbComponent}}
                getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                defaultValue={this.state.previousResult}
                key={this.state.previousResult}
                valueLabelDisplay="on"
                onChange={(e) => {
                    this.setState({previousResult: null})
                }}
                marks={[{value: 0, label: '0',}, {value: 100, label: '100'}]}
            /> : this.state.rollOver ? <DifficultySlider
                ref={this.slider}
                slots={{thumb: DifficultySliderThumbComponent}}
                getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                defaultValue={this.state.rollThreshold - 1.99}
                onChange={(e: any) => {
                    let audio = new Audio("/assets/games/online/dice/scroll_bar_sound.mp3")
                    if (localStorage.getItem("mute-sounds") != "true")
                        audio.play()
                    // @ts-ignore
                    this.state.rollThreshold = Math.min(97.99, 1.99 + Number(e.target.value))
                    this.calc()
                }}
                marks={[{value: 0, label: '0',}, {value: 100, label: '100'}]}
            /> : <DifficultySliderReverse
                ref={this.slider}
                slots={{thumb: DifficultySliderThumbComponent}}
                getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                defaultValue={this.state.rollThreshold - 2}
                onChange={(e: any) => {
                    let audio = new Audio("/assets/games/online/dice/scroll_bar_sound.mp3")
                    if (localStorage.getItem("mute-sounds") != "true")
                        audio.play()
                    let rollThreshold = 2 + Number(e.target.value)
                    // @ts-ignore
                    this.state.rollThreshold = Math.min(98, rollThreshold)
                    this.calc()
                }}
                marks={[{value: 0, label: '0',}, {value: 100, label: '100'}]}
            />
            }
        </div>)
    }

    calc() {
        let win = this.state.rollOver ? Math.round((100 - this.state.rollThreshold + Number.EPSILON) * 100) / 100 : 100 - (100 - this.state.rollThreshold)
        this.setState({
            rollOver: this.state.rollOver,
            rollThreshold: this.state.rollThreshold,
            multiplier: this.state.rollOver ? ( - ( 99 / ((this.state.rollThreshold)+0.01-100))) : 99/this.state.rollThreshold,
            winChance: win,
            w: Number(win.toFixed(1))
        }, () => {
            //@ts-ignore
            this.slider.current.value = this.state.rollThreshold
        })
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        if (nextState.skipUpdate) {
            // return false
        }
        return true;
    }

    renderDiceGame(type: number) {
        return (<div>
            {/* @ts-ignore */}
            <div className="DiceGameCanvas DiceGameCanvasDesktop">
                <div className="CanvasRow">
                    <div className="LeftHalf">
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
                                            <input type="number" step=".01" min={0} max={1000}
                                                   key={this.state.wagerAmount} onChange={(e: any) => {
                                                this.setState({
                                                    wagerAmount: Number(e.target.value),
                                                    skipUpdate: true
                                                })
                                            }} defaultValue={this.state.wagerAmount.toFixed(2)}/>
                                        </div>
                                        <img src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`}
                                             className="Currency"/>
                                    </div>
                                    <div className="Action" onClick={() => {
                                        if (this.state.wagerAmount > 0) {
                                            this.setState({wagerAmount: this.state.wagerAmount / 2})
                                        }
                                    }}>½
                                    </div>
                                    <a className="ValueDivider"></a>
                                    <div className="Action" onClick={() => {
                                        if (this.state.wagerAmount > 0 && this.state.wagerAmount * 2 < this.props.balance) {
                                            this.setState({wagerAmount: this.state.wagerAmount * 2})
                                        }
                                    }}>2x
                                    </div>
                                    <a className="ValueDivider"></a>
                                    <div className="Action" onClick={() => {
                                        if (this.props.balance > 0) {
                                            this.setState({wagerAmount: this.props.balance})
                                        }
                                    }}>max
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="RightHalf">
                        <div className="RowHeader">
                            <div className="Left">Profit on Win</div>
                            <div
                                className="Right">{currencies.get(this.props.currency)!!.symbol + (this.state.wagerAmount * this.state.multiplier).toFixed(2)}</div>
                        </div>
                        <div className="RowHeader">
                            <div className="CanvasField">
                                <div className="AmountField">
                                    <div className="IconValue">
                                        <div
                                            className="ProfitValue">{(this.state.wagerAmount * this.state.multiplier).toFixed(2)}</div>
                                        <div className="ProfitCurrency"><img
                                            src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`}
                                            className="Currency"/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="CanvasRow Padded">
                    <div className="ThresholdList">
                        <div className="Threshold" onClick={() => {
                            let number = Math.round((100 - this.state.rollThreshold + Number.EPSILON) * 100) / 100
                            this.setState({rollThreshold: number, rollOver: !this.state.rollOver}, () => this.calc())
                        }}>
                            <div className="ThresholdRow">Roll {this.state.rollOver ? "Over" : "Under"}</div>
                            <div className="ThresholdRow">
                                <div className="ThresholdActionContainer">
                                    <div className="ThresholdAction">
                                        <span>{this.state.rollThreshold.toFixed(2)}</span>
                                    </div>
                                    <div className="ThresholdActionIcon">
                                        <img src="/assets/games/online/dice/rotate.svg"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="Threshold">
                            <div className="ThresholdRow">Multiplier</div>
                            <div className="ThresholdRow">
                                <div className="ThresholdActionContainer">
                                    <div className="ThresholdAction">
                                        <span>{this.state.multiplier.toFixed(4)}</span>
                                    </div>
                                    <div className="ThresholdActionIcon">
                                        <img src="/assets/games/online/dice/times.svg"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="Threshold">
                            <div className="ThresholdRow">Win Chance</div>
                            <div className="ThresholdRow">
                                <div className="ThresholdActionContainer">
                                    <div className="ThresholdAction">
                                        <span>{this.state.w.toFixed(4)}</span>
                                    </div>
                                    <div className="ThresholdActionIcon">
                                        <img src="/assets/games/online/dice/percent.svg"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    type == 1 ? this.getAutomaticForm() : <div/>
                }
                <div className="CanvasRow">
                    <div className="RollDiceCanvas">

                        {
                            this.getDiceButton(type)
                        }

                    </div>
                </div>
            </div>
            <div className="DiceGameCanvas DiceGameCanvasMobile">
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
                                        <input type="number" step=".01" min={0} max={1000} key={this.state.wagerAmount}
                                               onChange={(e: any) => {
                                                   this.setState({
                                                       wagerAmount: Number(e.target.value),
                                                       skipUpdate: true
                                                   })
                                               }} defaultValue={this.state.wagerAmount.toFixed(2)}/>
                                    </div>
                                    <img src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`}
                                         className="Currency"/>
                                </div>
                                <div className="Action" onClick={() => {
                                    if (this.state.wagerAmount > 0) {
                                        this.setState({wagerAmount: this.state.wagerAmount / 2})
                                    }
                                }}>½
                                </div>
                                <a className="ValueDivider"></a>
                                <div className="Action" onClick={() => {
                                    if (this.state.wagerAmount > 0 && this.state.wagerAmount * 2 < this.props.balance) {
                                        this.setState({wagerAmount: this.state.wagerAmount * 2})
                                    }
                                }}>2x
                                </div>
                                <a className="ValueDivider"></a>
                                <div className="Action" onClick={() => {
                                    if (this.props.balance > 0) {
                                        this.setState({wagerAmount: this.props.balance})
                                    }
                                }}>max
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="CanvasRow Inline">
                    <div className="LeftHalf">
                        <div className="RowHeader">
                            <div className="Left">Profit on Win</div>
                            <div
                                className="Right">{currencies.get(this.props.currency)!!.symbol + (this.state.wagerAmount * this.state.multiplier).toFixed(2)}</div>
                        </div>
                        <div className="RowHeader">
                            <div className="CanvasField">
                                <div className="AmountField">
                                    <div className="IconValue">
                                        <div
                                            className="ProfitValue">{(this.state.wagerAmount * this.state.multiplier).toFixed(2)}</div>
                                        <div className="ProfitCurrency"><img
                                            src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`}
                                            className="Currency"/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="RightHalf">
                        <div className="RowHeader">
                            <div className="Left">Roll {this.state.rollOver ? "Over" : "Under"}</div>
                        </div>
                        <div className="RowHeader">
                            <div className="CanvasField">
                                <div className="AmountField" onClick={() => {
                                    let number = Math.round((100 - this.state.rollThreshold + Number.EPSILON) * 100) / 100
                                    this.setState({
                                        rollThreshold: number,
                                        rollOver: !this.state.rollOver
                                    }, () => this.calc())
                                }}>
                                    <div className="IconValue">
                                        <div className="ProfitValue">
                                            <span>{this.state.rollThreshold.toFixed(2)}</span>
                                        </div>
                                        <div className="ProfitCurrency ProfitCurrencySmall">
                                            <img src="/assets/games/online/dice/rotate.svg"/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="CanvasRow Inline Padded">
                    <div className="LeftHalf">
                        <div className="RowHeader">
                            <div className="ThresholdRow">Multiplier</div>
                        </div>
                        <div className="RowHeader">
                            <div className="CanvasField">
                                <div className="AmountField">
                                    <div className="IconValue">
                                        <div className="ProfitValue">
                                            <span>{this.state.multiplier.toFixed(4)}</span>
                                        </div>
                                        <div className="ProfitCurrency ProfitCurrencySmall">
                                            <img src="/assets/games/online/dice/times.svg"/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="RightHalf">
                        <div className="RowHeader">
                            <div className="ThresholdRow">Win Chance</div>
                        </div>
                        <div className="RowHeader">
                            <div className="CanvasField">
                                <div className="AmountField">
                                    <div className="IconValue">
                                        <div className="ProfitValue">
                                            <span>{this.state.w.toFixed(4)}</span>
                                        </div>
                                        <div className="ProfitCurrency ProfitCurrencySmall">
                                            <img src="/assets/games/online/dice/percent.svg"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {
                    type == 1 ? this.getAutomaticForm() : <div/>
                }
                <div className="CanvasRow">
                    <div className="RollDiceCanvas">
                        {
                            this.getDiceButton(type)
                        }
                    </div>
                </div>
            </div>
        </div>)
    }

    getDiceButton(type: number) {
        return (
            <button onClick={() => {
                if (this.state.autoing) {
                    if (this.autoInterval) {
                        clearInterval(this.autoInterval)
                    }
                    this.setState({rolling: false, autoing: false})
                    return;
                }
                if (this.state.rolling) return
                this.setState({rolling: true}, () => {
                    if (type == 1) {
                        this.setState({autoing: true}, () => {
                            this.autoInterval = setInterval(() => {
                                this.placeBet()
                            }, 2500)
                        })
                    } else {
                        this.placeBet()
                    }
                })
            }}>{this.state.rolling ? (<div id="dice-wrapper">
                {/* @ts-ignore */}
                <input id="roll" name="roll" type="checkbox" checked="true"/>
                <div id="platform">
                    <div id="dice">
                        <div className="side front">
                            <div className="dot center"></div>
                        </div>
                        <div className="side front inner"></div>
                        <div className="side top">
                            <div className="dot dtop dleft"></div>
                            <div className="dot dbottom dright"></div>
                        </div>
                        <div className="side top inner"></div>
                        <div className="side right">
                            <div className="dot dtop dleft"></div>
                            <div className="dot center"></div>
                            <div className="dot dbottom dright"></div>
                        </div>
                        <div className="side right inner"></div>
                        <div className="side left">
                            <div className="dot dtop dleft"></div>
                            <div className="dot dtop dright"></div>
                            <div className="dot dbottom dleft"></div>
                            <div className="dot dbottom dright"></div>
                        </div>
                        <div className="side left inner"></div>
                        <div className="side bottom">
                            <div className="dot center"></div>
                            <div className="dot dtop dleft"></div>
                            <div className="dot dtop dright"></div>
                            <div className="dot dbottom dleft"></div>
                            <div className="dot dbottom dright"></div>
                        </div>
                        <div className="side bottom inner"></div>
                        <div className="side back">
                            <div className="dot dtop dleft"></div>
                            <div className="dot dtop dright"></div>
                            <div className="dot dbottom dleft"></div>
                            <div className="dot dbottom dright"></div>
                            <div className="dot center dleft"></div>
                            <div className="dot center dright"></div>
                        </div>
                        <div className="side back inner"></div>
                        <div className="side cover x"></div>
                        <div className="side cover y"></div>
                        <div className="side cover z"></div>
                    </div>
                </div>
            </div>) : this.state.autoing ? "Stop Rolling" : "Roll Dice"}</button>)
    }

    updateChart() {
        let total = this.state.rollHistory.length
        let won = 0
        let wagered = 0
        let profit = 0
        let winningsData: Array<any> = []
        let lossesData: Array<any> = []
        this.state.rollHistory.map(r => {
            wagered += r.wager
            if (r.earnings > 0) {
                winningsData.push({time: r.time, earnings: r.earnings})
                profit += r.earnings
                won++
            } else {
                lossesData.push({time: r.time, losses: r.earnings * -1})
            }
        })
        this.setState({
            wins: won,
            losses: total - won,
            wagered: wagered,
            profit: profit,
            winningsData: winningsData,
            lossesData: lossesData
        })
    }

    placeBet() {
        this.setState({rolling: true}, () => {
            let audio = new Audio("/assets/games/online/dice/Dice_Roll.mp3")
            if (localStorage.getItem("mute-sounds") != "true")
                audio.play()
            this.roll().then(r => {
                if (r.result == -1) {
                    if (this.state.autoing) {
                        this.setState({autoing: false})
                        if (this.autoInterval) {
                            clearInterval(this.autoInterval)
                        }
                    }
                    window.alert("Bet failed!")
                }
                let earnings = 0
                if (!r.won) {
                    earnings -= this.state.wagerAmount
                    this.setState({ rolling: false, earnings: this.state.earnings - (this.state.wagerAmount * this.state.multiplier)})
                } else {
                    earnings += (this.state.wagerAmount * this.state.multiplier)
                    this.setState({earnings: this.state.earnings + (this.state.wagerAmount * this.state.multiplier)})
                    let audio = new Audio("/assets/games/online/dice/win_sound.mp3")
                    if (localStorage.getItem("mute-sounds") != "true")
                        audio.play()
                }
                if (r.balance > 0) {
                    this.props.setBalance(r.newBalance)
                }
                this.state.rollHistory.push({time: new Date(), earnings: earnings, wager: this.state.wagerAmount});
                this.updateChart()
                if (this.state.autoing) {
                    let canRollAgain = true
                    if (r == -2 && this.state.onWin == 1 && this.state.onWinIncreaseBy > 0 && this.state.onWinIncreaseBy < 10000.00000000001) {
                        let multiplier = 1 + (this.state.onWinIncreaseBy / 100);
                        let nextWager = this.state.wagerAmount * multiplier
                        if (this.state.balance < nextWager) {
                            canRollAgain = false
                        } else {
                            this.setState({wagerAmount: nextWager})
                        }
                    } else if (r != -2 && this.state.onLoss == 1 && this.state.onLossIncreaseBy > 0 && this.state.onLossIncreaseBy < 10000.00000000001) {
                        let multiplier = 1 + (this.state.onLossIncreaseBy / 100);
                        let nextWager = this.state.wagerAmount * multiplier
                        if (this.state.balance < nextWager) {
                            canRollAgain = false
                        } else {
                            this.setState({wagerAmount: nextWager})
                        }
                    }
                    if (this.state.stopOnWin > 0 && this.state.stopOnWin < 100 && this.state.earnings >= this.state.stopOnWin) {
                        canRollAgain = false
                    }
                    if (this.state.stopOnLoss > 0 && this.state.stopOnLoss < 100 && this.state.earnings <= (this.state.stopOnLoss * -1)) {
                        canRollAgain = false
                    }
                    if (!canRollAgain) {
                        if (this.autoInterval) {
                            clearInterval(this.autoInterval)
                        }
                        this.setState({autoing: false})
                    }
                }
                this.setState({rolling: false, balance: r.newBalance < 0 ? this.state.balance : r.newBalance, previousResult: r.roll , wonPrevious: r.won })
            })
        })
    }

    getAutomaticForm() {
        return (<div>
            <div className="CanvasRow">
                <div className="LeftHalf MobileHalf">
                    <div className="RowHeader">
                        <div className="Left">On Win</div>
                    </div>
                    <div className="RowHeader">
                        <div className="CanvasField">
                            <div className="AmountField AmountFieldBigger">
                                <div className={this.state.onWin == 0 ? "AutoAction SelectedAction" : "AutoAction"} onClick={() => this.setState({onWin: 0})}>Reset</div>
                                <div className={this.state.onWin == 1 ? "AutoAction SelectedAction" : "AutoAction"} onClick={() => this.setState({onWin: 1})}>Increase by</div>
                                <div className="AutoActionValue">
                                    <div className="ValueIcon">
                                        <input type="number" step="1" min={1} max={10000} onChange={e => this.setState({onWin: 1, onWinIncreaseBy: Number(e.target.value)})} defaultValue={this.state.onWinIncreaseBy} />
                                    </div>
                                    <img src="/assets/games/online/dice/percent.svg" className="Currency"/>
                                </div>
                            </div>
                        </div>
                </div>
                </div>
                <div className="RightHalf MobileHalf">
                    <div className="RowHeader">
                        <div className="Left">On Loss</div>
                    </div>
                    <div className="RowHeader">
                        <div className="CanvasField">
                            <div className="AmountField AmountFieldBigger">
                                <div className={this.state.onLoss == 0 ? "AutoAction SelectedAction" : "AutoAction"} onClick={() => this.setState({onLoss: 0})}>Reset</div>
                                <div className={this.state.onLoss == 1 ? "AutoAction SelectedAction" : "AutoAction"} onClick={() => this.setState({onLoss: 1})}>Increase by</div>
                                <div className="AutoActionValue">
                                    <div className="ValueIcon">
                                        <input type="number" step="1" min={1} max={100} onChange={e => this.setState({onLoss: 1, onLossIncreaseBy: Number(e.target.value)})} defaultValue={this.state.onLossIncreaseBy} />
                                    </div>
                                    <img src="/assets/games/online/dice/percent.svg" className="Currency"/>
                                </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="CanvasRow Inline Padded">
                <div className="LeftHalf">
                    <div className="RowHeader">
                        <div className="Left">Stop on Profit</div>
                        <div className="Right">{currencies.get(this.props.currency)!!.symbol}0.00</div>
                    </div>
                    <div className="RowHeader">
                        <div className="CanvasField">
                            <div className="AmountField">
                                <div className="IconValue">
                                    <div className="ProfitValue">
                                        <input type="number" step=".000001" min={0} max={100} onChange={e => this.setState({stopOnWin: Number(e.target.value)})} defaultValue={this.state.stopOnWin} />
                                    </div>
                                    <div className="ProfitCurrency"><img src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`} className="Currency"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="RightHalf">
                    <div className="RowHeader">
                        <div className="Left">Stop on Loss</div>
                        <div className="Right">{currencies.get(this.props.currency)!!.symbol}0.00</div>
                    </div>
                    <div className="RowHeader">
                        <div className="CanvasField">
                            <div className="AmountField">
                                <div className="IconValue">
                                    <input type="number" step=".000001" min={0} max={100} onChange={e => this.setState({stopOnLoss: Number(e.target.value)})} defaultValue={this.state.stopOnLoss} />
                                    <div className="ProfitCurrency"><img src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`} className="Currency"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default DiceGame;