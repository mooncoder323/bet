import React, { Component, RefObject, useRef, useLayoutEffect, useState, useEffect, MouseEventHandler, MouseEvent } from 'react';

import './Roulette.scss'
import { log } from 'console';

interface HistroyProps {
    index: number,
    currentValue: string
}

export type ButtonProps = {
    options: Array<number>;
    ballScreen: Array<string>;
    setBallScreen: Function;
    chipValue: string;
    IndexNumber: any;
    label: string;
    minValue: number;
    maxValue: number;
    color_list: Array<number>;
    history: HistroyProps[];
    setHistory: Function;
    setChipCount: Function;
    chipCount: Array<number>;
}

const EffectButton: React.FC<ButtonProps> = (props: ButtonProps) => {

    const {
        options,
        ballScreen,
        setBallScreen,
        chipValue,
        IndexNumber,
        label,
        minValue,
        maxValue,
        color_list,
        history,
        setHistory,
        chipCount,
        setChipCount
    } = props

    const brihtness_change = (event: any, ele: number, id: number, brightnessValue: number) => {
        switch (label) {
            case '1 to 12':
                if (id % 12 >= minValue && id % 12 < maxValue) {
                    document.getElementById(id.toString())!.style.filter = "brightness(" + brightnessValue + ")";
                    event.target.style.filter = "brightness(" + brightnessValue + ")";
                }
                break;
            case '13 to 24':
                if (id % 12 >= minValue && id % 12 < maxValue) {
                    document.getElementById(id.toString())!.style.filter = "brightness(" + brightnessValue + ")";
                    event.target.style.filter = "brightness(" + brightnessValue + ")";
                }
                break;
            case '25 to 36':
                if (id % 12 >= minValue && id % 12 < maxValue) {
                    document.getElementById(id.toString())!.style.filter = "brightness(" + brightnessValue + ")";
                    event.target.style.filter = "brightness(" + brightnessValue + ")";
                }
                break;
            case '1 to 18':
                if (ele < 19) {
                    document.getElementById(id.toString())!.style.filter = "brightness(" + brightnessValue + ")";
                    event.target.style.filter = "brightness(" + brightnessValue + ")";
                }
                break;
            case 'Even':
                if (ele % 2 === 0) {
                    document.getElementById(id.toString())!.style.filter = "brightness(" + brightnessValue + ")";
                    event.target.style.filter = "brightness(" + brightnessValue + ")";
                }
                break;
            case '':
                if (color_list.find((item: any) => item === ele)) {
                    document.getElementById(id.toString())!.style.filter = "brightness(" + brightnessValue + ")";
                    event.target.style.filter = "brightness(" + brightnessValue + ")";
                }
                break;
            case ' ':
                if (!color_list.find((item: any) => item === ele)) {
                    document.getElementById(id.toString())!.style.filter = "brightness(" + brightnessValue + ")";
                    event.target.style.filter = "brightness(" + brightnessValue + ")";
                }
                break;
            case 'Odd':
                if (ele % 2 === 1) {
                    document.getElementById(id.toString())!.style.filter = "brightness(" + brightnessValue + ")";
                    event.target.style.filter = "brightness(" + brightnessValue + ")";
                }
                break;
            case '19 to 36':
                if (ele >= 19) {
                    document.getElementById(id.toString())!.style.filter = "brightness(" + brightnessValue + ")";
                    event.target.style.filter = "brightness(" + brightnessValue + ")";
                }
                break;
            default:
                break;
        }
    }

    return (
        <div
            className={label === '' ? 'red' : ''}
            onMouseOver={(event: any) => {
                options.map((ele, id) => {
                    brihtness_change(event, ele, id, 1.4);
                })
            }}
            onMouseLeave={(event: any) => {
                options.map((ele, id) => {
                    brihtness_change(event, ele, id, 1);
                })
            }}
            onClick={(event: any) => {
                event.target.style.filter = "brightness(1)";
                setBallScreen(ballScreen.map((el, i) => {
                    if (i === IndexNumber) {
                        chipValue !== "0" && setHistory([...history, { index: IndexNumber, currentValue: el }]);
                        return (el ? calculatorChip(chipValue, el) : chipValue)
                    } else {
                        return el
                    }
                }))
                history.map((ele) => {
                    ele.index === IndexNumber && chipValue !== "0" && setChipCount(chipCount.map((e, i) => i === IndexNumber ? e + 1 : e));
                })
            }}> {(ballScreen[IndexNumber] && Number(ballScreen[IndexNumber]) !== 0) ? '' : label}
            {
                (ballScreen[IndexNumber] && Number(ballScreen[IndexNumber]) !== 0) && [...new Array(chipCount[IndexNumber] > 4 ? 4 : chipCount[IndexNumber])].map((ele, i) => <div style={{ top: - (i + 1) * 5 + "px" }} className={(Number(ballScreen[IndexNumber].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 10 && (ballScreen[IndexNumber][ballScreen[IndexNumber].length - 1] === "M" || ballScreen[IndexNumber][ballScreen[IndexNumber].length - 1] === "B")) ? 'ball text-green chip-green' : ((Number(ballScreen[IndexNumber].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 1 && (ballScreen[IndexNumber][ballScreen[IndexNumber].length - 1] === "M" || ballScreen[IndexNumber][ballScreen[IndexNumber].length - 1] === "B")) ? 'ball chip-green' : 'ball')}>{i === (chipCount[IndexNumber] - 1 > 3 ? 3 : chipCount[IndexNumber] - 1) && ballScreen[IndexNumber]}</div>)
            }
        </div >
    )
}

const calculatorChip = (chipValue: string, currentValue: string) => {

    if (Number(currentValue) === 0) {
        return chipValue;
    }

    var regex = /[\d|,|.|E|\+]+/g;
    let chipV = chipValue.match(regex)?.join("");
    let currentV = currentValue.match(regex)?.join("");
    let current_unit = currentValue[currentValue.length - 1];
    let chip_unit = chipValue[chipValue.length - 1];
    let NewchipV: number = 0.0;
    switch (current_unit) {
        case "B":
            NewchipV = ChangeVaule(chipV, chip_unit, 1);
            break;
        case "M":
            NewchipV = ChangeVaule(chipV, chip_unit, 2);
            break;
        case "K":
            NewchipV = ChangeVaule(chipV, chip_unit, 3);
            break;
    }

    let result = NewchipV + Number(currentV);

    if (result >= 1000000) {
        result /= 1000;
        if (result >= 1000) return displayDecimal(result / 1000) + (current_unit === "K" ? "M" : current_unit === "M" ? "B" : "T");
        return displayDecimal(result) + (current_unit === "K" ? "M" : current_unit === "M" ? "B" : "T");
    }

    if (result >= 1000) {
        return current_unit !== "B" ? (result / 1000) + (current_unit === "K" ? "M" : current_unit === "M" ? "B" : "T") : displayDecimal(result / 1000) + "T";
    }
    return displayDecimal(result) + current_unit;

}

const displayDecimal = (num: number) => {
    if (Number.isInteger(num)) {
        return num;
      } else {
        return num.toFixed(2);
      }
}

const ChangeVaule = (chipV: any, chip_unit: string, balance: number) => {

    switch (balance) {
        case 1:
            if (chip_unit === "B")
                return Number(chipV);
            else if (chip_unit === "M")
                return Number(chipV) / 1000;
            else return Number(chipV) / (1000 * 1000);
        case 2:
            if (chip_unit === "B")
                return Number(chipV) * 1000;
            else if (chip_unit === "M")
                return Number(chipV);
            else return Number(chipV) / (1000);
        case 3:
            if (chip_unit === "B")
                return Number(chipV) * 1000 * 1000;
            else if (chip_unit === "M")
                return Number(chipV) * 1000;
            else return Number(chipV);
        default:
            return Number(chipV);
    }

}

let Interval: any;
let Animate_Interval: any;

const Roulette: any = (rest: any) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const RoulettePanel = useRef<HTMLDivElement>(null);
    const ImgRef = useRef<HTMLImageElement>(null);
    let roulette: any = canvasRef.current;
    const [size, setSize] = useState<Array<number>>([400, 200]);
    const [betList, setBetList] = useState<Array<number>>([]);
    const [chipValue, setChipValue] = useState("0");
    const [ballScreen, setBallScreen] = useState<Array<string>>([]);
    const [history, setHistory] = useState<HistroyProps[]>([]);
    const [chipCount, setChipCount] = useState<Array<number>>([]);

    useLayoutEffect(() => {
        function updateSize() {
            roulette = RoulettePanel.current;
            setSize([
                roulette!.clientWidth,
                roulette!.clientHeight,
            ]);
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    var options = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

    var color_list = [1, 3, 5, 7, 9, 12, 14, 16, 18, 21, 19, 23, 27, 25, 30, 32, 34, 36];

    var button_list = ['1 to 18', 'Even', '', ' ', 'Odd', '19 to 36'];

    var startAngle = 0;
    var arc = Math.PI / (options.length / 2);
    var spinTimeout: any = null;

    var spinArcStart = 10;
    var spinTime = 0;
    var spinTimeTotal = 0;
    var spinAngleStart = 0;

    var ctx: any;

    window.onscroll = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        spin();
        setBallScreen(
            [...new Array(50)].map(ele => '')
        )
        setChipCount(
            [...new Array(50)].map(ele => 1)
        )

    }, []);

    useEffect(() => setChipValue(rest.chip_value), [rest.chip_value])

    useEffect(() => {
        if (ballScreen.length) {
            let total = "0K";
            ballScreen.map((ele, id) => {
                if(ele) total = calculatorChip(ele, total);                
            });
            console.log("total" , total[total.length - 1] === "M" ? Number(total.slice(0, total.length - 1)) * 1000 : (total[total.length - 1] === "B" ? Number(total.slice(0, total.length - 1)) * 1000 * 1000 : Number(total.slice(0, total.length - 1))));
            
            rest.setState(total[total.length - 1] === "M" ? Number(total.slice(0, total.length - 1)) * 1000 : (total[total.length - 1] === "B" ? Number(total.slice(0, total.length - 1)) * 1000 * 1000 : Number(total.slice(0, total.length - 1))) )
        }
    }, [ballScreen]);

    useEffect(() => {
        console.log(rest.bet_number, Interval);

        if (rest.bet_number) {
            clearInterval(Interval);
            setBetList([rest.bet_number, ...betList]);

            const canvas = canvasRef.current;
            ctx = canvas!.getContext("2d");

            ballAnimation(ctx, canvas);

            setTimeout(() => {

                clearInterval(Animate_Interval);
                Interval = setInterval(() => {
                    var regex = /[\d|,|.|E|\+]+/g;
                    var strings: any = ImgRef.current?.style.transform;
                    var matches = strings.match(regex);
                    ctx.clearRect(0, 0, 500, 500);
                    let index: number = 0;
                    options.map((ele, id) => ele === rest.bet_number ? index = id : "");
                    let degree = - (Number(matches[0]) % 360) + (360 / 37 * index);
                    ctx.clearRect(0, 0, canvas?.clientWidth, canvas?.clientHeight);
                    ctx.beginPath();
                    ctx.save();
                    ctx.translate(150, 160);
                    ctx.rotate(degree * Math.PI / 180);
                    ctx.arc(8, -98, 9, 0, 2 * Math.PI);
                    ctx.fillStyle = "#ffffff";
                    ctx.fill();
                    ctx.restore();

                }, 5)
            }, 2700);

        }

    }, [rest.bet_number]);

    const ballAnimation = (ctx: CanvasRenderingContext2D, canvas: any) => {
        let speed = 0;
        let degree = 0;

        Animate_Interval = setInterval(() => {

            ctx.clearRect(0, 0, 500, 500);
            degree = 500 / 120 * speed;
            ctx.beginPath();
            ctx.save();
            ctx.translate(150, 160);
            ctx.rotate(degree * Math.PI / 180);
            ctx.arc(8, -140, 9, 0, 2 * Math.PI);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.restore();
            speed += 1;

        }, 10);

        setTimeout(() => {
            let distance = 140 - 100;
            let id = 0;
            clearInterval(Animate_Interval);
            let between_degree: number = 0;
            let width = -140;

            Animate_Interval = setInterval(() => {

                var regex = /[\d|,|.|E|\+]+/g;
                var strings: any = ImgRef.current?.style.transform;
                var matches = strings.match(regex);
                ctx.clearRect(0, 0, 500, 500);
                let index: number = 0;
                options.map((ele, id) => ele === rest.bet_number ? index = id : "");
                if (between_degree === 0) between_degree = (- (Number(matches[0]) % 360) + (360 / 37 * index) - 60 + 20) > 0 ? - (Number(matches[0]) % 360) + (360 / 37 * index) - 65 + 220 : - (Number(matches[0]) % 360) + (360 / 37 * index) - 60 + 220 + 360;
                ctx.beginPath();
                ctx.save();
                ctx.translate(150, 160);
                if (id <= 100) {
                    degree = -220 + between_degree / 100 * id;

                    ctx.rotate(degree * Math.PI / 180);
                    if (Math.floor(id / 10) % 2 !== 0) {
                        width = width + (distance / -45);

                    } else {
                        width = width + (distance / 25);
                    }
                    ctx.arc(8, width, 9, 0, 2 * Math.PI);
                    ctx.fillStyle = "#ffffff";
                    ctx.fill();
                    ctx.restore();
                } else {
                    ctx.rotate(degree * Math.PI / 180);
                    if (Math.floor(id / 10) % 2 !== 0) {
                        width = - 100 - (distance / 360);

                    } else {
                        width = -109 + (distance / 360);
                    }
                    ctx.arc(8, width, 9, 0, 2 * Math.PI);
                    ctx.fillStyle = "#ffffff";
                    ctx.fill();
                    ctx.restore();
                }
                id++;

            }, 12.5);
        }, 1200);
    }

    const number_order = () => {

        let number: Array<number> = [];
        let number1: Array<number> = [];
        let number2: Array<number> = [];
        [...new Array(36)].map((ele, id) => {
            if ((id + 1) % 3 === 0) {
                number.push(id + 1);
            }
            else if ((id + 1) % 3 === 2) {
                number1.push(id + 1);
            }
            else if ((id + 1) % 3 === 1) {
                number2.push(id + 1);
            }
        }
        )
        return number.concat(number1).concat(number2);

    }

    function drawRouletteWheel() {
        const canvas = canvasRef.current;
        if (canvas?.getContext) {

            ctx = canvas.getContext("2d");

            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;

            ctx.font = 'bold 12px Helvetica, Arial';
            ctx.beginPath();

            ImgRef.current!.style.transform = "rotate(-" + startAngle * 180 / Math.PI + "deg)";

        }
    }

    function spin() {
        spinAngleStart = 0.6;
        spinTime = 0;
        spinTimeTotal = Math.random() * 3 + 4 * 1000;
        rotateWheel();
    }

    function rotateWheel() {
        spinTime = 10;
        var spinAngle = spinAngleStart
        startAngle += (spinAngle * Math.PI / 180);
        drawRouletteWheel();
        spinTimeout = setTimeout(() => rotateWheel(), 30);
    }

    drawRouletteWheel();

    return (
        <div className='game-roulette'>
            <div className='main'>
                <div className='display_bet'>
                    {
                        rest.bet_number ? (
                            rest.bet_number == 0 ?
                                <div className="green">{rest.bet_number}</div> :
                                color_list.find(item => item === rest.bet_number) ?
                                    <div className="red">{rest.bet_number}</div> :
                                    <div className="grey">{rest.bet_number}</div>
                        ) :
                            <div className="grey"></div>
                    }
                </div>
                <div className='roulette-panel' ref={RoulettePanel}>
                    <canvas id="canvas" width="300" height="300" ref={canvasRef}></canvas>
                    <img src='/assets/games/online/roulette/Wheel.svg' className='wheel' ref={ImgRef} />
                </div>
                <div className='betting_history'>
                    {
                        betList.length !== 0 && (
                            betList.map((ele, id) => ele == 0 ?
                                <div className="green" key={id} style={{ opacity: 1 - id / 6 }}>{ele}</div> :
                                color_list.find(item => item === ele) ?
                                    <div className="red" style={{ opacity: 1 - id / 6 }}>{ele}</div> :
                                    <div className="grey" style={{ opacity: 1 - id / 6 }}>{ele}</div>
                            )
                        )
                    }
                </div>
            </div>
            <div className='number'>
                <div className='number-area'>
                    <div className='zero green'
                        onMouseOver={(event: any) => {
                            event.target.style.filter = "brightness(1.3)";
                        }}
                        onMouseLeave={(event: any) => {
                            event.target.style.filter = "brightness(1)";
                        }}
                        onClick={(event: any) => {
                            event.target.style.filter = "brightness(1)"; setBallScreen(ballScreen.map((el, i) => {
                                if (i === 48) {
                                    chipValue !== "0" && setHistory([...history, { index: 48, currentValue: el }]);
                                    return (el ? calculatorChip(chipValue, el) : chipValue)
                                } else {
                                    return el
                                }
                            }))
                            history.map((ele) => {
                                (ele.index === 48 && chipValue !== "0") && setChipCount(chipCount.map((e, i) => i === 48 ? e + 1 : e));
                            })
                        }}>{'0'}
                        {
                            (ballScreen[48] && Number(ballScreen[48]) !== 0) && [...new Array(chipCount[48] > 4 ? 4 : chipCount[48])].map((ele, i) => <div style={{ top: - (i + 1) * 5 + "px" }} className={(Number(ballScreen[48].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 10 && (ballScreen[48][ballScreen[48].length - 1] === "M" || ballScreen[48][ballScreen[48].length - 1] === "B")) ? 'ball text-green' : ((Number(ballScreen[48].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 1 && (ballScreen[48][ballScreen[48].length - 1] === "M" || ballScreen[48][ballScreen[48].length - 1] === "B")) ? 'ball chip-green' : 'ball')}>{i === (chipCount[48] - 1 > 3 ? 3 : chipCount[48] - 1) && ballScreen[48]}</div>)
                        }
                    </div>
                    <div className='tops'>
                        <div className='number_list'>
                            {
                                number_order().map((ele, id) =>
                                    color_list.find(item => item === ele) ?
                                        <div
                                            key={id}
                                            className="red"
                                            id={id.toString()}
                                            onMouseOver={(event: any) => {
                                                event.target.style.filter = "brightness(1.5)";
                                            }}
                                            onMouseLeave={(event: any) => {
                                                event.target.style.filter = "brightness(1)";
                                            }}
                                            onClick={(event: any) => {
                                                event.target.style.filter = "brightness(1)";
                                                setBallScreen(ballScreen.map((el, i) => {
                                                    if (i === id) {
                                                        chipValue !== "0" && setHistory([...history, { index: id, currentValue: el }]);
                                                        return (el ? calculatorChip(chipValue, el) : chipValue)
                                                    } else {
                                                        return el
                                                    }
                                                }))
                                                history.map((ele) => {
                                                    (ele.index === id && chipValue !== "0") && setChipCount(chipCount.map((e, i) => i === id ? e + 1 : e));
                                                })
                                            }}>{ele}
                                            {
                                                (ballScreen[id] && Number(ballScreen[id]) !== 0) && [...new Array(chipCount[id] > 4 ? 4 : chipCount[id])].map((ele, i) => <div style={{ top: - (i + 1) * 5 + "px" }} className={(Number(ballScreen[id].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 10 && (ballScreen[id][ballScreen[id].length - 1] === "M" || ballScreen[id][ballScreen[id].length - 1] === "B")) ? 'ball text-green chip-green' : ((Number(ballScreen[id].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 1 && (ballScreen[id][ballScreen[id].length - 1] === "M" || ballScreen[id][ballScreen[id].length - 1] === "B")) ? 'ball chip-green' : 'ball')}>{i === (chipCount[id] - 1 > 3 ? 3 : chipCount[id] - 1) && ballScreen[id]}</div>)
                                            }
                                        </div> :
                                        <div
                                            key={id}
                                            className="grey"
                                            id={id.toString()}
                                            onMouseOver={(event: any) => {
                                                event.target.style.filter = "brightness(1.5)";
                                            }}
                                            onMouseLeave={(event: any) => {
                                                event.target.style.filter = "brightness(1)";
                                            }}
                                            onClick={(event: any) => {
                                                event.target.style.filter = "brightness(1)";
                                                setBallScreen(ballScreen.map((el, i) => {
                                                    if (i === id) {
                                                        chipValue !== "0" && setHistory([...history, { index: id, currentValue: el }]);
                                                        return (el ? calculatorChip(chipValue, el) : chipValue)
                                                    } else {
                                                        return el
                                                    }
                                                }))
                                                history.map((ele) => {
                                                    (ele.index === id && chipValue !== "0") && setChipCount(chipCount.map((e, i) => i === id ? e + 1 : e));
                                                })
                                            }}>{ele}
                                            {
                                                (ballScreen[id] && Number(ballScreen[id]) !== 0) && [...new Array(chipCount[id] > 4 ? 4 : chipCount[id])].map((ele, i) => <div style={{ top: - (i + 1) * 5 + "px" }} className={(Number(ballScreen[id].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 10 && (ballScreen[id][ballScreen[id].length - 1] === "M" || ballScreen[id][ballScreen[id].length - 1] === "B")) ? 'ball text-green chip-green' : ((Number(ballScreen[id].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 1 && (ballScreen[id][ballScreen[id].length - 1] === "M" || ballScreen[id][ballScreen[id].length - 1] === "B")) ? 'ball chip-green' : 'ball')}>{i === (chipCount[id] - 1 > 3 ? 3 : chipCount[id] - 1) && ballScreen[id]}</div>)
                                            }
                                        </div>
                                )
                            }
                        </div>

                        <div className='number_bottom'>
                            <div className='main'>
                                <div>
                                    <EffectButton
                                        options={options}
                                        ballScreen={ballScreen}
                                        setBallScreen={setBallScreen}
                                        chipValue={chipValue}
                                        IndexNumber={36}
                                        label={'1 to 12'}
                                        minValue={0}
                                        maxValue={4}
                                        color_list={color_list}
                                        history={history}
                                        setHistory={setHistory}
                                        chipCount={chipCount}
                                        setChipCount={setChipCount}
                                    />
                                    <EffectButton
                                        options={options}
                                        ballScreen={ballScreen}
                                        setBallScreen={setBallScreen}
                                        chipValue={chipValue}
                                        IndexNumber={37}
                                        label={'13 to 24'}
                                        minValue={4}
                                        maxValue={8}
                                        color_list={color_list}
                                        history={history}
                                        setHistory={setHistory}
                                        chipCount={chipCount}
                                        setChipCount={setChipCount}
                                    />
                                    <EffectButton
                                        options={options}
                                        ballScreen={ballScreen}
                                        setBallScreen={setBallScreen}
                                        chipValue={chipValue}
                                        IndexNumber={38}
                                        label={'25 to 36'}
                                        minValue={8}
                                        maxValue={12}
                                        color_list={color_list}
                                        history={history}
                                        setHistory={setHistory}
                                        chipCount={chipCount}
                                        setChipCount={setChipCount}
                                    />
                                </div>
                                <div>
                                    {
                                        button_list.map((ele, id) =>
                                            <EffectButton
                                                key={id}
                                                options={number_order()}
                                                ballScreen={ballScreen}
                                                setBallScreen={setBallScreen}
                                                chipValue={chipValue}
                                                IndexNumber={id + 39}
                                                label={ele}
                                                minValue={8}
                                                maxValue={12}
                                                color_list={color_list}
                                                history={history}
                                                setHistory={setHistory}
                                                chipCount={chipCount}
                                                setChipCount={setChipCount}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='space'>
                        <div
                            onMouseOver={(event: any) => {
                                number_order().map((ele, id) => {
                                    if (id < 12) {
                                        document.getElementById(id.toString())!.style.filter = "brightness(1.3)";
                                        event.target.style.filter = "brightness(1.3)";
                                    }
                                })
                            }}
                            onMouseLeave={(event: any) => {
                                number_order().map((ele, id) => {
                                    if (id < 12) {
                                        document.getElementById(id.toString())!.style.filter = "brightness(1)";
                                        event.target.style.filter = "brightness(1)";
                                    }
                                })
                            }}
                            onClick={(event: any) => {
                                event.target.style.filter = "brightness(1)"; setBallScreen(ballScreen.map((el, i) => {
                                    if (i === 45) {
                                        chipValue !== "0" && setHistory([...history, { index: 45, currentValue: el }]);
                                        return (el ? calculatorChip(chipValue, el) : chipValue)
                                    } else {
                                        return el
                                    }
                                }))
                                history.map((ele) => {
                                    ele.index === 45 && chipValue !== "0" && setChipCount(chipCount.map((e, i) => i === 45 ? e + 1 : e));
                                })
                            }}>{'2:1'}
                            {
                                (ballScreen[45] && Number(ballScreen[45]) !== 0) && [...new Array(chipCount[45] > 4 ? 4 : chipCount[45])].map((ele, i) => <div style={{ top: - (i + 1) * 5 + "px" }} className={(Number(ballScreen[45].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 10 && (ballScreen[45][ballScreen[45].length - 1] === "M" || ballScreen[45][ballScreen[45].length - 1] === "B")) ? 'ball chip-green text-green' : ((Number(ballScreen[45].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 1 && (ballScreen[45][ballScreen[45].length - 1] === "M" || ballScreen[45][ballScreen[45].length - 1] === "B")) ? 'ball chip-green' : 'ball')}>{i === (chipCount[45] - 1 > 3 ? 3 : chipCount[45] - 1) && ballScreen[45]}</div>)
                            }
                        </div>
                        <div
                            onMouseOver={(event: any) => {
                                number_order().map((ele, id) => {
                                    if (id >= 12 && id < 24) {
                                        document.getElementById(id.toString())!.style.filter = "brightness(1.3)";
                                        event.target.style.filter = "brightness(1.3)";

                                    }
                                })
                            }}
                            onMouseLeave={(event: any) => {
                                number_order().map((ele, id) => {
                                    if (id >= 12 && id < 24) {
                                        document.getElementById(id.toString())!.style.filter = "brightness(1)";
                                        event.target.style.filter = "brightness(1)";
                                    }
                                })
                            }}
                            onClick={(event: any) => {
                                event.target.style.filter = "brightness(1)"; setBallScreen(ballScreen.map((el, i) => {
                                    if (i === 46) {
                                        chipValue !== "0" && setHistory([...history, { index: 46, currentValue: el }]);
                                        return (el ? calculatorChip(chipValue, el) : chipValue)
                                    } else {
                                        return el
                                    }
                                }))
                                history.map((ele) => {
                                    ele.index === 46 && chipValue !== "0" && setChipCount(chipCount.map((e, i) => i === 46 ? e + 1 : e));
                                })
                            }}>{'2:1'}
                            {
                                (ballScreen[46] && Number(ballScreen[46]) !== 0) && [...new Array(chipCount[46] > 4 ? 4 : chipCount[46])].map((ele, i) => <div style={{ top: - (i + 1) * 5 + "px" }} className={(Number(ballScreen[46].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 10 && (ballScreen[46][ballScreen[46].length - 1] === "M" || ballScreen[46][ballScreen[46].length - 1] === "B")) ? 'ball chip-green text-green' : ((Number(ballScreen[46].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 1 && (ballScreen[46][ballScreen[46].length - 1] === "M" || ballScreen[46][ballScreen[46].length - 1] === "B")) ? 'ball chip-green' : 'ball')}>{i === (chipCount[46] - 1 > 3 ? 3 : chipCount[46] - 1) && ballScreen[46]}</div>)
                            }
                        </div>
                        <div
                            onMouseOver={(event: any) => {
                                number_order().map((ele, id) => {
                                    if (id >= 24 && id < 36) {
                                        document.getElementById(id.toString())!.style.filter = "brightness(1.3)";
                                        event.target.style.filter = "brightness(1.3)";

                                    }
                                })
                            }}
                            onMouseLeave={(event: any) => {
                                number_order().map((ele, id) => {
                                    if (id >= 24 && id < 36) {
                                        document.getElementById(id.toString())!.style.filter = "brightness(1)";
                                        event.target.style.filter = "brightness(1)";
                                    }
                                })
                            }}
                            onClick={(event: any) => {
                                event.target.style.filter = "brightness(1)"; setBallScreen(ballScreen.map((el, i) => {
                                    if (i === 47) {
                                        chipValue !== "0" && setHistory([...history, { index: 47, currentValue: el }]);
                                        return (el ? calculatorChip(chipValue, el) : chipValue)
                                    } else {
                                        return el
                                    }
                                }))
                                history.map((ele) => {
                                    ele.index === 47 && chipValue !== "0" && setChipCount(chipCount.map((e, i) => i === 47 ? e + 1 : e));
                                })
                            }}>{'2:1'}
                            {
                                (ballScreen[47] && Number(ballScreen[47]) !== 0) && [...new Array(chipCount[47] > 4 ? 4 : chipCount[47])].map((ele, i) => <div style={{ top: - (i + 1) * 5 + "px" }} className={(Number(ballScreen[47].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 10 && (ballScreen[47][ballScreen[47].length - 1] === "M" || ballScreen[47][ballScreen[47].length - 1] === "B")) ? 'ball chip-green text-green' : ((Number(ballScreen[47].match(/[\d|,|.|E|\+]+/g)?.join("")) >= 1 && (ballScreen[47][ballScreen[47].length - 1] === "M" || ballScreen[47][ballScreen[47].length - 1] === "B")) ? 'ball chip-green' : 'ball')}>{i === (chipCount[47] - 1 > 3 ? 3 : chipCount[47] - 1) && ballScreen[47]}</div>)
                            }
                        </div>
                    </div>

                </div>
            </div>
            <div className='controls'>
                <div
                    onClick={() => {
                        setBallScreen(ballScreen.map((ele, id) => id === history[history.length - 1].index ? history[history.length - 1].currentValue : ele));
                        setHistory(history.filter((ele, id) => id !== history.length - 1));
                        setChipCount(
                            chipCount.map((ele, id) => id === history[history.length - 1].index ? ele - 1 : ele)
                        )
                    }}>
                    <i></i>
                    <p>Undo</p>
                </div>
                <div
                    onClick={() => {
                        setBallScreen(
                            [...new Array(50)].map(ele => '')
                        )
                        setHistory(
                            []
                        )
                        setChipCount(
                            [...new Array(50)].map(ele => 1)
                        )

                    }}>
                    <p>Clear</p>
                    <i></i>
                </div>
            </div>
        </div>
    )
}

export default Roulette;
