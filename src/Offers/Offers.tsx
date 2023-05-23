import {Offer} from "../Components/Offer/Offer";
import {safelyNavigateToPage} from "../Utilities/Tracking";
import React from "react";

export function getOffers(pageLoadedAt: Date, offers: Array<Offer>) {
    return (<div className="Offers">
        {
            offers.map((offer: Offer) => {
                return <div className="Offer" style={{ backgroundImage: `url(${offer.splash})`}}>
                    <div className="offer-banner__background-overlay">
                        <div className="offer-banner__header-container">
                            <span className="offer-banner__header-text">{offer.title}</span>
                            <span className="offer-banner__sub-header-text">{offer.prize}</span>
                        </div>
                        <div className="offer-banner__button-container">
                            <button onClick={() => safelyNavigateToPage(pageLoadedAt, offer.url)}>{offer.action}</button>
                        </div>
                        <p>{offer.terms}</p>
                    </div>
                </div>
            })
        }
    </div>)
}