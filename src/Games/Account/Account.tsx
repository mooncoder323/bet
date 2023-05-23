import React, {Component} from 'react';
import '../../Assets/css/Games.scss';
import Footer from "../../Components/Footer/Footer";
import {Offer} from "../../Components/Offer/Offer";
import AccountOverview from "./Overview/AccountOverview";
import Wallet from "./Wallet";
import AccountActivity from "./Activity/AccountActivity";
import AccountHistory from "./History/AccountHistory";
import AccountSettings from "./Settings/AccountSettings";

type AccountProps = {
    activeTab: number
    offers: Array<Offer>
    username: string
    balance: number
    currency?: string
}

class Account extends Component<AccountProps, any> {

    constructor(props: AccountProps) {
        super(props);
        this.state = {
        }
        this.getActiveTab = this.getActiveTab.bind(this)
    }

    getActiveTab() {
        switch (this.props.activeTab) {
            /* Overview */
            case 0: {
                return (
                    <>
                        <AccountOverview username={this.props.username} currency={this.props.currency} balance={this.props.balance} />
                    </>)
            }
            /* Wallet */
            case 1: {
                return (
                    <>
                        <Wallet pendingRequest={false} balance={20} />
                    </>)
            }
            /* Activity */
            case 2: {
                return (<>
                    <AccountActivity />
                </>)
            }
            /* History */
            case 3: {
                return (<>
                    <AccountHistory currency={this.props.currency} />
                </>)
            }
            /* Settings */
            case 4: {
                return (<>
                    <AccountSettings username={this.props.username} />
                </>)
            }
        }
    }

    render() {
        return (
            <div className="BetlockerSplash">
                <div className="top-banner">
                    {
                        this.getActiveTab()
                    }
                    <Footer />
                </div>
            </div>
        );
    }
}

export default Account;