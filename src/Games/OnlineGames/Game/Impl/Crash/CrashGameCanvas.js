
import React, { useEffect, useRef, useState } from "react";

import 'chart.js/auto';
import 'chartjs-adapter-moment'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosGet } from "../../../../../Utilities/HTTPClient";
import { AnimatedChart } from "./AnimatedChart";

function CrashGameCanvas({ setParentGameId, setParticipants, setWagerId, getParticipants, setParentCrashed, addRoundToHistory }) {

    const [betAmount, setBetAmount] = useState(localStorage.getItem("local_storage_wager") || 100)
    const [autoPayoutMultiplier, setAutoPayoutMultiplier] = useState(localStorage.getItem("local_storage_multiplier") || 2)
    const [liveMultiplier, setLiveMultiplier] = useState('Waiting for next round to start...')
    const [liveMultiplierSwitch, setLiveMultiplierSwitch] = useState(false)
    const [bBettingPhase, setbBettingPhase] = useState(false)
    const [bettingPhaseTime, setBettingPhaseTime] = useState(-1)
    const [bBetForNextRound, setbBetForNextRound] = useState(false)
    const [liveBettingTable, setLiveBettingTable] = useState()
    const [globalTimeNow, setGlobalTimeNow] = useState(0)
    const [chartData, setChartData] = useState({ datasets: [] });
    const [chartOptions, setChartOptions] = useState({});
    const [chartSwitch, setChartSwitch] = useState(false)
    const [gamePhaseTimeElapsed, setGamePhaseTimeElapsed] = useState()
    const [gameId, setGameId] = useState(-1)
    const [startTime, setStartTime] = useState()
    const [myAmount, setMyAmount] = useState({});
    const [crashed, setCrashed] = useState(-1);
    const [crashedTime, setCrashedTime] = useState(0)
    const crash_area = useRef(null);
    const [crash_width, setCrash_width] = useState(0);

    const multiplierCount = useRef([])
    const timeCount_xaxis = useRef([])
    const realCounter_yaxis = useRef(5)

    useEffect(() => {
        const client = new EventSource("https://betsse.onyxtechnology.co.uk/api/crash/feed");
        client.addEventListener("crash", jmsevent => {
            if (jmsevent.data == 'keep-alive') return;
            let args = jmsevent.data.split(' ')
            switch (args[0]) {
                case "start_multiplier_count": {
                    multiplierCount.current = []
                    timeCount_xaxis.current = []
                    setGameId(args[1])
                    setParentGameId(args[1])
                    setGlobalTimeNow(Date.now())
                    setLiveMultiplierSwitch(true)
                    setParentCrashed(-1)
                    setCrashed(-1)
                    let audio = new Audio("/assets/games/online/crash/launch.wav")
                    if (localStorage.getItem("mute-sounds") != "true")
                        audio.play()
                    break;
                }
                case "stop_multiplier_count": {
                    setParentGameId(-1)
                    setLiveMultiplier(Number(args[1]).toFixed(2))
                    addRoundToHistory(Number(args[1]).toFixed(2))
                    setLiveMultiplierSwitch(false)
                    setParticipants([])
                    setWagerId(-1)
                    setParentCrashed(1)
                    setCrashed(Number(args[1]).toFixed(2))
                    setCrashedTime(Date.now())
                    let audio = new Audio("/assets/games/online/crash/explosion.mp3")
                    setMyAmount({})
                    if (localStorage.getItem("mute-sounds") != "true")
                        audio.play()
                    break;
                }
                case "wager_placed": {
                    if (args[4] && Number(args[4]) > 0.0) {
                        getParticipants().filter(p => p.name == args[1]).map(p => p.multiplier = args[4]);
                    } else {
                        if (getParticipants().length > 0)
                            getParticipants()[getParticipants().length - 1].name !== args[1] && getParticipants().push({ name: args[1], currency: args[3], amount: args[2], time: Date.now() })
                        else
                            getParticipants().push({ name: args[1], currency: args[3], amount: args[2], time: Date.now() })
                    }
                    setParticipants(getParticipants())
                    setMyAmount(getParticipants())
                    break;
                }
            }
        })
        setCrash_width(crash_area.current.clientWidth);
    }, []);

    window.onresize = () => {
        setCrash_width(crash_area.current.clientWidth);
    };

    useEffect(() => {
        axiosGet(`/game/crash-state`).then(r => {
            let time = Number(r.state)
            if (time > -1) {
                let time_elapsed = (Date.now() - time) / 1000.0
                let current = 1.0024 * Math.pow(1.0718, time_elapsed)
                multiplierCount.current = [0.07, 1.001]
                timeCount_xaxis.current = [0, 0.07]
                setGameId(r.gameId)
                setParentGameId(r.gameId)
                setGlobalTimeNow(time)
                setLiveMultiplier(current)
                setLiveMultiplierSwitch(true)
                setParentCrashed(-1)
                setCrashed(-1)
                setParticipants(r.currentBets)
            }
        })
    }, []);
    useEffect(() => {
        let gameCounter = null
        if (liveMultiplierSwitch) {
            setLiveMultiplier('1.00')

            gameCounter = setInterval(() => {
                let time_elapsed = (Date.now() - globalTimeNow) / 1000.0
                setGamePhaseTimeElapsed(time_elapsed)
                setLiveMultiplier((1.0024 * Math.pow(1.0718, time_elapsed)).toFixed(2))

                if (multiplierCount.current.length < 1) {
                    multiplierCount.current = multiplierCount.current.concat([1])
                    timeCount_xaxis.current = timeCount_xaxis.current.concat([0])
                }
                if (realCounter_yaxis.current % 5 == 0) {
                    if (time_elapsed > 1.3 && multiplierCount.current.length === 2) {
                        for (let i = 1.001; i < time_elapsed; i++) {
                            multiplierCount.current = multiplierCount.current.concat([(1.0024 * Math.pow(1.0718, i)).toFixed(2)])
                            timeCount_xaxis.current = timeCount_xaxis.current.concat([i])
                        }
                    }
                    multiplierCount.current = multiplierCount.current.concat([(1.0024 * Math.pow(1.0718, time_elapsed)).toFixed(2)])
                    timeCount_xaxis.current = timeCount_xaxis.current.concat([time_elapsed])
                }
                realCounter_yaxis.current += 1
            }, 1)
        }
        return () => {

            clearInterval(gameCounter)

        }
    }, [liveMultiplierSwitch]);

    useEffect(() => {
        let bettingInterval = null
        if (bBettingPhase) {
            bettingInterval = setInterval(() => {
                let time_elapsed = ((Date.now() - globalTimeNow) / 1000.0)
                let time_remaining = (5 - time_elapsed).toFixed(2)
                setBettingPhaseTime(time_remaining)
                if (time_remaining < 0) {
                    setbBettingPhase(false)
                }
            }, 10)
        }
        return () => {
            clearInterval(bettingInterval)
            setBettingPhaseTime("Starting...")

        }
    }, [bBettingPhase]);

    useEffect(() => {
        if (bBetForNextRound) {

        } else {

        }
    }, [bBetForNextRound])

    useEffect(() => {
        localStorage.setItem("local_storage_wager", betAmount);
        localStorage.setItem("local_storage_multiplier", autoPayoutMultiplier);
    }, [betAmount, autoPayoutMultiplier])

    useEffect(() => {
        setChartSwitch(true)
        setStartTime(Date.now())
    }, [])

    useEffect(() => {

    }, [liveBettingTable])

    useEffect(() => {
        const temp_interval = setInterval(() => {
            setChartSwitch(false)
            sendToChart()
        }, 1)

        return () => {
            clearInterval(temp_interval)
            setChartSwitch(true)
        }
    }, [chartSwitch])

    // Chart Data
    const sendToChart = () => {
        setChartData({
            labels: timeCount_xaxis.current,
            datasets: [
                {
                    data: multiplierCount.current,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgb(255,0,0)",
                    color: "rgba(255, 255, 255,1)",
                    pointRadius: 0,
                    borderDash: [0, 0],
                    lineTension: 0,
                }
            ],
        });
        setChartOptions({
            events: [],
            maintainAspectRatio: false,
            elements: {
                line: {
                    tension: 0.1
                }
            },
            scales: {
                yAxes: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: false,
                        text: 'value'
                    },
                    min: 1,
                    max: (liveMultiplier > 2 ? (liveMultiplier) : (2)),
                    ticks: {
                        color: "rgba(255, 255, 255,1)",
                        maxTicksLimit: 5,
                        callback: function (value, index, values) {
                            if (value % 0.5 == 0) return (parseFloat(value)).toFixed(2)
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(255, 255, 255,0.2)'
                    },
                },
                xAxes: {
                    type: 'linear',
                    title: {
                        display: false,
                        text: 'value'
                    },
                    max: (gamePhaseTimeElapsed > 2 ? (gamePhaseTimeElapsed) : (2)),
                    ticks: {
                        color: "rgba(255, 255, 255,1)",

                        maxTicksLimit: 5,
                        callback: function (value, index, values) {
                            if (gamePhaseTimeElapsed < 10) {
                                if (value % 1 == 0) return value
                            } else {
                                if (value % 10 == 0) return value
                            }
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(255, 255, 255,0.2)'
                    },
                },
            },
            plugins: {
                legend: { display: false },
            },
            animation: {
                x: {
                    type: 'number',
                    easing: 'linear',
                    duration: 0,
                    from: 5,
                    delay: 0
                },
                y: {
                    type: 'number',
                    easing: 'linear',
                    duration: 0,
                    from: 5,
                    delay: 0
                },
            },
        }
        );
    }

    //JSX
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <div>
                <ToastContainer />
            </div>

            <div className="grid-container-main" style={{ height: '100%', width: '100%' }}>

                {<div className="effects-box" style={{ height: '100%', width: '100%' }}>
                    <div className="basically-the-graph" ref={crash_area} style={{ height: '100%', width: '100%', position: 'relative' }}>
                        {chartData ? (<AnimatedChart chartData={chartData} chartOptions={chartOptions} bBettingPhase={crashed != -1 ? 1 : -1} multiplierValue={getParticipants()} liveMultiplier={liveMultiplier} />) : ('')}
                        <div className="crash_area" style={{ position: "absolute", zIndex: 12, top: '30%', left: crash_width / 3.5, }}>
                            {(() => {
                                if (crashed != -1) {
                                    if ((((crashedTime + 8000) - Date.now()) / 1000).toFixed(2) > 5) {
                                        return <div>
                                            <h1 className="CrashValue Error">{crashed}x</h1>
                                            <h2 className="Error round">Round Over</h2>
                                        </div>
                                    }
                                    return (<div>
                                        <h2 className="preparing">Preparing Round</h2>
                                        <span className="starting">Starting in {Number((((crashedTime + 8000) - Date.now()) / 1000).toFixed(2)) < 0 ? '0.00' : (((crashedTime + 8000) - Date.now()) / 1000).toFixed(2)}s</span>
                                    </div>)
                                }
                                if (myAmount[0]?.multiplier) {
                                    return (
                                        <>
                                            {liveMultiplier !== 'Waiting for next round to start...' ? <h1>{liveMultiplier}x</h1> : <h2>{liveMultiplier}</h2>}
                                            <p className="current">Current Payout</p>
                                        </>
                                    )
                                }
                                return (
                                    <>
                                        {liveMultiplier !== 'Waiting for next round to start...' ? <h1>{liveMultiplier}x</h1> : <h2>{liveMultiplier}</h2>}
                                        <p className="current">Current Payout</p>
                                    </>
                                )
                            })()}
                        </div>
                    </div>

                </div>}
            </div>
        </div >
    );
}

export default CrashGameCanvas;

