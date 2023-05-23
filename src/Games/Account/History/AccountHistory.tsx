import React, {Component} from 'react';
import {axiosGet} from "../../../Utilities/HTTPClient";
import {AccountHistoryResponse} from "../../../API/Account/AccountHistoryResponse";
import {getLoadingBar} from "../../../Utilities/LoadingBar";
import {formatDateTime} from "../../../Components/Timeline/Timeline";
import {currencies} from "../../../Utilities/Currencies";

type HistoryState = {
    history?: AccountHistoryResponse
}

class AccountHistory extends Component<any, HistoryState> {

    constructor(props: any) {
        super(props);
        this.state = {}
    }

    getAccountHistory = async (): Promise<AccountHistoryResponse> => axiosGet(`/admin/auth/history`)

    componentDidMount() {
        this.getAccountHistory().then((history: AccountHistoryResponse) => {
            this.setState({history: history})
        }).catch(e => {
            //@ts-ignore
            window.location.href = 'http://localhost:3000/'
        })

    }

    render() {
        if (!this.state.history) {
            return (
                <div className="AltContainer">
                    <div className="AccountActivity">
                        {getLoadingBar(true, "Fetching Information...")
                        }
                    </div>
                </div>)
        }
        return (
            <div className="AltContainer">

                <div className="TransactionHistory">
                    <div className="TransactionTable">
                        <div className="MetricSplash">
                            <div className="MetricSplashFilter">
                                <div className='performance_title'>Transaction History
                                </div>
                                <select>
                                    <option>All Time</option>
                                </select>
                            </div>
                            <div className="TableHeader">
                                <ul>
                                    <li style={{width: '200px'}}>Date</li>
                                    <li style={{width: 'calc(100% - 800px)'}}>Description</li>
                                    <li style={{width: '150px'}}>Amount</li>
                                    <li style={{width: '150px'}}>Status</li>
                                    <li style={{width: '300px'}}>Balance Change</li>
                                </ul>
                            </div>
                            {
                                this.state.history.transactions.map((e, i) => {
                                    return (<ul className="TableValueRow">
                                        <li style={{width: '230px'}}>20th March 2023</li>
                                        <li style={{width: 'calc(100% - 650px)'}}>Withdrawal of balance.</li>
                                        <li style={{width: '150px'}}>£30.29</li>
                                        <li style={{width: '150px'}} className="Status">Pending</li>
                                        <li style={{width: '300px'}}>£0.00 <span>£-30.29</span></li>
                                    </ul>)
                                })
                            }
                        </div>

                        <div className="MetricSplash">
                            <div className="MetricSplashFilter">
                                <div className='performance_title'>Wager History
                                </div>
                                <select>
                                    <option>All Time</option>
                                </select>
                            </div>
                            <div className="TableHeader">
                                <ul>
                                    <li style={{width: '200px'}}>Date</li>
                                    <li style={{width: 'calc(100% - 800px)'}}>Game</li>
                                    <li style={{width: '150px'}}>Amount</li>
                                    <li style={{width: '150px'}}>Result</li>
                                    <li style={{width: '300px'}}>Balance Change</li>
                                </ul>
                            </div>
                            {
                                this.state.history.wagers.reverse().map((wager, i) => {
                                    return (<ul className="TableValueRow">
                                        <li style={{width: '230px'}}>{ formatDateTime(wager.date) }</li>
                                        <li style={{width: 'calc(100% - 650px)'}}>{wager.game}</li>
                                        <li style={{width: '150px'}}>{currencies.get(this.props.currency)!!.symbol}{wager.amount}</li>
                                        <li style={{width: '150px'}} className={`Status ${wager.change > 0 ? 'Success' : 'Error'}`}>{wager.change > 0 ? 'Won' : 'Lost'}</li>
                                        <li style={{width: '300px'}}>{currencies.get(this.props.currency)!!.symbol}{wager.newBalance.toFixed(2)} <span className={`${wager.change > 0 ? 'Success' : 'Error'}`}>{wager.change < 0 ? '-' : ''}{currencies.get(this.props.currency)!!.symbol}{(wager.change * (wager.change < 0 ? -1 : 1)).toFixed(2)}</span></li>
                                    </ul>)
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default AccountHistory;