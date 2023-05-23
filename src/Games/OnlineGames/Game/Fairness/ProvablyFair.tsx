import React, {Component, RefObject} from 'react';
import {SliderThumb} from "@mui/material";
import {RollSlider} from "./FairnessSlider";
import Tabs from "../../../../Components/Tabs/Tabs";
import {ProvablyFairSet} from "./ProvablyFairSet";

function RollSliderThumbComponent(props: any) {
    const { children, ...other } = props;
    return (
        <SliderThumb {...other}>
            {children}
            <img src="/assets/games/dice.svg" width={50}/>
        </SliderThumb>
    );
}

type ProvablyFairProps = {
    clientSeed?: string
    verifying?: ProvablyFairSet
    changeSeed: any
    setClientSeed: any
}

type ProvablyFairState = {
    changingSeed: boolean
    forceProofTab?: boolean
}

class ProvablyFair extends Component<ProvablyFairProps, ProvablyFairState> {

    private tabs: RefObject<HTMLInputElement> | undefined;
    private slider: RefObject<HTMLInputElement> | undefined;

    constructor(props: any) {
        super(props);
        this.state = {
            changingSeed: false,
        }
        this.forceProofTab = this.forceProofTab.bind(this)
    }

    forceProofTab() {
        //@ts-ignore
        this.tabs.setTab(1)
    }

    render() {
        return (
                <div className="FairnessModalTabs">
                    {/* @ts-ignore */}
                    <Tabs ref={r => this.tabs = r}>
                        {/* @ts-ignore */}
                        <div label="Seeds">
                            <div className="FairnessCanvas">
                                <div className="CanvasRow">
                                    <div className="RowHeader">
                                        <div className="Left">Active Client Seed</div>
                                    </div>
                                    <div className="RowHeader">
                                        <div className="CanvasField">
                                            <div className="AmountField">
                                                <div className="IconValue">
                                                    <div className="ProfitCurrency">⏳</div>
                                                    <div className="ProfitValueCopy">{this.props.clientSeed}</div>
                                                    <div className="ProfitCopyButton"><img width={14} src="/assets/games/copy.svg" /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <br/>
                                <div className="CanvasRow">
                                    <div className="RowHeader">
                                        <div className="Left">Active Server Seed (Hashed)</div>
                                    </div>
                                    <div className="RowHeader">
                                        <div className="CanvasField">
                                            <div className="AmountField">
                                                <div className="IconValue">
                                                    <div className="ProfitCurrency">⏳</div>
                                                    <div className="ProfitValueCopy"> </div>
                                                    <div className="ProfitCopyButton"><img width={14} src="/assets/games/copy.svg" /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <div className="CanvasRow">
                                    <div className="RowHeader">
                                        <div className="Left">Total bets made with pair</div>
                                    </div>
                                    <div className="RowHeader">
                                        <div className="CanvasField">
                                            <div className="AmountField">
                                                <div className="IconValue">
                                                    <div className="ProfitValue">NaN</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="SeedSettings">
                                <div className="FairnessCanvas">
                                    <div className="SeedHeading">
                                        <h2>Rotate Seed Pair</h2>
                                    </div>
                                    <div className="CanvasRow">
                                        <div className="RowHeader">
                                            <div className="Left">New Client Seed</div>
                                        </div>
                                        <div className="RowHeader">
                                            <div className="CanvasField">
                                                <div className="AmountField">
                                                    <div className="IconValue">
                                                        <div className="ProfitValueChange">{ this.state.changingSeed ? "-" : this.props.clientSeed}</div>
                                                        <div className="ProfitChangeButton" onClick={() => {
                                                            this.setState({changingSeed: true}, () => {
                                                                this.props.changeSeed().then((seed: string) => {
                                                                    this.props.setClientSeed(seed)
                                                                    this.setState({changingSeed: false})
                                                                })
                                                            })
                                                        }}>{ this.state.changingSeed ? "..." : 'Change'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="CanvasRow">
                                        <div className="RowHeader">
                                            <div className="Left">Next Server Seed (Hashed)</div>
                                        </div>
                                        <div className="RowHeader">
                                            <div className="CanvasField">
                                                <div className="AmountField">
                                                    <div className="IconValue">
                                                        <div className="ProfitCurrency">⏳</div>
                                                        <div className="ProfitValueCopy"> </div>
                                                        <div className="ProfitCopyButton"><img width={14} src="/assets/games/copy.svg" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* @ts-ignore */}
                        <div label="Verify">
                            <div className="FairnessCanvas">
                                <div className="Full RollSlider">
                                    <RollSlider
                                        ref={this.slider}
                                        slots={{thumb: RollSliderThumbComponent}}
                                        getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                                        defaultValue={this.props.verifying ? this.props.verifying.value : 50}
                                        disabled={true}
                                        key={this.props.verifying ? this.props.verifying.value : 50}
                                        valueLabelDisplay="on"
                                        onChange={(e) => {

                                        }}
                                        marks={[{value: 0, label: '0',}, {value: 100, label: '100'}]}
                                    />
                                </div>
                            </div>
                            <div className="SeedValidation">
                                <div className="FairnessCanvas">
                                    <br/>
                                    <div className="CanvasRow">
                                        <div className="RowHeader">
                                            <div className="Left">Client Seed</div>
                                        </div>
                                        <div className="RowHeader">
                                            <div className="CanvasField">
                                                <div className="AmountField">
                                                    <div className="IconValue">
                                                        <div className="ProfitValue" style={{textTransform: 'none'}}>{this.props.verifying ? this.props.verifying.clientSeed : '-'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="CanvasRow">
                                        <div className="RowHeader">
                                            <div className="Left">Server Seed</div>
                                        </div>
                                        <div className="RowHeader">
                                            <div className="CanvasField">
                                                <div className="AmountField">
                                                    <div className="IconValue">
                                                        <div className="ProfitValue" style={{textTransform: 'none'}}    >{this.props.verifying ? this.props.verifying.serverSeed : '-' }</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="CanvasRow">
                                        <div className="RowHeader">
                                            <div className="Left">Nonce</div>
                                        </div>
                                        <div className="RowHeader">
                                            <div className="CanvasField">
                                                <div className="AmountField">
                                                    <div className="IconValue">
                                                        <div className="ProfitValue">{this.props.verifying ? this.props.verifying.nonce : '-' }</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Tabs>
                </div>
        );
    }
}

export default ProvablyFair;