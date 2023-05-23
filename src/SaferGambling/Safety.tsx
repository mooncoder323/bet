import React from "react";

export function gambleResponsiblyAwareness() {
    return (<div className="AltContainer">
        <h3>Making sure everyone gambles responsibly</h3>
        <span>Useful tools to help you stay in control of your gambling:</span>
        <br/>
        <br/>
        <div className="SaferGamblingOptions">
            <div className="Option">
                <img src="/assets/SaferGambling/DepositLimit.svg"/>
                <span>Deposit Limits</span>
            </div>
            <div className="Option">
                <img src="/assets/SaferGambling/RealityCheck.svg"/>
                <span>Detailed History of Activity</span>
            </div>
            <div className="Option">
                <img src="/assets/SaferGambling/TimeOut.svg"/>
                <span>Time-Out</span>
            </div>
            <div className="Option">
                <img src="/assets/SaferGambling/SelfExclusion.svg"/>
                <span>Self-Exclusion</span>
            </div>
        </div>
        <div className="MoreInfo"><span>Find out more on our dedicated Safer Gambling site.</span></div>
        <div className="MoreInfoAction"><a href="/safer-gambling"><button>Go to Safer Gambling</button></a></div>
    </div>)
}