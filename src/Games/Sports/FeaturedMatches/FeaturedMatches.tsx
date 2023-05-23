import React, {Component} from 'react';
import WagerTable from "../../../Components/Table/WagerTable/WagerTable";
import {Match} from "../Match";
import {Slip} from "../../Slip";

type MatchesProps = {
    addSlip: any
    matches: Array<Match>
    slips: Array<Slip>
}

class FeaturedMatches extends Component<MatchesProps, any> {

    constructor(props: MatchesProps) {
        super(props);
    }
    render() {
        return (
            <div className="FeaturedMatches">
                <h2>Featured Matches</h2>
                <WagerTable title="Today" data={this.props.matches} slips={this.props.slips} addWager={this.props.addSlip} />
            </div>
        );
    }
}

export default FeaturedMatches;