import React, {Component} from 'react';

import './Timeline.scss'
import {SessionActivity} from "../../API/Account/AccountOverviewResponse";

import moment from 'moment';

type TimelineProps = {
    recentActivity: Array<SessionActivity>,
}

export function formatDateTime(date: Date) {
    var newDate = moment(date);
    return newDate.format("MMMM DD - HH:mm")
}

class Timeline extends Component<TimelineProps, any> {

    getEntry(time: Date, title: string, duration: number) {
       let hr = Number(moment.utc(duration).format('HH'))
       let mn = Number(moment.utc(duration).format('mm'))
       let sc = Number(moment.utc(duration).format('ss'))
        let game;
       switch (title) {
           case 'PLAY_DICE_GAME': {
               game = 'Dice Game';
               break;
           }
           case 'PLAY_CRASH': {
               game = 'Crash';
               break;
           }
       }

        return (<li className="rb-item" ng-repeat="itembx">
            <div className="timestamp">
                {formatDateTime(time).substr(-5)}
            </div>
            <div className="item-title" style={{fontWeight: '800', color: '#b4b4b4'}}>Played {game}</div>
            {
                duration > (60000 * 60) ?
                    (<div className="item-title">{`${hr} hour${hr > 1 ? 's' : ''} & ${mn} mins`}</div>)
            :
                    (<div className="item-title">{`${mn} mins & ${sc} secs`}</div>)
            }

        </li>)
    }

    render() {
        return (
            <div className="container">
                    <div className="rb-container">
                        <ul className="rb">
                            {
                                this.props.recentActivity.reverse().map((activity: SessionActivity) => {
                                    return this.getEntry(activity.delta, activity.activity, activity.duration)
                                })
                            }
                        </ul>

                </div>
            </div>
        );
    }
}

export default Timeline;