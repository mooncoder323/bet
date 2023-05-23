import React, {Component} from 'react';
import Tabs from "../../../Components/Tabs/Tabs";
import {AccountSettingsResponse} from "../../../API/Account/AccountSettingsResponse";
import {axiosGet} from "../../../Utilities/HTTPClient";
import {getLoadingBar} from "../../../Utilities/LoadingBar";

type SettingsState = {
    settings?: AccountSettingsResponse
}

class AccountSettings extends Component<any, SettingsState> {

    constructor(props: any) {
        super(props);
        this.state = {

        }
    }

    getAccountSettings = async (): Promise<AccountSettingsResponse> => axiosGet(`/admin/auth/settings`)

    componentDidMount() {
        this.getAccountSettings().then((activity: AccountSettingsResponse) => {
            this.setState({settings: activity})
        }).catch(e => {
            //@ts-ignore
            window.location.href = 'http://localhost:3000/'
        })

    }

    render() {
        if (!this.state.settings) {
            return (
                <div className="AltContainer">
                    <div className="AccountActivity">
                        {
                            getLoadingBar(true, "Fetching Information...")
                        }
                    </div>
                </div>)
        }
        return (
            <div className="AltContainer">
                <div className="AccountSettings">
                    <div className="SettingsTabs">
                        <Tabs>
                            {/* @ts-ignore */}
                            <div label="Security">
                                <div className="AltContainer">
                                    <div className="GeneralSettings">
                                        <div className="GeneralInformation">
                                            <div className="MetricSplash">
                                                <div className="MetricSplashFilter">
                                                    <div className='performance_title'>Account Information</div>
                                                </div>
                                            <ul>
                                                <li>
                                                    <ol>
                                                        <li className="Heading">Username</li>
                                                        <li>{this.props.username}</li>
                                                    </ol>
                                                </li>
                                                <li><p>Edit</p></li>
                                            </ul>
                                            <ul>
                                                <li>
                                                    <ol>
                                                        <li className="Heading">Email</li>
                                                        <li>{this.state.settings.emailAddress}</li></ol>
                                                </li>
                                                <li><p>Edit</p></li>
                                            </ul>
                                            <ul>
                                                <li>
                                                    <ol>
                                                        <li className="Heading">Phone</li>
                                                        <li>{this.state.settings.phoneNumber}</li>
                                                    </ol>
                                                </li>
                                                <li><p>Edit</p></li>
                                            </ul>
                                            <button>Change Password</button>
                                            </div>
                                        </div>
                                        <div className="SecuritySettings">
                                            <div className="MetricSplash">
                                                <div className="MetricSplashFilter">
                                                    <div className='performance_title'>2-Factor Authentication</div>
                                                </div>
                                                <div>
                                                    <span>Protect your account with an extra layer of security. Once configured, you'll be required to enter both your password and an authentication code from your mobile phone in order to sign in.</span>
                                                    <button>Enable 2-FA</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* @ts-ignore */}
                            <div label="Timeout">c</div>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountSettings;