import React, { Component } from 'react'
import {Performance} from "../../../API/Account/AccountActivityResponse";

type PerformanceProps = {
    performance: Performance
}

export default class CompanyPerformance extends Component<PerformanceProps, any> {

  constructor(props: PerformanceProps) {
      super(props)
      this.state = {
          labels: ["1D", "1W", "1M", "6M", "YTD", "1Y" ],
          percents: [-15 + Math.ceil(30 * Math.random()),
              -15 + Math.ceil(30 * Math.random()), -15 + Math.ceil(30 * Math.random()),
              -15 + Math.ceil(30 * Math.random()), -15 + Math.ceil(30 * Math.random()),
              -15 + Math.ceil(30 * Math.random())]
      }
  }

    render() {
      return (
          <div>
              <div className='performance_title'>Performance</div>
              <div className='performance_cards'>
                  { this.getPerformanceCard(this.props.performance.changeToday, 0) }
                  { this.getPerformanceCard(this.props.performance.changeWeek, 1) }
                  { this.getPerformanceCard(this.props.performance.changeMonth, 2) }
                  { this.getPerformanceCard(this.props.performance.changeSixMonth, 3) }
                  { this.getPerformanceCard(this.props.performance.changeYearToDate, 4) }
                  { this.getPerformanceCard(this.props.performance.changeYear, 5) }
              </div>
          </div>
      )
  }

    private getPerformanceCard(percent: number, index: number) {
      let background;
      if (percent == 0) {
          background = '#282828';
      } else if (percent <= -5) {
          background = '#58414AFF';
      } else if (percent <= 0) {
          background = '#faa1a41a';
      } else if (percent <= 5) {
          background = "#70ccbd1a"
      }  else if (percent > 5) {
          background = '#20321c';
      }
        return (
            <div className='performance_card'
                 style={{backgroundColor: background
                 }}>
                      <span className='performance_percentage'
                            style={{color: percent  == 0 ? '#ffca00' : percent  > 0 ? "#22ab94" : "#f7525f"}}>{percent}%</span>
                <span className='performance_period'>{this.state.labels[index]}</span>
            </div>
        )
    }
}
