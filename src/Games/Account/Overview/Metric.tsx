import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {gsap} from "gsap";
import {IconDefinition} from "@fortawesome/fontawesome-common-types";

type MetricProps = {
    keys: Array<string>
    title: string
    value: string
    highlight: string,
    icon: IconDefinition
}

export default class Metric extends Component<MetricProps> {
    constructor(props: MetricProps) {
        super(props);
    }

    componentDidMount() {
        gsap.timeline().to(".gross", {duration: 1.2, y: -35, opacity: 1, delay: 1.1});
    }

    render() {
        return (
            <div
                className='gross MetricCard card-body d-flex col-lg-2 col-md-4 col-sm-12 align-items-center shadow mx-2 p-3 mb-3 rounded'>
                <div className='col-6 text-start ps-2'>
                    <p className='h6 opacity-50'>{this.props.title}</p>
                    <p className='h5'>{this.props.value}</p>
                </div>
                <div className=' col-3  bg-success bg-opacity-25 rounded px-1 mt-3 justify-content-start'>
                    <span className='text-success'>{this.props.highlight}</span>
                </div>
                <div className='col-3 opacity-50 text-end'>
                    <FontAwesomeIcon icon={this.props.icon} className="metric-card-logo"/>
                </div>
            </div>
        );
    }
}
