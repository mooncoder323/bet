import React, {Component} from 'react';
import {CarouselProperties} from "./CarouselProperties";
import {CarouselItem} from "./CarouselItem";
import {safelyNavigateToPage} from "../../Utilities/Tracking";

class Carousel extends Component<CarouselProperties, any> {

    constructor(props: CarouselProperties) {
        super(props);
    }

    render() {
        return (
            <div id="custom-carousel">
                {
                    this.props.items.map((item: CarouselItem) => {
                        return (
                            <div className="custom-carousel-item"
                                 style={{ backgroundImage: `url(${item.splash})`}}
                                 onClick={() => safelyNavigateToPage(this.props.pageLoadedAt, item.url)}
                            />
                        )
                    })
                }
            </div>
        );
    }
}

export default Carousel;