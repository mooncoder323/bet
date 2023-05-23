import React, {Component} from 'react';
import {safelyNavigateToPage} from "../../Utilities/Tracking";

type HeaderProps = {
    pageLoadedAt: Date
}

class HeaderStatic extends Component<HeaderProps, any> {

    constructor(props: HeaderProps) {
        super(props);
    }

    render() {
        return (
            <header className="App-header alt-header">
                <ul className="HeaderLinks">
                    <li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/sports")}>Sports</a></li>
                    <li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/live-casino")}>Live Casino</a></li>
                    <li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/games")}>Games</a></li>
                </ul>
                <ul className="HeaderMisc">
                    <li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/safer-gambling")}>Safer Gambling</a></li>
                    <li>Help</li>
                </ul>
            </header>
        );
    }
}

export default HeaderStatic;