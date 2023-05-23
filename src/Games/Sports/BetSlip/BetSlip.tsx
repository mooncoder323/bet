import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {Slip} from "../../Slip";

type BetSlipProps = {
    slip: Slip
    updateSlip: any
    removeSlip: any
}

class BetSlip extends Component<BetSlipProps> {

    constructor(props: BetSlipProps) {
        super(props);
    }
    render() {
        const teams = this.props.slip.match.matchTitle.split(':')
        let selection = this.props.slip.option == 1 ? 'The Draw' : ''
        if (this.props.slip.option != 1) {
            selection = teams[this.props.slip.option == 0 ? 0 : 1]
        }
        const reg = /^\d+$/;
        let vals: Array<string> = this.props.slip.match.odds[this.props.slip.option].split('/')
        const payout = +vals[0]
        const outOf = +vals[1]
        const multiplier = payout / outOf
        const off = this.props.slip.offering ? reg.test(this.props.slip.offering?.replaceAll('.', '')) ? +this.props.slip.offering : 0 : 0
        const returns = multiplier * off
        return (<div className="Slip">
            <div className="SlipHeader">
                <div className="SlipTitle">
                    <input type="checkbox" checked={true} />
                    <span>{`${teams[0]} v ${teams[1]} - Match Odds`}</span>
                </div>
                <div className="SlipAction">
                    <FontAwesomeIcon icon={faTimes} onClick={() => this.props.removeSlip(this.props.slip)} />
                </div>
            </div>
            <div className="SlipOdds">
                <div className="SlipOption">
                    <span>{selection}</span>
                </div>
                <div className="SlipOddsValue">
                    <span>{this.props.slip.match.odds[this.props.slip.option]}</span>
                </div>
            </div>
            <div className="SlipOfferings">
                <div className="CurrencyValue">
                    <input type="text" defaultValue={this.props.slip.offering} className={
                        `${this.props.slip.offering ? reg.test(this.props.slip.offering.replaceAll('.', '')) ? '' : 'Error' : ''}`
                    } onChange={(e) => {
                        this.props.slip.offering = e.target.value
                        this.props.updateSlip()
                    }} placeholder="0.00" />
                </div>
                <div className="PotentialReturns">
                    <p>Potential returns</p>
                    <span>£{returns.toFixed(2)}</span>
                </div>
            </div>
        </div>
        );
    }
}

export default BetSlip;