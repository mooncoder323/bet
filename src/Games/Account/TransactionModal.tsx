import React, {Component, RefObject} from 'react';

import {TextField} from "@mui/material";
import {axiosPost} from "../../Utilities/HTTPClient";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {currencies, numberWithCommas} from "../../Utilities/Currencies";

type TransactionModalProps = {
    balance: number

    closeTransactionModal: any
    visibility: boolean
}

type ModalState = {
    stage: number
    transactionAmount?: string
    currency?: string
    type?: string
}

type TicketRequest = {
    type: string
    amount: number
    currency: string
}

class TransactionModal extends Component<TransactionModalProps, ModalState> {

    constructor(props: TransactionModalProps) {
        super(props);
        this.state = {
            stage: 0,
        }
        this.getStage = this.getStage.bind(this)
    }

    createTicket = async (body: TicketRequest) => axiosPost(`/admin/auth/create-ticket`, body)

    getStage() {
        switch (this.state.stage) {
            case 0: {
                return (<>

                    <div className="RowHeader">
                        <div className="TransactionText Left">I wish to make a</div>
                    </div>
                    <fieldset id="group1">
                        <ul>
                            <li>
                                <input type="radio" id="f-option" name="selector" onChange={e => {
                                    this.setState({type: 'deposit'})
                                }} checked={this.state.type == 'deposit'} />
                                <label htmlFor="f-option">Deposit</label>

                                <div className="check"></div>
                            </li>

                            <li>
                                <input type="radio" id="s-option" name="selector" onChange={e => {
                                    this.setState({type: 'withdraw'})
                                }} checked={this.state.type == 'withdraw'} />
                                <label htmlFor="s-option">Withdrawal</label>

                                <div className="check">
                                    <div className="inside"></div>
                                </div>
                            </li>
                        </ul>
                    </fieldset>
                    <br/>
                    <div className="RowHeader">
                        <div className="TransactionText Left">in the currency</div>
                    </div>
                    <fieldset id="group2">
                        <ul>
                            <li>
                                <input type="radio" id="f-option2" name="selector2" onChange={e => {
                                    this.setState({currency: 'GBP'})
                                }} checked={this.state.currency == 'GBP'} />
                                <label htmlFor="f-option2">OSRS GP</label>

                                <div className="check"></div>
                            </li>

                            <li>
                                <input type="radio" id="s-option2" name="selector2" onChange={e => {
                                    this.setState({currency: 'EUR'})
                                }} checked={this.state.currency == 'EUR'} />
                                <label htmlFor="s-option2">RS3 GP</label>

                                <div className="check">
                                    <div className="inside"></div>
                                </div>
                            </li>
                        </ul>
                    </fieldset>
                    <br/>
                    <div className="RowHeader">
                        <div className="TransactionText Left">in the amount of</div>
                    </div>
                    <div className="FairnessCanvas">
                        <div className="CanvasRow">
                            <div className="RowHeader">
                                <div className="CanvasField">
                                    <div className="AmountField">
                                        <div className="Value" style={{width: '100%', paddingLeft: '30px'}}>
                                            {
                                                this.state.currency ?
                                                    <img src={`/assets/currencies/${currencies.get(this.state.currency)!!.img}`}
                                                                           className="Currency"/>
                                                    :
                                                    <p/>
                                            }
                                            <div className="ValueIcon RSGPInput">
                                                <input type="text" style={{ paddingLeft: '30px'}}
                                                       key={this.state.transactionAmount} onChange={(e: any) => {
                                                    //@ts-ignore
                                                    this.state.transactionAmount = e.target.value
                                                }} defaultValue={this.state.transactionAmount}/>
                                                <span>GP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <button className="Alt" onClick={() => {
                        this.props.closeTransactionModal()
                    }}>Cancel</button>
                    <button onClick={() => {
                        if (!this.state.transactionAmount) {
                            return
                        }
                        const value = this.state.transactionAmount.toLowerCase().trim().replaceAll(' ','').replaceAll(',','').replaceAll('.','')
                        var multiplier = 1.0
                        if (value.includes('m')) {
                            multiplier = 1000000
                        }
                        if (value.includes('k')) {
                            multiplier = 1000
                        }
                        const amount = Number(value.replaceAll('m', '').replaceAll('k', '')) * multiplier
                        if (amount > 0 && this.state.currency && this.state.type) {
                            this.setState({stage: 1})
                        }
                    }}>Next</button>

                </>)
            }
            case 1: {
                if (!this.state.transactionAmount) {
                    return
                }
                const value = this.state.transactionAmount.toLowerCase().trim().replaceAll(' ','').replaceAll(',','').replaceAll('.','')
                var multiplier = 1.0
                if (value.includes('m')) {
                    multiplier = 1000000
                }
                if (value.includes('k')) {
                    multiplier = 1000
                }
                const amount = Number(value.replaceAll('m', '').replaceAll('k', '')) * multiplier
                return (<>

                    <div className="FairnessCanvas">
                        <div className="CanvasRow">
                    <div className="RowHeader">
                        <div className="TransactionText Left">Please confirm the following</div>
                    </div>
                    <div className="RowHeader">
                        <h3 className="TransactionText ">You wish to make a {this.state.type} of {numberWithCommas(amount)} {this.state.currency} GP.</h3>
                    </div>
                    </div>
                    </div>

                    <button className="Alt" onClick={() => {
                        this.setState({stage: 0})
                    }}>Back</button>
                    <button onClick={() => {
                        if (!this.state.transactionAmount) {
                            return
                        }
                        const value = this.state.transactionAmount.toLowerCase().trim().replaceAll(' ','').replaceAll(',','').replaceAll('.','')
                        var multiplier = 1.0
                        if (value.includes('m')) {
                            multiplier = 1000000
                        }
                        if (value.includes('k')) {
                            multiplier = 1000
                        }
                        const amount = Number(value.replaceAll('m', '').replaceAll('k', '')) * multiplier
                        if (amount > 0 && this.state.currency && this.state.type) {
                            this.createTicket({
                                type: this.state.type,
                                currency: 'EUR',
                                amount: amount
                            }).then(r => {
                                console.log(r)
                                this.setState({stage: 2})
                            })
                        }
                    }}>Proceed</button>

                </>)
            }
            case 2: {
                return (<>

                    <div className="RowHeader">
                        <div className="TransactionText Left">Your request has been received. Please check your phone for alerts.</div>
                    </div>

                    <button onClick={() => {
                        this.setState({stage: 0})
                        this.props.closeTransactionModal()
                    }}>Close</button>

                </>)
            }
        }
    }

    render() {
        return (
            <div className="Modal Transaction" style={{visibility: this.props.visibility ? 'visible': 'hidden'}}>
                <div className="AltContainer TransactionModal">
                    {
                        this.getStage()
                    }
                </div>


            </div>
        );
    }
}

export default TransactionModal;