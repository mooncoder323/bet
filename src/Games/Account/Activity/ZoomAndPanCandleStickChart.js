import React, {useEffect, useRef, useState} from 'react';
import {Bar, BarChart, CartesianGrid, Cell, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import {formatDateNoTime} from "../../../Utilities/LoadingBar";
import './Common.scss'

const Candlestick = props => {
    const {
        fill,
        x,
        y,
        width,
        height,
        low,
        high,
        openClose: [open, close],
        fullColor1,
        fullColor2
    } = props;
    const isGrowing = open < close;
    const isInvisible = open == close && low == high;
    const color = isInvisible ?'#171b26' : isGrowing ? '#34a699' : '#ef534f';
    const ratio = Math.abs(height / (open - close));

    return (
        <g stroke={color} fill={isGrowing ? '#34a699' : '#ef534f'} strokeWidth="1">
            <path
                d={`
          M ${x},${y}
          L ${x},${y + height}
          L ${x + width},${y + height}
          L ${x + width},${y}
          L ${x},${y}
        `}
            />
            {/* bottom line */}
            {isGrowing ? (
                <path
                    d={`
            M ${x + width / 2}, ${y + height}
            v ${(open - low) * ratio}
          `}
                />
            ) : (
                <path
                    d={`
            M ${x + width / 2}, ${y}
            v ${(close - low) * ratio}
          `}
                />
            )}
            {/* top line */}
            {isGrowing ? (
                <path
                    d={`
            M ${x + width / 2}, ${y}
            v ${(close - high) * ratio}
          `}
                />
            ) : (
                <path
                    d={`
            M ${x + width / 2}, ${y + height}
            v ${(open - high) * ratio}
          `}
                />
            )}
        </g>
    );
};


const prepareData = (data, chartLine) => {
    let highestHigh = 0
    let lowestLow = 0
    let highestDate = 0
    let lowestDate = 0
    let chartData = []
    data.map((c, i) => {
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
    return chartData.map(({open, close, ...other}) => {
        return {
            ...other,
            openClose: [open, close],
        };
    });
};


const DEFAULT_VISIBILITY = 100


const ZoomAndPanCandleStickChart = (props) => {

    let defaultVisibility = props.stockData.length <= 5 ? 100 : DEFAULT_VISIBILITY
    const disabled = props.stockData.length <= 5
    let hiddenRecords = props.stockData.length - ((defaultVisibility / 100) * props.stockData.length)
    let startIndex = hiddenRecords
    let endIndex = props.stockData.length

    setInterval(() => {
        if (!state.moving && state.flagUpdate) {
            setState({
                dataVisibility: state.dataVisibility,
                viewportSize: state.viewportSize,
                startIndex: state.startIndex,
                endIndex: state.endIndex,
                stockDataFull: state.stockDataFull,
                stockDataVisible: state.stockDataVisible,
                open: state.open,
                high: state.high,
                low: state.low,
                close: state.close,
                difference: state.difference,
                differencePerCent: state.differencePerCent})
            state.flagUpdate = false
        }
    }, 500);

    const [state, setState] = useState({
        dataVisibility: DEFAULT_VISIBILITY,
        viewportSize: ((DEFAULT_VISIBILITY / 100) * props.stockData.length),
        startIndex: startIndex,
        endIndex: endIndex,
        stockDataFull: props.stockData.slice(),
        stockDataVisible: props.stockData.slice(),
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        difference: 0,
        differencePerCent: 0
    })


    function setDailyValues(data) {
        if (state.moving || state.open == data.open && state.close == data.close) return
        state.open = data.open
        state.high = data.high
        state.low = data.low
        state.close = data.close
        state.flagUpdate = true
    }

    const actualData = state.stockDataVisible.map((point) => {
        return {
            date: new Date(point.date).toLocaleDateString().split(".").reverse().join("-"),
            low: point.low,
            high: point.high,
            open: point.open,
            close: point.close,
            height: Math.abs(point.close - point.open),
            up: point.close > point.open,
        }
    });

    function getScrolling(e) {
        if (disabled) return
        if (state.moving) return
        state.moving = true
        let movedOnX = false
        console.log(state.stockDataVisible.length)
        let multiplier = 1
        if (e.deltaX > 0) {
            if (state.stockDataVisible.length > 200) {
                multiplier = 2
            }
            if (state.stockDataVisible.length > 400) {
                multiplier = 4
            }
            if (state.stockDataVisible.length > 500) {
                multiplier = 10
            }
        } else {
            if (state.stockDataVisible.length > 500) {
                multiplier = 2
            }
            if (state.stockDataVisible.length > 400) {
                multiplier = 4
            }
            if (state.stockDataVisible.length > 300) {
                multiplier = 10
            }
            if (state.stockDataVisible.length > 50) {
                multiplier = 1
            }
        }
        if (e.deltaX > 0) {
            for (let i = 0; i < multiplier; i++) {
                if (state.endIndex < state.stockDataFull.length - 1) {
                    ++state.endIndex
                }
                if (state.startIndex < (state.stockDataFull.length - 1 - state.viewportSize)) {
                    ++state.startIndex
                }
            }
            movedOnX = true
        } else if (e.deltaX < 0) {
            for (let i = 0; i < multiplier; i++) {
                if (state.endIndex > state.viewportSize) {
                    --state.endIndex
                    if (state.startIndex > 0) {
                        --state.startIndex
                    }
                }
            }
            movedOnX = true
        }

        let newDataVisibility = state.dataVisibility
        if (!movedOnX) {
            if (e.deltaY < 0) {
                for (let i = 0; i < multiplier; i++) {
                    newDataVisibility = newDataVisibility > 0 ? newDataVisibility - 1 : 0
                }
            } else if (e.deltaY > 0) {
                for (let i = 0; i < multiplier; i++) {
                    newDataVisibility = newDataVisibility < 99 ? newDataVisibility + 1 : 99
                }
            }
        }
        let newViewportSize = ((newDataVisibility / 100) * state.stockDataFull.length)
        if (newDataVisibility != state.dataVisibility) {
            let difference = Math.floor(Math.abs(newViewportSize - state.viewportSize))
            let differenceHalved = Math.floor(difference / 2)
            let startSign = -1
            let endSign = 1
            if (newViewportSize < state.viewportSize) {
                startSign = 1
                endSign = -1
            }
            let newStartIndex = state.startIndex < differenceHalved ? 0 : state.startIndex + (differenceHalved * startSign)
            state.startIndex = newStartIndex
            state.endIndex = newStartIndex + newViewportSize + (differenceHalved * endSign)
        }
        state.stockDataVisible = state.stockDataFull.slice(state.startIndex, state.endIndex)
        let hiddenRecords = (newDataVisibility / 100) * state.stockDataVisible.length
        const stockData = state.stockDataVisible.slice(hiddenRecords)

        setState({...state, dataVisibility: newDataVisibility, stockData: stockData, viewportSize: newViewportSize, moving: false})
        // console.log(`From: ${state.stockDataVisible[0]} To: ${state.stockDataVisible[state.stockDataVisible.length - 1]}`)
        // console.log(state.stockDataVisible[0])
        // console.log(state.stockDataVisible[state.stockDataVisible.length - 1])
    }

    let barChart = useRef(null)

    useEffect(() => {
        barChart.current.addEventListener("wheel", e => e.preventDefault())
        barChart.current.addEventListener("mousemove", e => e.preventDefault())
        state.stockDataVisible = state.stockDataFull.slice(state.startIndex, state.endIndex)
        setState({...state, stockData: state.stockDataVisible})
    }, [])

    const data = prepareData(actualData, !props.chartArea && props.chartLine);
    let openClose = data.map(item => ({'open': item.openClose[0], 'close': item.openClose[1]}))
    const minValue = data.reduce(
        (minValue, {low, openClose: [open, close]}) => {
            const currentMin = Math.min(low, open, close);
            return minValue === null || currentMin < minValue ? currentMin : minValue
        },
        null,
    );

    const maxValue = data.reduce(
        (maxValue, {high, openClose: [open, close]}) => {
            const currentMax = Math.max(high, open, close);
            return currentMax > maxValue ? currentMax : maxValue
        },
        minValue,
    );

    function set_X() {
        return (
            <XAxis
                dataKey="date"
                stroke={"#cecece"}
                axisLine={false}
                tickLine={false}
                tickFormatter={(tick, count) => {
                    return tick ? formatDateNoTime(tick) : tick
                }}
            />
        )
    }

    function set_Y() {
        return (
            <YAxis
                domain={[Math.floor(minValue * 0.9), Math.ceil(maxValue * 1.1)]}
                type="number"
                stroke={"#cecece"}
                axisLine={false}
                // padding={{ top: 60, bottom: 10 }}
                style={{background: "red"}}
                tick={{ dx: 10,  }}
                tickFormatter={(tick) => {
                    return Math.floor(tick)
                }}
                tickLine={false}
                orientation={'right'}
                tickCount={19}
            />
        )
    }

    function set_CartesianGrid() {
        return (
            <CartesianGrid strokeDasharray="1 0" stroke="#A6A6A637" fill={null}/>
        )
    }

    function set_Tooltip() {
        return (
            <Tooltip cursor={<CustomCursor />} position={{y: 370}} content={<CustomTooltip setDailyValues={setDailyValues}/>}/>
        )
    }

    const CustomCursor = props => {
        const { x, y, width, height, stroke } = props;
        return <Rectangle fill={'#363a45'} stroke={'#363a45'} x={(x + (width / 2)) - 1} y={y} width={0.5} height={height} />;
    };

    return (
        <div onWheel={(e) => getScrolling(e)}
             ref={barChart} className="MarginBottom-5">
            <div className="CurrentDay">
                <div className="CurrentDayValue">
                    <p>O</p>
                    <span
                        className={state.open < state.close ? "Positive" : "Negative"}>{state.open.toString().substr(0, 6)}</span>
                </div>
                <div className="CurrentDayValue">
                    <p>H</p>
                    <span
                        className={state.open < state.close ? "Positive" : "Negative"}>{state.high.toString().substr(0, 6)}</span>
                </div>
                <div className="CurrentDayValue">
                    <p>L</p>
                    <span
                        className={state.open < state.close ? "Positive" : "Negative"}>{state.low.toString().substr(0, 6)}</span>
                </div>
                <div className="CurrentDayValue">
                    <p>C</p>
                    <span
                        className={state.open < state.close ? "Positive" : "Negative"}>{state.close.toString().substr(0, 6)}</span>
                </div>
            </div>
            <div>
                <div className={"chart-gantt"}>
                    <ResponsiveContainer width="100%" maxHeight={400} minHeight={400}>
                        <BarChart
                            data={data}
                            margin={{
                                top: 0,
                                bottom: 0
                            }}
                        >
                            {set_X()}
                            {set_Y()}
                            {set_CartesianGrid()}
                            {set_Tooltip()}

                            <Bar
                                maxBarSize={props.barSize}
                                dataKey="openClose"
                                shape={<Candlestick
                                    darkTheme={props.darkTheme}
                                    fullColor1={props.fullColor1}
                                    fullColor2={props.fullColor2}

                                />}
                            >
                                {
                                    data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.up ? '#00a626' : '#c41616'}/>
                                    ))
                                }
                            </Bar>
                        </BarChart>

                    </ResponsiveContainer>
                </div>

            </div>
        </div>


    )
};

export default ZoomAndPanCandleStickChart;

const CustomTooltip = ({setDailyValues, active, payload, label}) => {
    if (active) {
        if (payload && payload[0]) {
            setDailyValues({
                open: payload[0].payload.openClose[0],
                close: payload[0].payload.openClose[1],
                high: payload[0].payload.high,
                low: payload[0].payload.low
            })
        }
        let date = ""
        if (payload && payload[0]) {
            date = payload[0].payload.date
        }
        return (
            <div className="ChartTooltip">{date}</div>
        );
    }

    return null;
};
