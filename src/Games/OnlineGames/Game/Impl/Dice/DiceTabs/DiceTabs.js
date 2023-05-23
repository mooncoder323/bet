import React, {Component} from 'react';
import PropTypes from "prop-types";
import DiceTab from "./DiceTab";


class DiceTabs extends Component {

    static propTypes = {
        children: PropTypes.instanceOf(Array).isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            activeTab: this.props.children[0].props.label,
        };
    }

    onClickTabItem = (tab) => {
        this.setState({ activeTab: tab });
    }

    render() {
        const {
            padding
        } = this.props;
        const {
            onClickTabItem,
            props: {
                children,
            },
            state: {
                activeTab,
            }
        } = this;

        return (
            <div className="dicetabs">
                <ol className="dicetab-list">
                    {
                        children.map((child) => {
                        const { label, logoStyle, logoWidth, url } = child.props;

                        return (
                            <DiceTab
                                activeTab={activeTab}
                                key={label}
                                logoWidth={logoWidth}
                                logoStyle={logoStyle}
                                label={label}
                                url={url}
                                padding={padding}
                                onClick={onClickTabItem}
                            />
                        );
                    })
                    }
                </ol>
                <div className="dicetab-content">
                    {children.map((child) => {
                        if (child.props.label !== activeTab) return undefined;
                        return child.props.children;
                    })}
                </div>
            </div>
        );
    }
}

export default DiceTabs;
