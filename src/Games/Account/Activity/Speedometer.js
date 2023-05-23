import React, {Component} from "react";
import ReactSpeedometer from "react-d3-speedometer";


export default class Speedometer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buy: 0,
            sell: 0,
            neutral: 0,
            value: props.value,
            currentValueText: ""

        }
        this.changeGradient = this.changeGradient.bind(this)
        this.changeСolor = this.changeСolor.bind(this)
        this.currentValueText = this.currentValueText.bind(this)
    }

    changeGradient(value) {

        if (value >= 0 && value <= 200) {
            return 'linear-gradient(180deg, #F44336D6, rgba(255, 255, 255, 0))'

        } else if (value > 200 && value <= 400) {
            return 'linear-gradient(180deg, #f7525f4d, rgba(255, 255, 255, 0))'

        }
        if (value > 400 && value <= 600) {
            return 'linear-gradient(180deg, #5d606b, rgba(255, 255, 255, 0))'

        }
        if (value > 600 && value <= 800) {
            return 'linear-gradient(180deg, #2962ff4d, rgba(255, 255, 255, 0))'

        }
        if (value > 800 && value <= 1000) {
            return 'linear-gradient(180deg, #2962ffe6, rgba(255, 255, 255, 0))'

        }

        return 'linear-gradient(180deg, #F44336D6, rgba(255, 255, 255, 0))'
    }

    changeСolor(value) {
        if (value >= 0 && value <= 200) {
            return '#f44336'

        }
        if (value > 200 && value <= 400) {
            return '#862226'

        }
        if (value > 400 && value <= 600) {
            return '#5d606b'

        }
        if (value > 600 && value <= 800) {
            return '#0a44bd'

        }
        if (value > 800 && value <= 1000) {
            return '#2962ff'

        }
        return '#f44336'
    }
    currentValueText(value) {

        if (value >= 0 && value <= 200) {
            return "IRRESPONSIBLE"

        }
        if (value > 200 && value <= 400) {
            return "SELL"

        }
        if (value > 400 && value <= 600) {
            return "NEUTRAL"

        }
        if (value > 600 && value <= 800) {
            return "GOOD"

        }
        if (value > 800 && value <= 1000) {
            return "EXCELLENT"

        }

        return "IRRESPONSIBLE"
    }

    render() {
        return (
            <>
                <div className="speedometer" style={{
                    width: `${this.props.width}`,
                    height: `${this.props.height}`
                }}>
                    <div className="speedometer-center">

                    </div>
                    <div className="speedometer__bg"
                         style={{
                             top: `${this.props.top}`,
                             background: `${this.changeGradient(this.props.value)}`
                         }}
                    ></div>
                    <ReactSpeedometer
                        needleHeightRatio={0.7}
                        value={this.props.value}
                        segmentColors={['#f44336', '#862226', '#434651', '#143a87', '#2962ff']}
                        currentValueText={this.currentValueText(this.props.value)}
                        valueTextFontSize={this.props.valueTextFontSize}
                        customSegmentLabels={[
                            {
                                text: 'Irresponsible',
                                position: 'OUTSIDE',
                                color: '#949494',
                            },
                            {
                                text: 'Poor',
                                position: 'OUTSIDE',
                                color: '#949494',
                            },
                            {
                                text: 'Neutral',
                                position: 'OUTSIDE',
                                color: '#949494',
                            },
                            {
                                text: 'Good',
                                position: 'OUTSIDE',
                                color: '#949494',
                            },
                            {
                                text: 'Excellent',
                                position: 'OUTSIDE',
                                color: '#949494',
                            },
                        ]}
                        ringWidth={6}
                        needleTransitionDuration={3333}
                        needleTransition="easeElastic"
                        needleColor={'#888888'}
                        textColor={this.changeСolor(this.props.value)}
                        fluidWidth={7}
                        endColor={"#343434"}
                        paddingVertical={20}
                        labelFontSize={"10px"}
                    />
                    {
                        this.props.hideValues ? <div/> :
                            <div className="speedometer-data">
                                <div className="speedometer-data__top">
                                    <span className="one">{this.state.sell}</span>
                                    <span className="two">{this.state.neutral}</span>
                                    <span className="three">{this.state.buy}</span>
                                </div>
                                <div className="speedometer-data__bottom">
                                    <span>Sell</span>
                                    <span>
                                        Neutral</span>
                                    <span>Buy</span>
                                </div>
                            </div>
                    }
                </div>


            </>
        )
    }
}