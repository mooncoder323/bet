import React, {Component} from 'react';
import PropTypes from "prop-types";
import Tab from "./Tab";

class Tabs extends Component {

    static propTypes = {
        children: PropTypes.instanceOf(Array).isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            activeTab: this.props.children[props.defaultTab ? props.defaultTab : 0].props.label,
        };
        this.onClickTabItem = this.onClickTabItem.bind(this)
        this.setTab = this.setTab.bind(this)
    }

    onClickTabItem = (tab) => {
        if (tab) {
            this.setState({activeTab: tab});
        }
    }

    setTab(tab) {
        this.state.activeTab = this.props.children[tab].props.label
        this.setState({ activeTab: this.props.children[tab].props.label });
    }

    render() {
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
            <div className="locker-tabs">
                {
                    this.props.mobile ? <select className="tab-list-mobile" onChange={e => this.setTab(e.target.value)}>
                        {
                            children.map((child, index) => {
                                const { label, logoStyle, logoWidth, url, icon, fontSize, onTabClick } = child.props;
                                return <option value={index}>{label}</option>
                            })
                        }
                    </select> : <div />
                }

                <ol className={`locker-tab-list ${this.props.tabListSelector}`}>
                    {
                        children.map((child) => {
                        const { label, logoStyle, logoWidth, url, icon, fontSize, onTabClick } = child.props;
                        return (
                            <Tab
                                activeTab={activeTab}
                                key={label}
                                logoWidth={logoWidth}
                                logoStyle={logoStyle}
                                label={label}
                                fontSize={fontSize}
                                url={url}
                                onTabClick={onTabClick}
                                icon={icon}
                                onClick={onClickTabItem}
                            />
                        );
                    })
                    }
                </ol>
                <div className="locker-tab-content">
                    {children.map((child) => {
                        if (child.props.label !== activeTab) return undefined;
                        return child.props.children;
                    })}
                </div>
            </div>
        );
    }
}

export default Tabs;
