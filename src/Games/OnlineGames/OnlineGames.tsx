import React, {Component} from 'react';
import '../../Assets/css/Games.scss';
import Footer from "../../Components/Footer/Footer";
import '../../Assets/css/Alt.scss';
import {Offer} from "../../Components/Offer/Offer";
import Carousel from "../../Components/Carousel/Carousel";
import {CarouselItem} from "../../Components/Carousel/CarouselItem";
import {gambleResponsiblyAwareness} from "../../SaferGambling/Safety";
import {getOffers} from "../../Offers/Offers";

type GamesProps = {
    activeTab: number,
    offers: Array<Offer>

    pageLoadedAt: Date
}
type GamesState = {
    topGames: Array<CarouselItem>
}

class OnlineGames extends Component<GamesProps, GamesState> {

    constructor(props: any) {
        super(props);
        this.state = {
            topGames: [
                {
                    splash: '/assets/games/online/dice/logo.jpeg',
                    url: 'http://localhost:3000/game/dice',
                },
                {
                    splash: '/assets/games/online/crash/logo.jpeg',
                    url: 'http://localhost:3000/game/crash',
                },
                {
                    splash: '/assets/games/online/slots/logo.jpeg',
                    url: 'http://localhost:3000/game/slots',
                },
                {
                    splash: '/assets/games/online/roulette/logo.jpeg',
                    url: 'http://localhost:3000/game/roulette',
                },
                {
                    splash: '/assets/games/online/blackjack/logo.jpeg',
                    url: 'http://localhost:3000/game/blackjack',
                }
            ]
        }
        this.getActiveTab = this.getActiveTab.bind(this)
    }

    render() {
        return (<div className="BetlockerSplash">
            <div className="top-banner">
                {
                    this.getActiveTab()
                }
                <Footer />
            </div>
        </div>)
    }

    getActiveTab() {
        switch (this.props.activeTab) {
            case 0: {
                return (
                    <>
                        <div className="top-banner__background-container">
                            <video style={{width: '100%'}} autoPlay muted loop
                                   poster="/assets/games/games-splash.jpeg">
                                <source
                                    src={'http://localhost:3000/stream0.mp4'}
                                    type="video/mp4"/>
                            </video>
                            <div className="top-banner__background-gradient">
                                <div className="Promo">
                                    <div className="Header">
                                        <h3>Welcome to RuneLeague Games</h3>
                                        <span>Including Dice, Crash, Slots & more!</span>
                                    </div>
                                    <div className="Action">
                                        <button>Join</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="AltContainer">
                            <h2>Games</h2>
                            <Carousel pageLoadedAt={this.props.pageLoadedAt} items={this.state.topGames} />
                        </div>
                        {
                            gambleResponsiblyAwareness()
                        }
                    </>
                );
            }
            case 2: {
                return (
                    <>
                        <div className="top-banner__background-container">
                            <video style={{width: '100%'}} autoPlay muted loop
                                   poster="/assets/Games/Games-Product-Desktop-ChineseV2-1920x1080.jpg">
                                <source
                                    src={'http://localhost:3000/stream0.mp4'}
                                    type="video/mp4"/>
                            </video>
                            <div className="top-banner__background-gradient">
                                <div className="Promo">
                                    <div className="Header">
                                        <h3>Welcome to RuneLeague Games</h3>
                                        <span>Including Dice, Crash, Slots & more!</span>
                                    </div>
                                    <div className="Action">
                                        <button>Join</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="AltContainer">
                            <h2>All Games</h2>
                            <div className="Game"></div>
                        </div>
                        {
                            gambleResponsiblyAwareness()
                        }
                    </>
                );
            }
            /* Offers */
            case 1: {
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
}

export default OnlineGames;