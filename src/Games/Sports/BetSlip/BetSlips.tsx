import React, {Component, RefObject} from 'react';
import {Slip} from "../../Slip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowAltCircleDown, faArrowAltCircleUp, faTrash} from "@fortawesome/free-solid-svg-icons";
import BetSlip from "./BetSlip";
import Tabs from "../../../Components/Tabs/Tabs";

type BetSlipState = {
    tab: number
    slips: Array<Slip>
}

type BetSlipProps = {
    slips: Array<Slip>
    mobileTabVisible: boolean
    updateSlip: any
    removeSlip: any
    toggleMobileTab: any
}

class BetSlips extends Component<BetSlipProps, BetSlipState> {

    private tabs?: any;

    constructor(props: any) {
        super(props);
        this.state = {
            tab: 0,
            slips: props.slips
        }
        this.tabs = null
        this.onTabClick = this.onTabClick.bind(this)
    }

    onTabClick() {
        if (!this.props.mobileTabVisible) {
            this.props.toggleMobileTab();
        }
    }

    getToggleTab() {
        {/*// @ts-ignore*/}
        return (<div label="" onTabClick={() => {
            if (!this.props.mobileTabVisible && this.tabs) {
                {/*// @ts-ignore*/}
                this.tabs.setTab(1)
            } else if (this.props.mobileTabVisible) {
                this.tabs.setTab(0)
            }
            this.props.toggleMobileTab()
        }} icon={ <FontAwesomeIcon icon={this.props.mobileTabVisible ? faArrowAltCircleDown : faArrowAltCircleUp} />}>
        </div>)
    }

    render() {
        const mobile = window.innerWidth < 1265
        if (this.props.slips.length == 0) {
            return (<div className="BetSlip">
                {/*// @ts-ignore*/}
                <Tabs defaultTab={mobile ? 0 : 1} ref={r => this.tabs = r}>
                    { this.getToggleTab() }
                    {/*// @ts-ignore*/}
                    <div label="Betslips" onTabClick={this.onTabClick}>
                        <div className="CurrentSlip">
                            <h3>Your betslip is empty.</h3>
                            <span>Please make one or more selections in order to place bets.</span>
                        </div>
                    </div>
                    {/*// @ts-ignore*/}
                    <div label="My Bets" onTabClick={this.onTabClick}>
                    </div>
                </Tabs>
            </div>);
        }
        let totalStake: number = 0
        let potentialReturns: number = 0
        this.props.slips.map(slip => {
            const reg = /^\d+$/;
            let vals: Array<string> = slip.match.odds[slip.option].split('/')
            const payout = +vals[0]
            const outOf = +vals[1]
            const multiplier = payout / outOf
            const off = slip.offering ? reg.test(slip.offering.replaceAll('.', '')) ? +slip.offering : 0 : 0
            if (slip.offering) {
                totalStake += +slip.offering
                potentialReturns += (multiplier * off)
            }
        })
        return (<div className="BetSlip">
            {/*// @ts-ignore*/}
            <Tabs defaultTab={mobile ? 0 : 1} ref={r => this.tabs = r}>
                { this.getToggleTab() }
                {/*// @ts-ignore*/}
                <div label="Betslips" onTabClick={this.onTabClick}>
                    <div className="CurrentSlip" style={window.innerWidth < 1200 ? { height: window.innerHeight - 300 + 'px', minHeight: window.innerHeight - 300 + 'px'} : {  minHeight: window.innerHeight - 300 + 'px'}}>
                        {
                            this.props.slips.map((slip: Slip) => {
                                return <BetSlip updateSlip={this.props.updateSlip} slip={slip} removeSlip={this.props.removeSlip}/>
                            })
                        }
                    </div>
                    <div className="SlipFooter">
                        <div className="SlipFooterContents">
                            <span className="Disclaimer">Bets are accepted in accordance with RuneLeague rules</span>
                            <div className="BetSummary">
                                <div className="TotalStakes">
                                    <div className="TotalStake">
                                        <div className="Header">Total stake:</div>
                                        <div className="TotalPotentialReturns"><span>£{totalStake.toFixed(2)}</span></div>
                                    </div>
                                    <div className="PotentialReturns">
                                        <div className="Header">Potential returns:</div>
                                        <div className="TotalPotentialReturns"><span>£{potentialReturns.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="BetAction">
                                <div className="Discard">
                                    <button>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                                <div className="Login">
                                    <button className={`${totalStake > 0 ? 'Active' : ''}`}>
                                        <p>Login & Place Bets</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/*// @ts-ignore*/}
                <div label="My Bets" onTabClick={this.onTabClick}>
                </div>
            </Tabs>
        </div>);
    }
}

export default BetSlips;