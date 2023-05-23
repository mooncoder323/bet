import React, {Component} from 'react';
import '../../Assets/css/Games.scss';
import Footer from "../../Components/Footer/Footer";
import {Offer} from "../../Components/Offer/Offer";
import {getOffers} from "../../Offers/Offers";
import {gambleResponsiblyAwareness} from "../../SaferGambling/Safety";

type LiveCasinoProps = {
    activeTab: number
    offers: Array<Offer>

    pageLoadedAt: Date
}

class LiveCasino extends Component<LiveCasinoProps, any> {

    constructor(props: LiveCasinoProps) {
        super(props);
        this.state = {
        }
        this.getActiveTab = this.getActiveTab.bind(this)
    }

    getActiveTab() {
        switch (this.props.activeTab) {
            case 0: {
                return (
                    <>
                        <div className="top-banner__background-container-alt">
                            <video style={{width: '100%'}} autoPlay muted loop
                                   poster="/assets/games/LiveDealerWelcome_ROW_2600x1470.jpeg">
                            </video>
                            <div className="top-banner__background-gradient">
                                <div className="Promo">
                                    <div className="Header">
                                        <h3>Welcome to RuneLeague Live Casino</h3>
                                        <span>Including Crash, Slots & more!</span>
                                    </div>
                                    <div className="Action"><button>Join</button></div>
                                </div>
                            </div>
                        </div>
                        <div className="AltContainer">
                            <div className="Game"></div>
                        </div>
                        {
                            gambleResponsiblyAwareness()
                        }
                    </>)
            }
            case 1: {
                return (
                    <>
                        <div className="top-banner__background-container-alt">
                        </div>
                    </>)
            }
            /* Offers */
            case 2: {
                return (<>
                    <div className="AltContainer">
                        {
                            getOffers(this.props.pageLoadedAt, this.props.offers)
                        }
                    </div>
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

export default LiveCasino;