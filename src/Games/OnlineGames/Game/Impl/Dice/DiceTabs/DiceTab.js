import React, {Component} from 'react';
import PropTypes from "prop-types";


class DiceTab extends Component {

    static propTypes = {
        activeTab: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        url: PropTypes.string.isRequired,
    };

    onClick = () => {
        const { label, onClick } = this.props;
        onClick(label);
    }

    render() {
        const {
            onClick,
            props: {
                activeTab,
                label,
                url
            },
        } = this;
        const {
            padding,
        } = this.props;

        let className = 'dicetab-list-item';

        if (activeTab === label) {
            className += ' dicetab-list-active';
        }

        return (
            <li
                className={className}
                style={{
                    fontSize: 10,
                    paddingTop: padding ? padding : 30
                }}
                onClick={onClick}
            >

                <img src={url} style={this.props.logoStyle} width={this.props.logoWidth} />

                <span>{label}</span>
            </li>
        );
    }
}

export default DiceTab;
