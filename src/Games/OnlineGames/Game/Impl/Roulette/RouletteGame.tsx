import React, { Component } from 'react';

import './Roulette.scss';
import DiceTabs from "../Dice/DiceTabs/DiceTabs";
import { currencies } from "../../../../../Utilities/Currencies";
import Roulette from "./Roulette";
import { axiosGet } from "../../../../../Utilities/HTTPClient";
import { Modal, Box, Typography, Button } from '@mui/material';

type Roulettes = {
    autoing?: boolean
    spinning?: boolean
    wagerId?: number
    wagerAmount: number
    stopOnMultiplier?: number
    skipUpdate?: boolean,
    bet_number: any,
    chip_value: string,
    current_chip: number,
    onWin: number,
    onWinIncreaseBy: number,
    onLoss: number,
    onLossIncreaseBy: number,
    stopOnLoss: number,
    stopOnWin: number,
    open: boolean
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4
};

const chip_list: Array<string> = ["10K", "100K", "1M", "10M", "100M", "10M", "100M", "1B", "10B", "100B"];

class RouletteGame extends Component<any, Roulettes> {

    private rouletteRef?: React.Ref<any>;
    private autoInterval?: NodeJS.Timer;

    constructor(props: any) {
        super(props);
        this.state = {
            wagerAmount: 0.02,
            bet_number: null,
            chip_value: "0",
            current_chip: 1,
            onWin: 0,
            onWinIncreaseBy: 0,
            onLoss: 0,
            onLossIncreaseBy: 0,
            stopOnLoss: 0,
            stopOnWin: 0,
            open: false
        }
        this.setStateOfParent.bind(this);
        this.handleClose.bind(this);
        this.handleOpen.bind(this);
    }

    wager = async (amount: number, gameParameters: string) => axiosGet(`/game/roulette/wager?&wager_amount=${amount}&wager_parameters=${gameParameters}`)

    setStateOfParent = (newAmount: number) => {
        this.setState({ ...this.state, wagerAmount: newAmount });
    }

    handleOpen = () => this.setState({ ...this.state, open: true });
    handleClose = () => this.setState({ ...this.state, open: false });


    render() {
        return (
            <div className="DiceGame grey_dark">
                <ul className="CrashGameContent">
                    <li className="Small">
                        <div className="Roulette-GameTabs">
                            <DiceTabs padding={15}>
                                {/*@ts-ignore*/}
                                <div label="Manual" className='grey_color'>
                                    {
                                        this.renderCrashOptions(0)
                                    }
                                </div>
                                {/*@ts-ignore*/}
                                <div label="Auto" className='grey_color'>
                                    {
                                        this.renderCrashOptions(1)
                                    }
                                </div>
                            </DiceTabs>
                        </div>
                    </li>
                    <li className="Large" style={{ padding: '0.5%', backgroundColor: "#2F4553" }}>
                        <Roulette ref={this.rouletteRef} setState={this.setStateOfParent} timer={1000} bet_number={this.state.bet_number ?? this.state.bet_number} chip_value={this.state.chip_value} />
                    </li>

                </ul>
                <div className="GameContentBar"></div>
            </div>);
    }

