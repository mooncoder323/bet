import React, {Component} from 'react';
import {currencies, numberWithCommas} from "../../Utilities/Currencies";
import {axiosPost} from "../../Utilities/HTTPClient";
import {ChangeCurrencyRequest} from "../../API/Account/ChangeCurrencyRequest";
import {AccountBalance} from "../../API/Account/AccountInformationResponse";
import {safelyNavigateToPage} from "../../Utilities/Tracking";

type HeaderProps = {
    pageLoadedAt: Date
    openLoginModal: any
    username?: string
    balance: number
    balances?: Array<AccountBalance>
    currency: string
    online: number
}

type HeaderState = {
    currenciesDropdown: boolean
}

class LandingHeader extends Component<HeaderProps, HeaderState> {

    constructor(props: HeaderProps) {
        super(props);
        this.state = {
            currenciesDropdown: false
        }
    }

    setCurrency = async (body: ChangeCurrencyRequest) => axiosPost(`/admin/auth/set-primary-currency`, body)

    getAccountBar() {
        if (this.props.username) {
            return (<ul className="MainHeaderUser">
                <li className="MainHeaderUserLoggedIn">
                    <div className="CurrentBalance" onClick={() => this.setState({currenciesDropdown: !this.state.currenciesDropdown})}>
                        <img src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`} className="Currency" />
                        <span>{currencies.get(this.props.currency)!!.symbol}{this.props.balance.toFixed(2)}</span>

                        <i className="fa-duotone fa-square-chevron-down BalancesDropdown"></i>
                    </div>
                    <ul className={this.state.currenciesDropdown ? "Currencies" : "Currencies CurrentsToggled"}>
                        {
                            this.props.balances ? this.props.balances.map((balance: AccountBalance) => {
                                return (<li className="CurrentBalance" onClick={() => {
                                    this.setCurrency({currency:balance.currency}).then(r => {
                                        window.location.reload()
                                    }).catch(e => {
                                        window.location.reload()
                                    })
                                }}>
                                    <img src={`/assets/currencies/${currencies.get(balance.currency)!!.img}`} className="Currency" />
                                    <span>{currencies.get(balance.currency)!!.symbol}{balance.balance.toFixed(2)}</span>
                                </li>)
                            }) : <p/>
                        }
                    </ul>
                </li>
                <li className="WalletButton" onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/account") }>
                    <a>Wallet</a>
                </li>
            </ul>)
        }
        return (<div className="MainHeaderUser">
            <button className="LoginButton" onClick={() => this.props.openLoginModal()}><i className="fa-sharp fa-solid fa-right-to-bracket"></i> Sign In</button>
        </div>)
    }

    render() {
        return (
            <header className="Landing-header">
                <div className="LandingUserBar">
                    <div className="Logospace">
                        <img src="/assets/logo.png"/>
                    </div>
                    <div className="Promotions">
                        <ul>
                            <li className="First">
                                <i className="fa-solid fa-wifi members-online fill-gradient-radial2"></i>
                                <span>{numberWithCommas(this.props.online)}</span>
                                <div className="VerticalRule" style={{height: '25px'}}/>
                            </li>
                            <li>
                                <i className="fa-solid fa-shield-check"></i>
                                <span>Safer Gambling</span>
                            </li>
                            <li>
                                <i className="fa-solid fa-gem"></i>
                                <span>Buy & Sell GP</span>
                            </li>
                        </ul>
                    </div>
                    <div className="Userbar">
                        {this.getAccountBar()}
                    </div>
                </div>
                <div className="LandingNavBar">
                    <div className="Feedfilter">
                        <div className="feed-filter-link">
                            <div className="feed-filter-link__icon Active">
                                <i className="fa-solid fa-crown"></i>
                            </div>
                        </div>

                    </div>
                    <div className="Navigation">
                        <a className="landing-nav-link FirstLink" href="/register">
                            <div className="landing-nav-link__icon">
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <div className="landing-nav-link__count">
                                Register
                            </div>
                        </a>
                        <a className="landing-nav-link SecondLink" href="/games">
                            <div className="landing-nav-link__icon">
                                <i className="fa-solid fa-gamepad-modern"></i>
                            </div>
                            <div className="landing-nav-link__count">
                                Games
                            </div>
                        </a>
                        <a className="landing-nav-link ThirdLink" href="/games">
                            <div className="landing-nav-link__icon">
                                <i className="fa-solid fa-bolt-lightning"></i>
                            </div>
                            <div className="landing-nav-link__count">
                                Promotions
                            </div>
                        </a>
                        <a className="landing-nav-link FourthLink" href="/games">
                            <div className="landing-nav-link__icon">
                                <i className="fa-solid fa-play"></i>
                            </div>
                            <div className="landing-nav-link__count">
                                Livestreams
                            </div>
                        </a>
                    </div>
                </div>
            </header>
        );
    }
}

export default LandingHeader;