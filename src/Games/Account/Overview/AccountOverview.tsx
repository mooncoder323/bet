import React, {Component} from 'react';
import {axiosGet} from "../../../Utilities/HTTPClient";
import Timeline from "../../../Components/Timeline/Timeline";

import '../../../Assets/css/Account.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Metric from "./Metric";
import {LineChartMetric} from "../LineChartMetric";
import {faCircle, faDollarSign, faGamepad} from "@fortawesome/free-solid-svg-icons";
import {AccountOverviewResponse} from "../../../API/Account/AccountOverviewResponse";
import {getLoadingBar} from "../../../Utilities/LoadingBar";
import moment from "moment";
import {currencies} from "../../../Utilities/Currencies";

type OverviewState = {
    overview?: AccountOverviewResponse
}

type OverviewProps = {
    username: string
    balance: number
    currency?: string
}

class AccountOverview extends Component<OverviewProps, OverviewState> {

    constructor(props: any) {
        super(props)
        this.state = {

        }
    }

    getAccountOverview = async (): Promise<AccountOverviewResponse> => axiosGet(`/admin/auth/overview`)

    componentDidMount() {
        this.getAccountOverview().then((overview: AccountOverviewResponse) => {
            this.setState({overview: overview})
        })
    }

    render() {
        if (!this.props.currency || !this.state.overview) {
            return (<div className="AltContainer">
                <div className="AccountOverview">
                    {
                        getLoadingBar(true, "Fetching Account Information...")
                    }
                </div>
            </div>)
        }
        return (<div className="AltContainer">
                <div className="AccountOverview">
                    <div className="RecentActivity">
                        <h3 style={{fontSize: '21px', padding:'16px'}}>Recent Activity</h3>
                        <Timeline recentActivity={this.state.overview.recentActivity} />
                    </div>
                    <div className="Balance">
                        <div className="BalanceHeader">
                            <div className="BalanceTotal">
                                <ul>
                                    <li><span className="Heading">Net Balance</span><span> {currencies.get(this.props.currency)!!.symbol}{this.state.overview.netBalance.toFixed(2)}</span></li>
                                    <li><span className="Heading">Total Balance</span><span>{currencies.get(this.props.currency)!!.symbol}{this.props.balance.toFixed(2)}</span></li>
                                </ul>
                            </div>
                            <div className="BalanceBreakdown">
                                <ul>
                                    <li><span className="Heading">In Wallet</span><span>{currencies.get(this.props.currency)!!.symbol}{this.state.overview.availableBalance.toFixed(2)}</span></li>
                                    <li><span className="Heading">In Fills</span><span>{currencies.get(this.props.currency)!!.symbol}{this.state.overview.fillsBalance.toFixed(2)}</span></li>
                                </ul>
                            </div>
                        </div>
                        <div className="OverviewDetails">
                            <div className="AccountOffer">
                                <div className="AccountOfferShadow">
                                    <div className="offer-banner__header-container">
                                        <span className="offer-banner__header-text">Get £10 in free bets on your first deposit!</span>
                                        <span className="offer-banner__sub-header-text">Terms & Conditions apply</span>
                                    </div>
                                    <br />
                                    <div className="offer-banner__button-container">
                                        <button >Deposit Now</button>
                                    </div>
                                </div>
                            </div>
                            <div className="AccountOverviewStats">
                                <ul>
                                    <li><span>Name</span><span>Adil</span></li>
                                    <li><span>Status</span><span className={`StatusSymbol ${this.state.overview.status == 'Offline' ? '' : 'online'}`}><FontAwesomeIcon className={`StatusSymbol ${this.state.overview.status == 'Offline' ? '' : 'online'}`} icon={faCircle}/>{this.state.overview.status}</span></li>
                                    <li><span>Total Online Time</span><span>{moment.utc(this.state.overview.onlineTime).format('HH:mm:ss')}</span></li>
                                    <li><span>Net Withdraws</span><span>{currencies.get(this.props.currency)!!.symbol}{this.state.overview.netWithdrawals}</span></li>
                                </ul>
                                <div className='Metrics row m-0 p-0'>
                                    <Metric
                                        title="Balance"
                                        value={currencies.get(this.props.currency)!!.symbol + this.props.balance.toFixed(2)}
                                        highlight={this.state.overview.balanceChange}
                                        icon={faDollarSign}
                                        keys={["high", "low", "open", "close"]}
                                    />
                                    <LineChartMetric
                                        recentWins={this.state.overview.wagers}
                                        keys={["high", "low", "open", "close"]}
                                    />
                                    <Metric
                                        title="Net Balance"
                                        value={currencies.get(this.props.currency)!!.symbol + this.state.overview.netBalance.toFixed(2)}
                                        icon={faDollarSign}
                                        highlight={this.state.overview.netBalanceChange}
                                        keys={["high", "low", "open", "close"]}
                                    />
                                    <Metric
                                        title="Play Time"
                                        highlight={this.state.overview.playTimeChange}
                                        icon={faGamepad}
                                        value={moment.utc(this.state.overview.playTime).format('HH:mm:ss')}
                                        keys={["high", "low", "open", "close"]}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default AccountOverview;