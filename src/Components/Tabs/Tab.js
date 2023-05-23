import React, {Component} from 'react';
import PropTypes from "prop-types";

class Tab extends Component {

    static propTypes = {
        activeTab: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        url: PropTypes.string.isRequired,
    };

    onClick = () => {
        const { label, onClick, onTabClick } = this.props;
        if (onTabClick) {
            onTabClick();
        }
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

        let className = 'locker-tab-list-item';
        if (this.props.icon) {
            className += ' locker-tab-list-icon';
        }
        if (activeTab === label) {
            className += ' locker-tab-list-active';
        }

        return (
            <li
                className={className}
                style={{
                    fontSize: this.props.fontSize ? this.props.fontSize : 10,
                    paddingTop: 30
                }}
                onClick={onClick}
            >
                {
                    this.props.icon ? this.props.icon : <div />
                }
                <p>{label}</p>
            </li>
        );
    }
}

export default Tab;
