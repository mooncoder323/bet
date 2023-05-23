import React, {Component} from 'react';
import {LivefeedWager} from "../../API/PlatformStatistics";

type FeedProps = {
    wagers: Array<LivefeedWager>
}

class LandingFeed extends Component<FeedProps, any> {

    constructor(props: FeedProps) {
        super(props);
        this.getFeedEntry = this.getFeedEntry.bind(this)
    }

    render() {
        return (
            <div className="LandingFeed">
                {
                    this.props.wagers.map(w => {
                        return this.getFeedEntry(w)
                    })
                }
            </div>
        );
    }

    getFeedEntry(wager: LivefeedWager) {
        let bg = ''
        let backdrop = '/assets/games/dice.svg'
        let line = ''
        let selector = ''
        switch (wager.game.replaceAll('_', ' ')) {
            case 'Dice Game':
                bg = 'https://hellcase.com/core/images/entity/bg-entity.svg'
                line = '#ffdd00'
                selector = 'Dice'
                break
            case 'Crash':
                line = '#0952ACFF'
                bg = '/assets/games/online/crash/red.webp'
                backdrop = '/assets/games/online/crash/bg_rocket.png'
                selector = 'Crash'
                break
            case 'Slots':
                line = '#00ff40'
                bg = '/assets/games/bg-multiple-green.png'
                backdrop = '/assets/games/online/slots/leprechaun.png'
                selector = 'Slots'
                break
            case 'Roulette':
                bg = '/assets/games/bg-multiple-red.png'
                backdrop = '/assets/games/online/roulette/board.png'
                selector = 'Roulette'
                line = '#ff0000'
                break
            case 'Blackjack':
                bg = '/assets/games/bg-multiple-red.png'
                line = '#fff'
                break
            case 'Plinko':
                line = '#ae52ff'
                bg = '/assets/games/bg-multiple-red.png'
                break
            case 'Limbo':
                line = '#ff9752'
                bg = 'https://hellcase.com/core/images/entity/bg-entity.svg'
                break
            case 'Mines':
                line = '#52fff1'
                bg = '/assets/games/bg-multiple-red.png'
                break
        }
        return (<div className="FeedEntry">
            <div className="Feedline" style={{background: line}}></div>
            <div className="FeedWager" style={{backgroundImage: `url('${bg}')`}}>
                <div className={`FeedBackdrop ${selector}`} style={{backgroundImage: `url(${backdrop})`}}>
                    <ul className="GP">
                        <li>100m</li>
                        <li><img src="/assets/gp.png" /></li>
                    </ul>
                    <span className="WinnerName">{wager.username}</span>
                </div>
            </div>
        </div>)
    }
}

export default LandingFeed;