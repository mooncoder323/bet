import React, {Component} from 'react';
import {Match} from "../../../Games/Sports/Match";
import {Slip} from "../../../Games/Slip";

type WagerTableProps = {
    addWager: any
    title: string
    data: Array<Match>
    slips: Array<Slip>
}

class WagerTable extends Component<WagerTableProps, any> {

    constructor(props: WagerTableProps) {
        super(props);
    }

    getMatchRow(match: Match) {
        let teams = match.matchTitle.split(':')
        let slips: Array<Slip> = []
        this.props.slips.map((s: Slip) => {
            if (s.match.matchId == match.matchId) {
                slips.push(s)
            }
        })
        let firstSelected = false
        let secondSelected = false
        let thirdSelected = false
        slips.filter(s => s.option == 0).map(s => firstSelected = true)
        slips.filter(s => s.option == 1).map(s => secondSelected = true)
        slips.filter(s => s.option == 2).map(s => thirdSelected = true)
        return (<div className="TableRow">
                <div className="MatchDetails">
                    <div className="Match">
                        <div className="MatchScore">
                            <ul className="Competitors">
                                <li><div className="Score">0</div> <span>{teams[0]}</span></li>
                                <li><div className="Score">0</div> <span>{teams[1]}</span></li>
                            </ul>
                        </div>
                        <div className="MatchOdds">
                            <ul>
                                <li className={`Odd ${firstSelected ? 'Active' : ''}`} onClick={() => {
                                    if (!firstSelected) {
                                        this.props.addWager(match, 0)
                                    }
                                }}>{match.odds[0]}</li>
                                <li className={`Odd ${secondSelected ? 'Active' : ''}`} onClick={() => {
                                    if (!secondSelected) {
                                        this.props.addWager(match, 1)
                                    }
                                }}>{match.odds[1]}</li>
                                <li className={`Odd ${thirdSelected ? 'Active' : ''}`} onClick={() => {
                                    if (!thirdSelected) {
                                        this.props.addWager(match, 2)
                                    }
                                }}>{match.odds[2]}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="MatchExtras">
                    </div>
                </div>
            </div>)
    }

    render() {
        return (
            <div>
                <div className="WagerTable">
                    <div className="TableRow signifier">
                        <div className="TableHeading">
                            <h2>{this.props.title}</h2>
                        </div>
                    </div>
                    <div className="TableRow signifier">
                        <div className="TableSubheading">
                            <div className="LeagueTitle"><span>English Premier League</span></div>
                            <div className="WagerHeadings">
                                <div className="WagerHeading">Home</div>
                                <div className="WagerHeading">Draw</div>
                                <div className="WagerHeading">Away</div>
                            </div>
                        </div>
                    </div>
                    {
                        this.props.data.map((match: Match) => {
                            return this.getMatchRow(match)
                        })

                    }
                    <div className="TableRow">
                        <div className="TableHeading">
                            <span className="Centered">More Football Markets</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WagerTable;