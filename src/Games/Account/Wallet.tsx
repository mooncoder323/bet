import React, {Component} from 'react';
import {axiosGet} from "../../Utilities/HTTPClient";
import {AccountInformationResponse} from "../../API/Account/AccountInformationResponse";
import Timeline, {formatDateTime} from "../../Components/Timeline/Timeline";

import '../../Assets/css/Account.scss'
import {safelyNavigateToPage} from "../../Utilities/Tracking";
import Metric from "./Overview/Metric";
import {LineChartMetric} from "./LineChartMetric";
import {faDollarSign, faGamepad} from "@fortawesome/free-solid-svg-icons";
import Tabs from "../../Components/Tabs/Tabs";
import LoginModal from "../../Components/Login/LoginModal";
import TransactionModal from "./TransactionModal";
import {AccountOverviewResponse} from "../../API/Account/AccountOverviewResponse";
import {AccountTransactions} from "../../API/Account/AccountTransactions";
import {Transaction} from "../../API/Account/AccountHistoryResponse";
import {numberWithCommas} from "../../Utilities/Currencies";

type WalletProps = {
    pendingRequest: boolean
    balance: number
}

type WalletState = {
    changingSeed: boolean
    depositAmount: number
    transactionModal: boolean
    ticketModal: boolean
    deposits: Array<Transaction>
    withdrawals: Array<Transaction>
}

class Wallet extends Component<WalletProps, WalletState> {

    constructor(props: WalletProps) {
        super(props)
        this.state = {
            changingSeed: false,
            depositAmount: 0.001,
            transactionModal: false,
            ticketModal: false,
            deposits: [],
            withdrawals: []
        }
        this.closeTransactionModal = this.closeTransactionModal.bind(this)
    }

    getDeposits = async (): Promise<AccountTransactions> => axiosGet(`/admin/auth/deposits`)

    openTransactionModal() {
        this.setState({transactionModal: true})
    }

    closeTransactionModal() {
        this.setState({transactionModal: false})
    }

    openTicketModal() {
        this.setState({ticketModal: true})
    }

    getUI(type: number) {
        /* Withdrawals */
        if (type == 1) {
            return (<div></div>)
        }
        return (<div>
            <div className="TransactionHeader">
                <h3>Deposits</h3>
                <button onClick={() => this.openTransactionModal()}>Deposit</button>
            </div>
            <div className="TransactionHistory">
            <div className="TransactionTable" style={{marginTop: '-90px'}}>
            <div className="MetricSplash">
                <div className="MetricSplashFilter">
                    <div className='performance_title'>Pending Deposits
                    </div>
                    <select>
                        <option>All Time</option>
                    </select>
                </div>
                <div className="TableHeader">
                    <ul>
                        <li style={{width: '200px'}}>Date</li>
                        <li style={{width: '150px'}}>Currency</li>
                        <li style={{width: 'calc(100% - 550px)'}}>Amount</li>
                        <li style={{width: '150px'}}>Status</li>
                        <li style={{width: '150px'}}>Action</li>
                    </ul>
                </div>
                {
                    this.state.deposits.map((e, i) => {
                        return (<ul className="TableValueRow">
                            <li style={{width: '230px'}}>{formatDateTime(e.date)}</li>
                            <li style={{width: '150px'}}>{e.currency}</li>
                            <li style={{width: 'calc(100% - 500px)'}}>{numberWithCommas(e.amount)}</li>
                            <li style={{width: '150px'}} className="Status">{e.status}</li>
                            <li style={{width: '150px'}}>View</li>
                        </ul>)
                    })
                }
            </div>
            </div>
            </div>
        </div>)
    }

    componentDidMount() {
        this.getDeposits().then((r: AccountTransactions) => {
           this.setState({deposits: r.deposits})
        });
    }

    render() {
        return (<div className="AltContainer">
                <TransactionModal visibility={this.state.transactionModal} closeTransactionModal={this.closeTransactionModal} balance={this.props.balance}/>
                <div className="AccountSettings">
                    <div className="SettingsTabs">
                        <Tabs>
                            {/* @ts-ignore */}
                            <div label="Deposit">
                                <div className="AltContainer">
                                    {
                                        this.getUI(0)
                                    }
                                </div>
                            </div>
                            {/* @ts-ignore */}
                            <div label="Withdraw">
                                <div className="AltContainer">
                                    {
                                        this.getUI(1)
                                    }
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

export default Wallet;