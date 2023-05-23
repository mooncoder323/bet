import React, {Component} from 'react';
import {getLoadingBar} from "../../../Utilities/LoadingBar";
import ZoomAndPanCandleStickChart from "./ZoomAndPanCandleStickChart";
import ActivityLineBar from "./ActivityLineBar";
import CompanyPerformance from "./CompanyPerformance";
import Speedometer from "./Speedometer";
import {axiosGet} from "../../../Utilities/HTTPClient";
import {AccountActivityResponse} from "../../../API/Account/AccountActivityResponse";
import moment from "moment";

type ActivityState = {
    activity?: AccountActivityResponse
}

class AccountActivity extends Component<any, ActivityState> {

    constructor(props: any) {
        super(props);
        let t = new Date().getTime();
        this.state = {}
    }

    getAccountActivity = async (): Promise<AccountActivityResponse> => axiosGet(`/admin/auth/activity`)

    componentDidMount() {
        this.getAccountActivity().then((activity: AccountActivityResponse) => {
            this.setState({activity: activity})
        }).catch(e => {
            //@ts-ignore
            window.location.href = 'http://localhost:3000/'
        })

    }

    getData(date: number, multip: number) {
        return ({
            date: new Date(date * 10),
            open: 13 * multip,
            high: 16 * multip,
            low: 9 * multip,
            close: 14 * multip,
        })
    }

    chartData() {
        let highestHigh = 0
        let lowestLow = 0
        let highestDate = 0
        let lowestDate = 0
        let chartData: any[] = []
        this.state.activity!!.ochl.map((c, i) => {
            console.log(c)
            if (c.date > highestDate) {
                highestDate = c.date
            }
            if (c.high > highestHigh) {
                highestHigh = c.high
            }
            if (lowestLow == 0 || c.low < lowestLow) {
                lowestLow = c.low
            }
            if (lowestDate == 0 || c.date < lowestDate) {
                lowestDate = c.date
            }
            chartData.push(c)
        })
        return chartData
    }

    getChart() {
        const chartData = this.chartData()
        return (
            <ZoomAndPanCandleStickChart
                stockData={chartData}
                key={chartData}
            />
        )
    }

    private getLine() {
        const chartData = this.chartData()
        let cd: any = []
        chartData.map((d: any, i: number) => {
            if (i < 4) {
                cd.push(d)
            }
        })
        return (<ActivityLineBar gains={this.state.activity!!.netGains}/>)
    }

    private getMonthlyReport() {
        if (this.state.activity) {
            return this.getChart()
        }
        return getLoadingBar(true, "Fetching Stock Information...")
    }

    render() {
        if (!this.state.activity) {
            return (
                <div className="AltContainer">
                    <div className="AccountActivity">
                        {getLoadingBar(true, "Fetching Information...")
                        }
                    </div>
                </div>)
        }
        return (
            <div className="AltContainer">
                <div className="AccountActivity">
                    <div className="Recent">
                        <div className="BalanceHistory">
                            <div className="MetricSplash">
                                <div className="MetricSplashFilter">
                                    <div className='performance_title' style={{padding: '10px'}}>Key Stats</div>
                                    <select>
                                        <option>All Time</option>
                                    </select>
                                </div>
                                <ul className="Stats">
                                    <li><span>Online Time</span><span>{moment.utc(this.state.activity.onlineTime).format('HH:mm:ss')}</span></li>
                                    <li><span>Play Time</span><span>{moment.utc(this.state.activity.playTime).format('HH:mm:ss')}</span></li>
                                    <li><span>Net Profit</span><span>£{this.state.activity.netDeposit.toFixed(2)}</span></li>
                                    {/*<li><span>Total Profit</span><span>£{this.state.activity.netGains}</span></li>*/}
                                    <li><span>Net Deposit</span><span>£{this.state.activity.netDeposit.toFixed(2)}</span></li>
                                    <li><span>Net Withdraws</span><span>£{this.state.activity.netWithdraw.toFixed(2)}</span></li>
                                </ul>
                            </div>
                            <div className='performance_title' style={{padding: '10px'}}>Safer Gambling Rating</div>
                            <div className="ResponsiblityRating">
                                <div className="CompanyInformationSection W-255px">
                                    <Speedometer
                                        value={this.state.activity.safetyRating}
                                        valueTextFontSize={"28"}
                                        hideValues={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="Right">
                            <div className="AccountSummary">
                                <CompanyPerformance performance={this.state.activity.performance}/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <div className="MetricSplash" style={{paddingRight: '7%'}}>
                                    <div className="MetricSplashFilter">
                                        <div className='performance_title'>Net Gains</div>
                                    </div>
                                    {
                                        this.getLine()
                                    }
                                </div>
                            </div>
                            <div className="BalanceOCHL">
                                <div className="MetricSplash">
                                    <div className="MetricSplashFilter">
                                        <div className='performance_title' style={{padding: '10px'}}>Balance History
                                        </div>
                                        <select>
                                            <option>All Time</option>
                                        </select>
                                    </div>
                                    {
                                        this.getMonthlyReport()
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountActivity;