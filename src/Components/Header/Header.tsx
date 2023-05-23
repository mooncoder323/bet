import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faSearch, faShieldAlt, faTimes} from "@fortawesome/free-solid-svg-icons";
import gsap from 'gsap';
import {currencies} from "../../Utilities/Currencies";
import {safelyNavigateToPage} from "../../Utilities/Tracking";

type HeaderProps = {
    username: string | undefined
    balance: number
    currency: string
    pageTitle: string
    active: number
    tab: number
    opacity: number
    searching: boolean
    options: Array<NavigationOption>
    openLoginModal: any
    switchTab: any
    setBalance: any
    toggleSearch: any

    pageLoadedAt: Date
}

export type NavigationOption = {
    option: string
    forceMobileNavigationBackground ?: boolean
}

type HeaderState = {
    expanded: boolean,
    xpDrops: Array<any>
}

class Header extends Component<HeaderProps, HeaderState> {

    constructor(props: HeaderProps) {
        super(props);
        this.state = {
            expanded: false,
            xpDrops: [],
        }
        this.animate = this.animate.bind(this)
        this.getHeader = this.getHeader.bind(this)
        this.getMobileHeader = this.getMobileHeader.bind(this)
    }

    private previousDrop: number = 0

    componentDidMount() {
        const client = new EventSource("https://betsse.onyxtechnology.co.uk/api/wallet/balance");
        client.addEventListener("balance_update",jmsevent => {
            if (jmsevent.data == 'keep-alive') return;
            let data = jmsevent.data.split(':')
            // @ts-ignore
            if (data[0].toLowerCase() == this.props.username.toLowerCase()) {
                let newBalance = Number(data[1])
                let diff = newBalance - this.props.balance
                if (this.previousDrop != diff) {
                    this.previousDrop = diff
                    this.addXpDrop(diff)
                    this.props.setBalance(newBalance)
                }
            }
        })
    }

    addXpDrop(value: number) {
        if (this.state.xpDrops.length > 5) {
            // @ts-ignore
            this.state.xpDrops = []
        }
        this.state.xpDrops.push({ animated: false, val: value, ref: {} })
        this.setState({ xpDrops: this.state.xpDrops }, () => this.animate())
    }

    animate() {
        this.state.xpDrops.map(d => {
            if (!d.animated) {
                d.animated = Date.now()
                gsap.timeline().to(d.ref, {duration: 1.2, y: -100, opacity: 0, delay: 1});
            }
        })
    }

    getHeader() {
        if (this.props.searching) {
            return (<div className={`Betlocker-Header Searching`}>
                <div className="Logo-Area">
                    <img src={"/assets/logo.png"}/>
                </div>
                <div className="Searchbar">
                    <div className="SearchIcon">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <div className="SearchbarInput">
                        <input type="text"/>
                    </div>
                </div>
                <div className="Search" onClick={() => this.props.toggleSearch()}><FontAwesomeIcon icon={faTimes} /></div>
                <div className="Login">
                    {
                        this.getAccountBar()
                    }
                </div>
            </div>);
        }
        return (<div className={`Betlocker-Header`}>
            <div className="Logo-Area">
                <img src={"/assets/logo.png"}/>
            </div>
            <div className="Games-Navigation">
                <ul>
                    {
                        this.props.options.map((o, index) => {
                            return <li style={{ padding: '10px 20px 8px 20px'}} onClick={() => this.props.switchTab(index)} key={index}><a className={index == this.props.tab ? 'Active' : ''} >{o.option}</a></li>
                        })
                    }
                </ul>
            </div>
            <div className="Search" onClick={() => this.props.toggleSearch()}><FontAwesomeIcon icon={faSearch} /></div>
            <div className="Login">
                {
                    this.getAccountBar()
                }
            </div>
        </div>)
    }

    getAccountBar() {
        if (this.props.username) {
            return (<ul className="MainHeaderUser">
                <li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/account")}><span>{this.props.username} ({currencies.get(this.props.currency)!!.symbol}{this.props.balance.toFixed(2)})</span></a>
                    <div className="XPDrops">
                        {
                            this.state.xpDrops.map((d, id) => {
                                return <div className={d.val > 0 ? "XPDrop Positive" : "XPDrop"} ref={r => d.ref = r} key={id}><img width={5} src={`/assets/currencies/${currencies.get(this.props.currency)!!.img}`} className="XPDropCurrency"/><div className="XPDropValue">{d.val.toFixed(2)}</div></div>
                            })
                        }
                    </div>
                </li>
            </ul>)
        }
        return (<ul className="MainHeaderUser">
            <li><button>Join</button></li>
            <li className="LoginButton" onClick={() => this.props.openLoginModal()}>Login</li>
        </ul>)
    }

    getMobileHeader() {
        if (this.props.searching) {
            return (<div className={`Betlocker-Mobile-Header Searching`}>
                <div className="MainContainer">
                    <div className="HeaderSpace">
                        <h3>{this.props.pageTitle}</h3>
                    </div>
                    <div className="Logo-Area" onClick={() => this.setState({expanded: !this.state.expanded})}>
                        <img src={"/assets/logo.png"}/>
                    </div>
                    <div className="Login">
                        {
                            this.getAccountBar()
                        }
                    </div>
                </div>
                <div className="Searchbar">
                    <div className="SearchIcon">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <div className="SearchbarInput">
                        <input type="text"/>
                    </div>
                    <div className="Search" onClick={() => this.props.toggleSearch()}><FontAwesomeIcon icon={faTimes} /></div>
                </div>
            </div>)
        }
        return (<div className={`Betlocker-Mobile-Header`}>
            <div className="MainContainer">
                <div className="HeaderSpace">
                    <h3>{this.props.pageTitle}</h3>
                </div>
                <div className="Logo-Area" onClick={() => this.setState({expanded: !this.state.expanded})}>
                    <img src={"/assets/logo.png"}/>
                </div>
                <div className="Login">
                    {
                        this.getAccountBar()
                    }
                </div>
            </div>
            <div className="Betlocker-Tabs">
                <div className="Search" onClick={() => this.props.toggleSearch()}><FontAwesomeIcon icon={faSearch} /></div>
                <div className="Games-Navigation">
                    <ul>
                        {
                            this.props.options.map((o, index) => {
                                return <li onClick={() => this.props.switchTab(index)} key={index}><a className={index == this.props.tab ? 'Active' : ''} >{o.option}</a></li>
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>)
    }

    render() {
        let forceState = this.props.options[this.props.tab].forceMobileNavigationBackground
        return (
            <>
                <header className="Alt-header-mobile" style={{ background: `rgba(34, 34, 34, ${forceState ? 1 : this.props.opacity})`}}>
                    <ul className={`HeaderLinks ${this.state.expanded ? 'LinksVisible' : ''}`}>
                        {/*<li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/sports")} className={`${this.props.active == 1 ? 'Active' : ''}`}>Sports</a></li>*/}
                        {/*<li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/live-casino")} className={`${this.props.active == 2 ? 'Active' : ''}`}>Live Casino</a></li>*/}
                        <li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/")} className={`${this.props.active == 0 ? 'Active' : ''}`}>Home</a></li>
                        <li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/games")} className={`${this.props.active == 3 ? 'Active' : ''}`}>Games</a></li>
                    </ul>
                    {
                        this.getMobileHeader()
                    }
                </header>
                <header className="Alt-header" style={{ background: `rgba(34, 34, 34, ${forceState ? 1 : this.props.opacity})`}}>
                    <ul className="DesktopHeaderLinks">
                        {/*<li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/sports")} className={`${this.props.active == 1 ? 'Active' : ''}`}>Sports</a></li>*/}
                        {/*<li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/live-casino")} className={`${this.props.active == 2 ? 'Active' : ''}`}>Live Casino</a></li>*/}
                        <li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/")} className={`${this.props.active == 0 ? 'Active' : ''}`}>Home</a></li>
                        <li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/games")} className={`${this.props.active == 3 ? 'Active' : ''}`}>Games</a></li>
                    </ul>
                    <ul className="HeaderMisc DesktopHeaderLinks">
                        <li><a onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, "/safer-gambling")} className={`${this.props.active == 4 ? 'Active' : ''}`}> <FontAwesomeIcon icon={faShieldAlt} /> Safer Gambling</a></li>
                    </ul>
                    {
                        this.getHeader()
                    }
                </header>
            </>
        );
    }
}

export default Header;