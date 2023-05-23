import React, {Component} from 'react';
import '../../Assets/css/Games.scss';
import Footer from "../../Components/Footer/Footer";
import '../../Assets/css/Alt.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight} from "@fortawesome/free-solid-svg-icons";

type GamesState = {
}

class OnlineGamesSearch extends Component<any, GamesState> {

    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="BetlockerSplash">
                <div className="top-banner">
                <div className="AltContainer">
                    <div className="SearchResult">
                        <div className="SearchResultExamples">
                            <p>Example Searches</p>
                        </div>
                        <ul>
                            <li>Book Of <FontAwesomeIcon icon={faAngleRight} /> </li>
                            <li>Megaways <FontAwesomeIcon icon={faAngleRight} /></li>
                            <li>Age of the Gods <FontAwesomeIcon icon={faAngleRight} /></li>
                        </ul>
                    </div>
                </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

export default OnlineGamesSearch;