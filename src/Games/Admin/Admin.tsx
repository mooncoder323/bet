import React, {Component} from 'react';
import {AccountBalance} from "../../API/Account/AccountInformationResponse";
import {LivefeedWager, PlatformStatistics} from "../../API/PlatformStatistics";
import LandingHeader from "../../Components/Header/LandingHeader";
import LandingFeed from "../../Components/Landing/LandingFeed";
import {currencies, numberWithCommas} from "../../Utilities/Currencies";
import {gambleResponsiblyAwareness} from "../../SaferGambling/Safety";
import Footer from "../../Components/Footer/Footer";
import {axiosGet} from "../../Utilities/HTTPClient";
import {getLoadingBar} from "../../Utilities/LoadingBar";
import Carousel from "../../Components/Carousel/Carousel";
import {getOffers} from "../../Offers/Offers";
import Header, {NavigationOption} from "../../Components/Header/Header";
import Metric from "../Account/Overview/Metric";
import {faDollarSign, faUserCog, faUsers} from "@fortawesome/free-solid-svg-icons";
import Tabs from "../../Components/Tabs/Tabs";

type LandingProps = {
    activeTab: number
    headerOpacity: number
    searching: boolean
    options: Array<NavigationOption>
    balance: number
    activeHeader: number
    tab: number
    balances?: Array<AccountBalance>
    username?: string
    currency?: string

    pageLoadedAt: Date
    switchTab: any
    setBalance: any
    toggleSearch: any
    openLoginModal: any
}

type LandingState = {
    sessionCode?: string
    players?: string
}

class Admin extends Component<LandingProps, LandingState> {

    constructor(props: LandingProps) {
        super(props);
        this.state = {

        }
        this.getActiveTab = this.getActiveTab.bind(this)
    }
    
    sessionCode = async (): Promise<string> => axiosGet(`/admin/backend/code`)
    playersOnline = async (): Promise<string> => axiosGet(`/admin/backend/players-online`)

    getActiveTab() {
        switch (this.props.activeTab) {
            /* Dashboard */
            case 0: {
                return (<>
                    <div className="AltContainer AdminDashboard">
                        <div className='Metrics row m-0 p-0'>
                        <Metric
                            title="Players Online"
                            value={"100"}
                            icon={faUsers}
                            highlight={"0"}
                            keys={["high", "low", "open", "close"]}
                        />
                        <Metric
                            title="Staff Online"
                            value={"100"}
                            icon={faUserCog}
                            highlight={"0"}
                            keys={["high", "low", "open", "close"]}
                        />
                    </div>
                    </div>
                </>)
            }
            /* Players Online */
            case 1: {
                return (<>
                    <div key="players" className="AccountSettings" style={{marginTop: '-150px'}}>
                        <div className="SettingsTabs">
                            <Tabs>
                                {/* @ts-ignore */}
                                <div label="Online">
                                    <div className="AltContainer">
                                    </div>
                                </div>
                                {/* @ts-ignore */}
                                <div label="Banned">
                                    <div className="AltContainer">
                                    </div>
                                </div>
                                {/* @ts-ignore */}
                                <div label="Timedout">
                                    <div className="AltContainer">
                                    </div>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                </>)
            }
            /* Tickets */
            case 2: {
                return (<>
                    <div key="tickets" className="AccountSettings" style={{marginTop: '-150px'}}>
                        <div className="SettingsTabs">
                            <Tabs>
                                {/* @ts-ignore */}
                                <div label="Pending">
                                    <div className="AltContainer">
                                    </div>
                                </div>
                                {/* @ts-ignore */}
                                <div label="My Tickets">
                                    <div className="AltContainer">
                                    </div>
                                </div>
                                {/* @ts-ignore */}
                                <div label="Completed">
                                    <div className="AltContainer">
                                    </div>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                </>)
            }
        }
    }

    componentDidMount() {
        this.sessionCode().then((code: string) => {
            this.playersOnline().then((players: string) => {
                this.setState({sessionCode: code, players: players})
            }).catch(e => {
                //@ts-ignore
                window.location = 'http://localhost:3000'
            })
        }).catch(e => {
            //@ts-ignore
            window.location = 'http://localhost:3000'
        })
    }

    render() {
        if (!this.state.sessionCode) {
            return getLoadingBar(true, "Fetching Backend Information...")
        }
        return (
            <>
                { this.getHeader(2, "Admin", this.props.options) }
                <div className="BetlockerSplash HeadingSpace">
                    <div className="AdminContainer">
                        {
                            this.getActiveTab()
                        }
                        <Footer />
                    </div>
                </div>
            </>);
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

export default Admin;