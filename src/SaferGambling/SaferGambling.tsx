import React, {Component} from 'react';
import '../Assets/css/Games.scss';
import Footer from "../Components/Footer/Footer";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

type SaferGamblingProps = {
    activeTab: number
}

class SaferGambling extends Component<SaferGamblingProps, any> {

    constructor(props: SaferGamblingProps) {
        super(props);
        this.state = {
        }
        this.getActiveTab = this.getActiveTab.bind(this)
    }

    getActiveTab() {
        switch (this.props.activeTab) {
            /* Mission Statement */
            case 0: {
                return (
                    <>
                        <div className="AltContainer SaferGamblingMissionStatement">
                            <h3>Mission Statement</h3>
                            <span>
                                Safer Gambling is a top priority for BetLocker. Our aim is to encourage gambling as an entertaining form of leisure while emphasizing the importance of responsible gambling and maintaining control. Nevertheless, we acknowledge that gambling may transform from an innocent pastime to a problematic behavior for some individuals.
                            </span>
                            <h5 style={{textAlign: 'left', paddingLeft: '40px'}}>How do I gamble responsibly?</h5>
                            <ul>
                                <li><FontAwesomeIcon icon={faCheck} /> <p>Regard gambling as a means of amusement, not a source of income.</p></li>
                                <li><FontAwesomeIcon icon={faCheck} /> <p>Only wager what you can afford to lose and utilize Deposit Limits to regulate your expenditure.</p></li>
                                <li><FontAwesomeIcon icon={faCheck} /> <p>Avoid pursuing losses as it may result in complications.</p></li>
                                <li><FontAwesomeIcon icon={faCheck} /> <p>Monitor the duration of your gameplay and use Reality Checks to remind yourself of the time spent logged in.</p></li>
                                <li><FontAwesomeIcon icon={faCheck} /> <p>Maintain a balance between gambling and other leisure activities. If gambling becomes the sole source of entertainment, reassess whether it still provides enjoyment.</p></li>
                                <li><FontAwesomeIcon icon={faCheck} /> <p>Take periodic breaks from gambling to prevent losing perspective and track of time.</p></li>
                                <li><FontAwesomeIcon icon={faCheck} /> <p>Refrain from gambling while under the influence of alcohol or emotional distress as it can impair rational decision-making.</p></li>
                                <li><FontAwesomeIcon icon={faCheck} /> <p>Consider the amount of time and money spent on gambling and monitor your activity with My Activity.</p></li>
                                <li><FontAwesomeIcon icon={faCheck} /> <p>Comprehend your odds of winning and the mechanics of the game.</p></li>
                                <li><FontAwesomeIcon icon={faCheck} /> <p>Remember that if you require assistance with problem gambling, there are problem gambling support organizations available to talk to.</p></li>
                            </ul>
                        </div>
                    </>)
            }
            /* Activity */
            case 1: {
                return (
                    <>
                        <div className="AltContainer SaferGamblingMissionStatement LeftAligned">
                            <h3>Activity</h3>
                            <span>My Activity section can help you monitor your account activity using a visual dashboard that displays statistics, recent bet times, and a graphical representation of your account history. You have the option to view your account activity for a duration of 7 days, 30 days, or 12 months.</span>

                            <h3>Online Account History</h3>
                            <span>To facilitate monitoring of your activity, you can access the transaction, deposit, and withdrawal history via the Account Menu. Additionally, your account balance is constantly visible in the top right corner of the page when you are logged in to BetLocker.</span>

                            <h3>Win/Loss History</h3>
                            <span>Both the My Activity page and the History page, which can be accessed through the Account Menu, present the Win/Loss history. This history indicates the profits or losses resulting from your bets, after deducting the stakes, for all the bets settled during the selected time frame. It also encompasses any bets made outside the selected period but settled within it, enabling you to effortlessly monitor your gambling expenses.</span>

                            <h3>Net Deposits</h3>
                            <span>To get a comprehensive idea of the incoming and outgoing transactions in your RuneLeague account, you can examine your net deposits by accessing the Account Menu. Net deposit refers to the variance between the amount you have deposited and withdrawn from your account.</span>
                        </div>
                    </>)
            }
            /* Timeouts */
            case 2: {
                return (<>
                    <div className="AltContainer SaferGamblingMissionStatement LeftAligned">
                        <h3>Timeouts</h3>
                        <span>In case you wish to temporarily abstain from betting and gaming activities, you have the option of availing a Time-Out for a duration of 24 hours, 48 hours, 7 days, or 30 days. Alternatively, you may select a Custom period as well.</span>
                        <br /><br />
                        <span>You have the option to establish a Custom Time-Out Period that can be one-time or recurring. As an instance, you may initiate a Time-Out that starts on Monday at 09:00 and concludes on Friday at 17:30.</span>
                        <br /><br />
                        <span>Once you commence the Time-Out, you cannot utilize your account for betting and gaming. However, you can still log in to withdraw any remaining balance. Your account cannot be reactivated until your selected Time-Out duration is over.</span>
                    </div>
                </>)
            }
            /* Self Exclusion */
            case 3: {
                return (<>
                    <div className="AltContainer SaferGamblingMissionStatement LeftAligned">
                        <h3>Self Exclusion</h3>
                        <span>If you sense that you may be susceptible to developing a gambling issue or think that you are currently encountering one, we suggest utilizing Self-Exclusion. This feature prohibits you from engaging in any gambling activities with RuneLeague for a designated duration of either 6 months, 1 year, 2 years, or 5 years.</span>
                        <br/><br/>
                        <span>However, if you wish to discontinue playing for other reasons, we recommend either taking a Time-Out or closing your account.</span>
                        <br/><br/>
                        <h3>Next steps</h3>
                        <span>We strongly advise you to seek assistance from a specialized service that provides support for problem gambling to aid you in managing and addressing your gambling-related issue. These support services may include counseling, therapy, helplines, and other resources that can assist you in coping with and overcoming your struggles.</span>
                        <br/><br/>
                        <span>Seeking support can be an essential step in regaining control of your gambling behavior and leading a healthy and fulfilling life.</span>
                        <br/><br/>
                    </div>
                </>)
            }
        }
    }

    render() {
        return (
            <div className="BetlockerSplash">
                <div className="top-banner">
                        <div className="top-banner__background-container-alt">
                            <video style={{width: '100%'}} autoPlay muted loop
                                   poster="/assets/SaferGambling/man-looking-at-his-phone.jpeg">
                            </video>
                            <div className="top-banner__background-gradient">
                                <div className="Promo">
                                    <div className="Header">
                                        <h3>Safer Gambling</h3>
                                        <span>Ensuring you gamble responsibly.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {
                        this.getActiveTab()
                    }
                    <Footer />
                </div>
            </div>
        );
    }
}

export default SaferGambling;