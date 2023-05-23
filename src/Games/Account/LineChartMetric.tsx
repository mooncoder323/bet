import React, {Component} from "react";
import {Line, LineChart, ResponsiveContainer} from "recharts";
import {gsap} from "gsap";
import {WinningBet} from "../../API/Account/AccountOverviewResponse";

type LineChartProps = {
	recentWins: Array<WinningBet>
	keys: Array<string>
}

export class LineChartMetric extends Component<LineChartProps, any> {

	constructor(props: LineChartProps) {
		super(props);
	}

	componentDidMount() {
		gsap.timeline().to(".history-m", {duration: 1.2, y: -35, opacity: 1, delay: 1.4});
	}

	render() {
		let mega = 0;
		this.props.recentWins.filter(w => w.mega).map(() => {
			mega++;
		})
			return (
				<div className='history-m MetricCard card-body d-flex col-lg-2 col-md-4 col-sm-12 align-items-center shadow mx-2 p-3 mb-3 rounded'>
					<div className='col-8 text-start ps-2'>
						<p className='h6 opacity-50'>Recent Wins</p>
						<div className="d-flex align-items-center">
							<div className="bg-primary bg-opacity-25 rounded px-2 mb-2">
								<span className="metric-blue">{this.props.recentWins.length}</span>
							</div>
							<div className="bg-success bg-opacity-25 rounded px-2 mb-2 ms-2">
								<span className="metric-red">{mega}</span>
							</div>
						</div>
					</div>

					<div className='col-2 d-flex align-items-end px-2 pb-2'>

						<ResponsiveContainer width='100%' height='100%' aspect={3}>
							<LineChart width={300} height={100} data={this.props.recentWins}>
								<Line
									type='monotone'
									dataKey="profit"
									dot={false}
									stroke='rgb(66, 133, 244)'
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
					<div className='col-2 opacity-50 d-flex align-items-center justify-content-end'>
					</div>
				</div>
			);
	}
}
