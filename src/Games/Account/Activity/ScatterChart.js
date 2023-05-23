import React, {PureComponent} from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ZAxis,
    Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
    const surprise = payload[0].payload.actual - payload[0].payload.estimate
        return (
        <>
            <div className="custom-tooltip">
                <p className="label">{`Date: ${payload[0].value}`}</p>
                <p className="desc">Actual: {payload[0].payload.actual}</p>
                <p className="desc">Estimate: {payload[0].payload.estimate}</p>
                <p style={{ color: surprise >= 0 ? "#24b285" : "#f75254" }}>Surprise: {surprise.toFixed(2)} ({(surprise * 100 / payload[0].payload.actual).toFixed(2)}%)</p>
            </div>
            <div className='triangle_down'></div>
        </>
        );
    }

    return null;
}

export default class CustomScatterChart extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            stockData: []
        }
    }

    componentDidMount() {
        if (this.props.miscData.quarterlyEarnings) {
            this.props.miscData.quarterlyEarnings.map(item => {
                const date = `${item.date.split("")[0]}${item.date.split("")[1]} '${item.date.split("")[4]}${item.date.split("")[5]}`
                this.state.stockData.push({
                    date: date,
                    actual: item.actual,
                    estimate: item.estimate,
                    surprise: item.actual - item.estimate,
                    colors: (item.actual - item.estimate) > 0 ? ["rgb(36, 178, 155)", "rgb(163, 166, 175)"] : ["#fff", "rgb(163, 166, 175)"]
                })
            })
        }
    }

    render() {
        
        const {keys, stockData, darkTheme} = this.props
        const colours = ["rgb(36, 178, 155)", "rgb(163, 166, 175)"]
        const colours2 = ["#fff", "rgb(163, 166, 175)"]
        if (this.state.stockData) {
        const stockData = this.state.stockData
            return (
                <>
                    <div className='scatter-container'>
                        <div className='scatter-container-flex'>
                            <div>
                                Earnings
                            </div>
                            <div className='scatter-container-next'>
                                <span>Next:</span>
                                <span className='scatter-container-next-date'>Jul 23</span>
                            </div>
                        </div>
                    </div>
                    <div className='MB-20px'>
                        <ResponsiveContainer width="100%" maxHeight={300} minHeight={210}>
                            <ScatterChart
                                margin={{
                                    top: 20,
                                    left: 5,
                                    right: -20,
                                    button: 20,
                                }}
                                barGap={5}
                                data={stockData}
                            >
                                <CartesianGrid strokeDasharray="1 0" stroke="#A6A6A637" vertical={false}  fill={null}/>
                                <YAxis orientation='right'
                                       axisLine={false}
                                       tickLine={false}
                                       tickCount={5}
                                       stroke={this.props.darkTheme ? "#d9d9dc" : "#131722"}
                                       fontSize={11}
                                       domain={[0, "auto"]}
                                       barSize={1}
                                />
                                <XAxis dataKey="date"
                                       axisLine={false}
                                       tickLine={false}
                                       stroke={this.props.darkTheme ? "#d9d9dc" : "#131722"}
                                       fontSize={11}/>
                                <ZAxis range={[200, 200]}/>
                                <Legend/>
                                <Tooltip content={<CustomTooltip />} position={{x: "auto" ,y: -70 }} isAnimationActive={false}/>
                                {
                                    keys.map((key, index) => {
                                        return <Scatter key={index} dataKey={key} fill={colours[index]}/>
                                    })
                                }
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )
        }
    }
}

