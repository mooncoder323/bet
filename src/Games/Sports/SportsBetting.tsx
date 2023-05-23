import React, {Component} from 'react';
import '../../Assets/css/Sports.scss';
import Tabs from "../../Components/Tabs/Tabs";
import FeaturedMatches from "./FeaturedMatches/FeaturedMatches";
import {Match} from "./Match";
import BetSlips from "./BetSlip/BetSlips";
import {Slip} from "../Slip";
import Footer from "../../Components/Footer/Footer";

type SportsState = {
    sport: number
    slips: Array<Slip>
    matches: Array<Match>

    mobileTabVisible: boolean
}

type Sport = {
    icon: string
    label: string
}

const headerData: Array<Sport> = [
    { icon: 'fav', label: 'Favourites' },
    { icon: 'foot', label: 'Football' },
    { icon: 'golf', label: 'Golf' },
    { icon: 'cricket', label: 'Cricket' },
    { icon: 'horse', label: 'Horse Racing' },
    { icon: 'esports', label: 'ESports' }
]

class SportsBetting extends Component<any, SportsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            sport: 0,
            slips: [],
            matches: [
                {
                    matchId: '001',
                    matchTitle: 'Watford:West Brom',
                    odds: [ '7/2', '9/5', '19/20' ]
                },
                {
                    matchId: '002',
                    matchTitle: 'Getafe:Valencia',
                    odds: [ '2/1', '13/8', '9/5' ]
                },
                {
                    matchId: '003',
                    matchTitle: 'Torino:US Cremonese',
                    odds: [ '14/5', '7/3', '12/5' ]
                }
            ],
            mobileTabVisible: false
        }
        this.addBetslip = this.addBetslip.bind(this)
        this.updateBetSlip = this.updateBetSlip.bind(this)
        this.removeBetSlip = this.removeBetSlip.bind(this)
        this.toggleMobileTab = this.toggleMobileTab.bind(this)
        this.getSportsContainer = this.getSportsContainer.bind(this)
    }

    sportButton(index: number, icon: string, text: string, extra?: boolean) {
        return (<div className={`ClassificationBarButton ${extra ? 'Active' : ''}`} onClick={()=> this.setState({sport: index})}>
            <div className="ClassificationBarButton_Icon">
                <img src={`/assets/games/sport/icons/${icon + (extra ? '_' : '')}.svg`}/>
            </div>
            <div className="ClassificationBarButton_Text ">{text}</div>
            <div className="ovm-FavouriteButtonCount Hidden "></div>
        </div>)
    }

    addBetslip(match: Match, option: number) {
        const slip: Slip = {
            match: match,
            option: option
        }
        const slips = this.state.slips
        slips.push(slip)
        this.setState({slips: slips})
    }

    removeBetSlip(target: Slip) {
        let slips: Array<Slip> = []
        this.state.slips.map((slip: Slip) => {
            if (slip != target) {
                slips.push(slip)
            }
        })
        this.setState({slips: slips})
    }

    toggleMobileTab() {
        this.setState({mobileTabVisible: !this.state.mobileTabVisible})
    }
    updateBetSlip(target: Slip) {
        // let slips: Array<Slip> = []
        // this.state.slips.map((slip: Slip) => {
        //     if (slip != target) {
        //         slips.push(slip)
        //     }
        // })
        this.setState({slips: this.state.slips})
    }

    getSportsContainer() {
        switch (this.state.sport) {
            /* Favourites */
            case 0: {
                return (<div></div>)
            }
            case 1: {
                return (<div>
                    <Tabs tabListSelector="sportsLargeTab" mobile={true}>
                    {/*// @ts-ignore*/}
                    <div label="Popular">
                        <FeaturedMatches matches={this.state.matches} slips={this.state.slips} addSlip={this.addBetslip} />
                    </div>
                    {/*// @ts-ignore*/}
                    <div label="In-Play">
                    </div>
                    {/*// @ts-ignore*/}
                    <div label="ACCAs">
                    </div>
                    {/*// @ts-ignore*/}
                    <div label="Players">
                    </div>
                    {/*// @ts-ignore*/}
                    <div label="Competitions">
                    </div>
                    {/*// @ts-ignore*/}
                    <div label="Specials">
                    </div>
                    {/*// @ts-ignore*/}
                    <div label="Virtuals">
                    </div>
                    {/*// @ts-ignore*/}
                    <div label="Today">
                    </div>
                </Tabs>
                </div>)
            }
            default: {
                return (<div></div>)
            }
        }
    }

    render() {
        return (
            <div className="SportsBetting">
                <div className="ClassificationBar">
                    {
                        headerData.map((d: Sport, index) => {
                            return this.sportButton(index, d.icon, d.label, index == this.state.sport)
                        })
                    }
                </div>
                <div className="Sport">
                    <div className="SportsContainer">
                        {
                            this.getSportsContainer()
                        }
                        <footer className="App-footer">
                            <ul className="HelpfulLinks">
                                <li>Help</li>
                                <li>Deposits</li>
                                <li>Withdrawals</li>
                                <li>RuneLeague FAQ</li>
                                <li>Terms & Conditions</li>
                                <li>Safer Gambling</li>
                                <li>Technical Issues</li>
                                <li>Privacy Policy</li>
                                <li>Cookies Policy</li>
                                <li>Fair Payouts</li>
                                <li>Complaints Procedure</li>
                                <li>Provably Fair</li>
                            </ul>
                            <ul className="MatchStats">
                                <li>Form & Stats</li>
                                <li>Sports & Betting news</li>
                                <li>Soccer Stats</li>
                                <li>Sports Stats</li>
                                <li>Horse Form</li>
                                <li>Horse Search</li>
                                <li>UK & Irish Racing Archive</li>
                                <li>Australian Horse Form</li>
                                <li>US Horse Form</li>
                                <li>UK & Irish Greyhound Form</li>
                            </ul>
                            <div className="FooterMisc">
                                <ul className="MiscStat">
                                    <li>Settings</li>
                                    <li>
                                        <select>
                                            <option>Language</option>
                                        </select>
                                    </li>
                                    <li>
                                        <select>
                                            <option>Odds Display</option>
                                        </select>
                                    </li>
                                </ul>
                                <ul className="MiscStat">
                                    <li>Scores & Results</li>
                                    <li>Live Scores</li>
                                    <li>Results</li>
                                </ul>
                                <ul className="MiscStat">
                                    <li>Promotions</li>
                                    <li>Open Account Offer</li>
                                    <li>Current Offers</li>
                                </ul>
                                <ul className="MiscStat">
                                    <li>Audio</li>
                                    <li>Horse Racing</li>
                                    <li>Greyhounds</li>
                                    <li>Soccer</li>
                                    <li>Cricket</li>
                                    <li>Six Nations</li>
                                </ul>
                            </div>
                        </footer>
                        <Footer />
                    </div>
                    <div className={`SportsInPlay ${this.state.mobileTabVisible ? 'SportsInPlayVisible' : 'SportsInPlayInVisible'}`}>
                        <div className="SportsPanel">
                            <div className="Promotional">

                            </div>
                            <BetSlips key={this.state.slips.length + "SLIP"} mobileTabVisible={this.state.mobileTabVisible} toggleMobileTab={this.toggleMobileTab} updateSlip={this.updateBetSlip} removeSlip={this.removeBetSlip} slips={this.state.slips} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SportsBetting;