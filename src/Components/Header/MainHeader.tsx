import React, {Component} from 'react';

type HeaderProps = {
    openLoginModal: any
    username?: string
}

type HeaderState = {
    inPlay: boolean
}

class MainHeader extends Component<HeaderProps, HeaderState> {

    constructor(props: any) {
        super(props);
        this.state = {
            inPlay: false
        }
    }


    render() {
        return (
            <header className="MainHeader">
                <ul className="MainHeaderLogo">
                    <img src={"/assets/logo.png"}/>
                </ul>
                <ul className="MainHeaderPlayMode">
                    {/*<li className={!this.state.inPlay ? 'Active' : ''} onClick={() => this.setState({inPlay: false})}>Sports</li>*/}
                    {/*<li className={this.state.inPlay ? 'Active' : ''} onClick={() => this.setState({inPlay: true})}>In-Play</li>*/}
                </ul>
                {
                    this.props.username ? (<ul className="MainHeaderUser">
                        <li><span>{this.props.username}</span></li>
                    </ul>) : <ul className="MainHeaderUser">
                        <li><button>Join</button></li>
                        <li className="LoginButton" onClick={() => this.props.openLoginModal()}>Login</li>
                    </ul>
                }
            </header>
        );
    }
}

export default MainHeader;