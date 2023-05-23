import React, {Component} from 'react';

import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    CartesianGrid
} from 'recharts';

type ChartState = {
    data?: Array<any>
}
class SessionChart extends Component<any, ChartState> {

    constructor(props: any) {
        super(props);
        this.state = {
            // data: []
        }
    }


    componentDidMount() {
        let time = new Date().getTime()
        this.setState({data: [
            this.getEntry(time, 1),
            this.getEntry(time + 1000000, 2),
            this.getEntry(time + 1000000, 3),
            this.getEntry(time + 1000000, 4),
            this.getEntry(time + 1000000, 5),
            this.getEntry(time + 1000000, 6),
            this.getEntry(time + 1000000, 7),
            this.getEntry(time + 1000000, 8),
            this.getEntry(time + 1000000, 9),
        ]})
    }

    getEntry(time: number, multiplier: number) {
        return ({
            time: new Date(time * multiplier),
            account_value: 1000 * multiplier
        })
    }

    render() {
        if (!this.state.data) {
            return <span>Loading, please wait...</span>
        }
        return (
            <ResponsiveContainer width="100%" height={400}>

                <AreaChart
                    width={500}
                    height={400}
                    data={this.state.data}
                    margin={{
                        top: 10, right: 30, left: 0, bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4}/>
                            <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false}/>
                    <XAxis dataKey="time"/>
                    <YAxis/>
                    <Tooltip content={
                        //@ts-ignore
                        <CustomTooltip/>

                    }/>
                    <Area type="monotone" dataKey="account_value" stroke="#8884d8" fill="url(#color)"/>
                </AreaChart>
            </ResponsiveContainer>
        );
    }
}

//@ts-ignore
const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className="ChartTooltip">
                <ul className="Headings">
                    <li>
                        <span>Date</span>
                    </li>
                    <li>
                        <span>Gold</span>
                    </li>
                </ul>
                <ul className="Values">
                    <li>
                        <span>{new Date(label).toString().substr(0, 10)}</span>
                    </li>
                    <li>
                        <span>{payload[0].value.toLocaleString()} k</span>
                    </li>
                </ul>
            </div>
        );
    }

    return null;
};


export default SessionChart;