    renderCrashOptions(type: number) {
        let buttonState = ""
        return (<div>
            {/*@ts-ignore*/}
            <div width="730" className="CrashGameCanvas grey_color">
                <div className="CanvasRow">
                    <div className="ChipValue">
                        <div className="Left">Chip Value 0.0000001</div>
                        <div className='board grey_color1'>
                            <div className='left_arrow' onClick={() => this.setState({ ...this.state, current_chip: (this.state.current_chip - 1) % 3 ? (this.state.current_chip - 1) % 3 : 1 })}>{'<'}</div>
                            <div className='chip'>
                                {
                                    chip_list.map((ele, id) =>
                                        (id >= (this.state.current_chip - 1) * 5 && (this.state.current_chip) * 5 > id) ?
                                            <div className={`chip_area`} style={{ display: 'flex' }} id={ele} onClick={() => {
                                                this.setState({ ...this.state, chip_value: ele });
                                                chip_list.map(i => i === ele ? document.getElementById(ele)!.className = "chip_area select" : document.getElementById(i)!.className = "chip_area");
                                                ;
                                            }}>
                                                <img src='/assets/games/online/roulette/chip_orange.svg' className='chip_pad' />
                                                <div className='chip_text' style={id < 3 ? { color: 'white' } : { color: '#01fe81' }}>{ele}</div>
                                            </div> :
                                            <div className={`chip_area`} style={{ display: 'none' }} id={ele} onClick={() => {
                                                this.setState({ ...this.state, chip_value: ele });
                                                chip_list.map(i => i === ele ? document.getElementById(ele)!.className = "chip_area select" : document.getElementById(i)!.className = "chip_area");
                                                ;
                                            }}>
                                                <img src='/assets/games/online/roulette/1M.c5e35b7f002b6e6980dc9ff4188a9be7.svg' className='chip_pad' />
                                                <div className='chip_text'>{ele}</div>
                                            </div>
                                    )
                                }
                            </div>
                            <div className='right_arrow' onClick={() => this.setState({ ...this.state, current_chip: (this.state.current_chip + 1) % 3 ? (this.state.current_chip + 1) % 3 : 2 })}>{'>'}</div>
                        </div>
                    </div>
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
                                                }} defaultValue={this.state.wagerAmount.toFixed(2)} />
                                        }
                                    </div>
                                    <img src={this.props.usdMode ? '/assets/games/dollar-currency.svg' : "/assets/games/btc.svg"} className="Currency" />
                                </div>
                                <div className="Action" onClick={() => {
                                    if (this.state.wagerAmount > 0) {
                                        this.setState({ wagerAmount: this.state.wagerAmount / 2 })
                                    }
                                }}>½</div>
                                <a className="ValueDivider"></a>
                                <div className="Action" onClick={() => {
                                    if (this.state.wagerAmount > 0 && this.state.wagerAmount * 2 < this.props.balance) {
                                        this.setState({ wagerAmount: this.state.wagerAmount * 2 })
                                    }
                                }}>2x</div>
                                <a className="ValueDivider"></a>
                                <div className="Action" onClick={() => {
                                    if (this.props.balance > 0) {
                                        this.setState({ wagerAmount: this.props.balance })
                                    }
                                }}>max</div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    type === 1 ? this.getAutomaticForm() : <div />
                }
                <div className="CanvasRow">
                    <div className="RollDiceCanvas"><button className={buttonState} onClick={this.handleOpen}>Start</button>
                    </div>
                </div>
                <div className="CanvasRow">

                </div>
                <Modal
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Would you like to start betting with the current amount?
                        </Typography>
                        <Button variant="outlined" onClick={() => {
                            if (this.state.autoing) {
                                if (this.autoInterval) {
                                    clearInterval(this.autoInterval)
                                }
                                this.setState({ spinning: false, autoing: false })
                                return;
                            }
                            if (this.state.spinning) return
                            this.setState({ spinning: true }, () => {
                                if (type === 1) {
                                    this.setState({ autoing: true }, () => {
                                        this.autoInterval = setInterval(() => {
                                            //TODO
                                        }, 500)
                                    })
                                } else {
                                    this.placeBet()
                                }
                            })
                            this.handleClose();
                        }}>OK</Button>
                        <Button variant="contained" style={{marginLeft: 10}} onClick={this.handleClose}>Cancel</Button>
                    </Box>
                </Modal>
            </div>
        </div>)
    }

    placeBet() {
        this.wager(this.state.wagerAmount, "1").then(r => {
            this.setState({
                ...this.state,
                spinning: false,
                bet_number: r.roll
            })
        })
    }

    // getAutomaticForm() {
    //     return (
    //         <div className="CanvasRow">
    //             <div className="RowHeader">
    //                 <div className="Left">Stop on Multiplier</div>
    //             </div>
    //             <div className="RowHeader">
    //                 <div className="CanvasField">
    //                     <div className="AmountField">
    //                         <div className="IconValue">
    //                             <div className="ProfitValue">
    //                                 <input type="number" step="0.01" min={1.1} max={100} onChange={e => this.setState({ stopOnMultiplier: Number(e.target.value) })} defaultValue={this.state.stopOnMultiplier} />
    //                             </div>
    //                             <div className="ProfitCurrency"><img src="/assets/games/btc.svg" className="Currency" /></div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }
    getAutomaticForm() {
        return (<div>
            <div className="CanvasRow">
                <div className="RowHeader">
                    <div className="Left">Stop on Multiplier</div>
                </div>
                <div className="RowHeader">
                    <div className="CanvasField">
                        <div className="AmountField">
                            <div className="IconValue">
                                <div className="ProfitValue">
                                    <input type="number" step="0.01" min={1.1} max={100} onChange={e => this.setState({ stopOnMultiplier: Number(e.target.value) })} defaultValue={this.state.stopOnMultiplier} />
                                </div>
                                <div className="ProfitCurrency"><img src="/assets/games/btc.svg" className="Currency" /></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="LeftHalf MobileHalf">
                    <div className="RowHeader">
                        <div className="Left">On Win</div>
                    </div>
                    <div className="RowHeader">
                        <div className="CanvasField">
                            <div className="AmountField AmountFieldBigger">
                                <div className={this.state.onWin == 0 ? "AutoAction SelectedAction" : "AutoAction"} onClick={() => this.setState({ onWin: 0 })}>Reset</div>
                                <div className={this.state.onWin == 1 ? "AutoAction SelectedAction" : "AutoAction"} onClick={() => this.setState({ onWin: 1 })}>Increase by</div>
                                <div className="AutoActionValue">
                                    <div className="ValueIcon">
                                        <input type="number" step="1" min={1} max={10000} onChange={e => this.setState({ onWin: 1, onWinIncreaseBy: Number(e.target.value) })} defaultValue={this.state.onWinIncreaseBy} />
                                    </div>
                                    <img src="/assets/games/online/dice/percent.svg" className="Currency" />
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
                                <div className={this.state.onLoss == 0 ? "AutoAction SelectedAction" : "AutoAction"} onClick={() => this.setState({ onLoss: 0 })}>Reset</div>
                                <div className={this.state.onLoss == 1 ? "AutoAction SelectedAction" : "AutoAction"} onClick={() => this.setState({ onLoss: 1 })}>Increase by</div>
                                <div className="AutoActionValue">
                                    <div className="ValueIcon">
                                        <input type="number" step="1" min={1} max={100} onChange={e => this.setState({ onLoss: 1, onLossIncreaseBy: Number(e.target.value) })} defaultValue={this.state.onLossIncreaseBy} />
                                    </div>
                                    <img src="/assets/games/online/dice/percent.svg" className="Currency" />
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
                                        <input type="number" step=".000001" min={0} max={100} onChange={e => this.setState({ stopOnWin: Number(e.target.value) })} defaultValue={this.state.stopOnWin} />
                                    </div>
                                    <div className="ProfitCurrency"><img src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`} className="Currency" /></div>
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
                                    <input type="number" step=".000001" min={0} max={100} onChange={e => this.setState({ stopOnLoss: Number(e.target.value) })} defaultValue={this.state.stopOnLoss} />
                                    <div className="ProfitCurrency"><img src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`} className="Currency" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default RouletteGame;