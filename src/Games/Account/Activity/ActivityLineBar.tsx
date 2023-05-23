import React, {Component} from 'react';
import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    ComposedChart
} from 'recharts';
import {formatDateNoTime} from "../../../Utilities/LoadingBar";
export const BAR_CHART_COLOURS_INCOME_CHART = ["#9575cd", "#448aff", "#ff9800"]
export const LIGHT_COLOURS_INCOME_CHART = ["#448aff", "#ff9800"];

type ActivityLineState = {
    keys_i1: Array<string>
    keys_i2: Array<string>
    keys_i3: Array<string>
    keys_i4: Array<string>,
    data?: any
}

class ActivityLineBar extends Component<any, ActivityLineState> {

    constructor(props: any) {
        super(props);
        this.state = {
            keys_i1: ["Online", "Playing"],
            keys_i2: ["Revenue"],
            keys_i3: ["Online", "Playing", "Revenue"],
            keys_i4: ["Revenue"],
        }
        this.getBarChart = this.getBarChart.bind(this)
        this.getLineChart = this.getLineChart.bind(this)
    }

    componentDidMount() {
        let data: any = []
        this.format(this.props.gains, data)
        this.setState({
            data: data
        })
    }

    format(data: any, array: any) {
        if (!data) return
        return (
            data.map((item: any) => {
                    return array.push({
                        date: new Date(item.date).toLocaleDateString().split(".").reverse().join("-"),
                        'Revenue': (item.gains * 60000),
                        'Online': (item.onlineTime / 60000),
                        'Playing': (item.playTime / 60000),

                    })
                }
            )
        )
    }

    getBarChart() {
        return this.state.keys_i1.map((key, index) => {
            return <Bar dataKey={key}
                        fill={LIGHT_COLOURS_INCOME_CHART[index]}
                        barSize={8}

            />
        })
    }

    getLineChart() {
        return this.state.keys_i2.map((key, index) => {
            return <Line
                strokeWidth={2}
                type="linear"
                dataKey={key}
                stroke={BAR_CHART_COLOURS_INCOME_CHART[index]}
                fill={"rgb(35,34,34)"}

            />
        })
    }

    render() {
        const {
            //@ts-ignore
            data,
            //@ts-ignore
            list,
            //@ts-ignore
            chart,
            //@ts-ignore
            nameIncome,
            //@ts-ignore
            Annual,
        } = this.state;


        return (
            <div>
                <div className="income-select">
                    {/*<div>*/}
                    {/*    <button className={`Annual-btn ${Annual ? "" : "Annual-color"}`}*/}
                    {/*            onClick={() => this.changeActive2()}>Annual*/}
                    {/*    </button>*/}
                    {/*    <button className={`Annual-btn ${Annual ? "Annual-color" : ""}`}*/}
                    {/*            onClick={() => this.changeActive()}>Quarterly*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </div>

                <ResponsiveContainer width="110%" maxHeight={300} minHeight={210}>
                    <ComposedChart
                        width={500}
                        height={300}
                        data={data}
                        barGap={5}
                    >
                        <CartesianGrid strokeDasharray="1 0" stroke="#A6A6A637" vertical={false}
                                       //@ts-ignore
                                       fill={null}/>
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickFormatter={(tick, count) => {
                                return tick ? formatDateNoTime(tick) : tick
                            }}
                            tickLine={false}
                            stroke={"#d9d9dc"}
                            fontSize={11}
                            minTickGap={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            orientation={'right'}
                            tickCount={5}
                            stroke={"#d9d9dc"}
                            fontSize={11}
                        />
                        <Tooltip content={
                            //@ts-ignore
                            <CustomTooltip/>
                        } cursor={{fill: 'none'}} position={{y: -50,}}/>
                        <Legend/>
                        {this.getLineChart()}
                        {this.getBarChart()}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

//@ts-ignore
const CustomTooltip = ({active, payload, label}) => {

    if (active) {

        return (
            <div className="income-modal-vertical">
                <p>Revenue: {payload && payload[0] && payload[0].payload ? payload[0].payload.Revenue : 0}</p>
                <p>Online: {payload && payload[0] && payload[0].payload ? payload[0].payload["Online"] : 0}</p>
                <p>Playing: {payload && payload[0] && payload[0].payload ? payload[0].payload["Playing"] : 0}</p>
            </div>
        );
    }
    return null;
}

export default ActivityLineBar;