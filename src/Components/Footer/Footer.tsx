import React, {Component} from 'react';

class Footer extends Component {
    render() {
        return (
            <>
                <footer className="App-footer-legislatures">
                    <div className="Legislatures">
                        <div className="Legislature"><img src="/assets/legisl/BeGambleAware.svg" /> </div>
                        <div className="Legislature"><img src="/assets/legisl/GamblingCommision.svg" /> </div>
                        <div className="Legislature"><img src="/assets/legisl/GamStop.svg" /> </div>
                        <div className="Legislature"><img src="/assets/legisl/GT_v2.svg" /> </div>
                        <div className="Legislature"><img src="/assets/legisl/InternationalBettingIntegrity.svg" /> </div>
                    </div>
                    <div className="BetLockerSplash">
                        <div className="BetLockerInfo">
                            <img src="/assets/logo.png" />
                            <p>
                                Registered Office: Hillside (UK Sports) ENC (registration number P1892) and Hillside (UK Gaming) ENC (registration number P1888), Office 1/2373, Level G, Quantum House, 75 Abate Rigord Street, Ta’ Xbiex, XBX 1120, Malta.
                            </p>
                            <p>
                                Hillside (UK Sports) ENC is licensed and regulated by the British Gambling Commission
                            </p>
                            <p>
                                Hillside (UK Gaming) ENC is licensed and regulated by the British Gambling Commission
                            </p>
                            <p>
                                © 2021-2023 BetLocker. All rights reserved.
                            </p>
                            <span>Server Time 22:56:29 UK</span>
                        </div>
                        <div className="BetLockerLinks"></div>
                    </div>
                        <div className="BetLockerText">
                            <p>
                                By accessing, continuing to use or navigating throughout this site you accept that we will use certain browser cookies to improve your customer experience with us. RuneLeague only uses cookies which will improve your experience with us and will not interfere with your privacy. Please refer to our
                            </p>
                            <div className="fm-FooterModule_RecaptchaText "><span>This site is protected by reCAPTCHA and the Google </span><span
                                className="fol-LabelLink ">Privacy Policy</span><span> and </span><span
                                className="fol-LabelLink ">Terms of Service</span><span> apply.</span></div>
                        </div>
                </footer>
            </>
        );
    }
}

export default Footer;