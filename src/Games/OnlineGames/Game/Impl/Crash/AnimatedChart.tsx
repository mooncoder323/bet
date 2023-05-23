import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { currencies } from "../../../../../Utilities/Currencies";

import "chart.js/auto";
import "chartjs-adapter-moment";

let count: number = 0;
let data_x_y: Array<number> = [0, 0];
let degree: number = 0;
let multiOrder: boolean = false;
let defaultAngle: number = 50;
let Interval: number = 0;
let SetInterval: any;

export type CanvasChartProps = {
  chartData: any;
  chartOptions: any;
  bBettingPhase: number;
  multiplierValue: Array<any>
  liveMultiplier: String
};

export type LinChartContextProps = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  unitsPerTickX: number;
  unitsPerTickY: number;
}

export const AnimatedChart: React.FC<CanvasChartProps> = ({
  chartData,
  chartOptions,
  bBettingPhase,
  multiplierValue,
  liveMultiplier
}) => {

  const canvass = useRef<HTMLCanvasElement>(null);
  const canvass_rain = useRef<HTMLCanvasElement>(null);
  const rocket = useRef<HTMLImageElement>(null);
  const explosion = useRef<HTMLImageElement>(null);
  let canvasRef: any = canvass.current;
  let canvass_rainRef: any = canvass_rain.current;
  const canvas_div = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Array<number>>([400, 200]);

  useEffect(() => {
    canvasRef = canvass.current;
    canvass_rainRef = canvass_rain.current;
    drawChart();
  }, [chartData, chartOptions]);

  useEffect(() => {
    if (liveMultiplier !== "Waiting for next round to start..." && Interval === 0) {
      Interval++;
      drawRainSteaks(0);
    } else if (liveMultiplier === "Waiting for next round to start...") {
      drawRainSteaks(0);
    }
  }, [liveMultiplier])

  useLayoutEffect(() => {

    function updateSize() {
      canvasRef = canvass.current;
      canvass_rainRef = canvass_rain.current;
      setSize([
        canvas_div.current!.clientWidth,
        canvas_div.current!.clientHeight,
      ]);
      drawChart();
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  function LineChart(this: any, con: LinChartContextProps) {

    this.minX = con.minX;
    this.minY = con.minY;
    this.maxX = con.maxX;
    this.maxY = con.maxY;
    this.unitsPerTickX = con.unitsPerTickX;
    this.unitsPerTickY = con.unitsPerTickY;

    this.padding = 10;
    this.tickSize = 8;
    this.axisColor = "grey";
    this.pointRadius = 5;
    this.font = "12pt onyxfont";
    this.fillStyle = "#746b6b";
    this.fontHeight = 12;

    this.context = canvasRef.getContext("2d");
    this.context.clearRect(0, 0, canvasRef.width, canvasRef.height);
    this.rangeX = this.maxX - this.minX;
    this.rangeY = this.maxY - this.minY;
    this.numXTicks = Math.floor(this.rangeX / this.unitsPerTickX);
    this.numYTicks = Math.round(this.rangeY / this.unitsPerTickY);
    this.x = this.padding * 2;
    this.y = this.padding * 2;
    this.rocket_width = canvasRef.width - this.x - this.padding * 2 - rocket.current!.width * 0.75;
    this.rocket_height = canvasRef.height - this.y - this.padding - this.fontHeight - rocket.current!.height / 7;
    this.width = canvasRef.width - this.x - this.padding * 2;
    this.height = canvasRef.height - this.y - this.padding - this.fontHeight;
    this.scaleX = this.width / this.rangeX;
    this.scaleY = this.height / this.rangeY;
    this.rocket_scaleX = this.rocket_width / this.rangeX;
    this.rocket_scaleY = this.rocket_height / this.rangeY;

    this.drawXAxis();
    this.drawYAxis();
  }

  LineChart.prototype.getLongestValueWidth = function () {

    this.context.font = this.font;
    var longestValueWidth = 0;
    for (let n = 0; n <= this.numYTicks; n++) {
      var value = this.maxY - n * this.unitsPerTickY;
      longestValueWidth = Math.max(
        longestValueWidth,
        this.context.measureText(value).width
      );
    }
    return longestValueWidth;
  };

  LineChart.prototype.drawXAxis = function () {

    const context = this.context;
    context.save();
    context.beginPath();
    context.moveTo(this.x, this.y + this.height);
    context.lineTo(
      this.x - this.padding * 8 + this.width,
      this.y + this.height
    );

    for (let n = 0; n < this.numXTicks; n++) {

      context.beginPath();
      context.strokeStyle = "#746b6b";
      context.moveTo(
        ((n + 1) * (this.width - (this.width / this.maxX) * (this.maxX -
          (parseInt(this.maxX) > 9
            ? Math.floor(this.maxX / 10) * 10
            : parseInt(this.maxX))))) / this.numXTicks + this.x - 100,
        this.y + this.height + this.padding - 15
      );
      context.lineTo(
        ((n + 1) * (this.width - (this.width / this.maxX) * (this.maxX -
          (parseInt(this.maxX) > 9
            ? Math.floor(this.maxX / 10) * 10
            : parseInt(this.maxX))))) / this.numXTicks + this.x - 100,
        this.y + this.height + this.padding - 20
      );

      context.stroke();
    }

    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();

    context.font = this.font;
    context.fillStyle = "#746b6b";
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let n = 0; n < this.numXTicks; n++) {

      let label = (n + 1) *
        (parseInt(this.maxX) > 9
          ? Math.floor(this.maxX / this.numXTicks / 10) * 10
          : Math.floor(this.maxX / this.numXTicks));

      context.save();

      context.translate(
        ((n + 1) * (this.width - (this.width / this.maxX) * (this.maxX -
          (parseInt(this.maxX) > 9
            ? Math.floor(this.maxX / 10) * 10
            : parseInt(this.maxX))))) / this.numXTicks + this.x - 100,
        this.y + this.height + this.padding
      );

      context.fillText(label + "s", 0, 0);
      context.restore();
    }
    context.restore();
  };

  LineChart.prototype.drawYAxis = function () {

    const context = this.context;
    context.save();
    context.save();
    context.beginPath();
    context.restore();

    for (let n = 0; n < this.numYTicks; n++) {

      context.beginPath();
      context.strokeStyle = "#b9a9b9";
      context.moveTo(
        this.x + canvasRef.width - rocket.current!.width / 2 + 25,
        (n * (this.height - (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)))) /
        this.numYTicks + this.y + (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1))
      );
      context.lineTo(
        this.x + canvasRef.width - rocket.current!.width / 2 + this.tickSize + 25,
        (n * (this.height - (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)))) /
        this.numYTicks + this.y + (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1))
      );

      context.stroke();

      for (let i = 1; i < 4; i++) {

        context.strokeStyle = "grey";
        context.moveTo(
          this.x + canvasRef.width - rocket.current!.width / 2 + 25,
          (n * (this.height - (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)))) / this.numYTicks + this.y + (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)) + (i * this.height) / (this.numYTicks * 4)
        );
        context.lineTo(
          this.x + canvasRef.width - rocket.current!.width / 2 + this.tickSize - 5 + 25,
          (n * (this.height - (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)))) / this.numYTicks + this.y + (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)) + (i * this.height) / (this.numYTicks * 4)
        );
        context.stroke();
      }
    }

    context.font = this.font;
    context.textAlign = "right";
    context.textBaseline = "middle";

    for (let n = 0; n <= this.numYTicks; n++) {

      this.numYTicks % 2 ? context.fillStyle = n % 2 ? "#b9a9b9" : "#747171" : context.fillStyle = !(n % 2) ? "#b9abb8" : "#747171";

      var value = Number((this.numYTicks - n) * this.unitsPerTickY + 1).toFixed(2);
      context.save();
      context.translate(
        this.x + canvasRef.width - rocket.current!.width / 4 - this.padding + 35,
        (n *
          (this.height -
            (this.height / this.rangeY) *
            (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)))) /
        this.numYTicks +
        this.y +
        (this.height / this.rangeY) *
        (this.maxY - (this.numYTicks * this.unitsPerTickY + 1))
      );
      context.fillText(value + "x", 0, 0);
      context.restore();
    }
    context.restore();
  };

  LineChart.prototype.drawLine = function (data: any, color: any, width: any) {

    let cnt: Array<number> = [];
    let cnt_text: Array<number> = [];
    const context = this.context;
    context.save();
    this.transformContext();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(
      data[0].x * this.rocket_scaleX,
      data[0].y * this.rocket_scaleY
    );

    if (bBettingPhase !== 1 && count !== 1) {
      for (let n = 1; n < data.length; n++) {
        let point = data[n];

        context.quadraticCurveTo(
          point.x * this.rocket_scaleX,
          point.y * this.rocket_scaleY,
          point.x * this.rocket_scaleX,
          point.y * this.rocket_scaleY
        );
        context.stroke();
        context.closePath();
        context.beginPath();

        context.beginPath();
        context.moveTo(
          point.x * this.rocket_scaleX,
          point.y * this.rocket_scaleY
        );
      }

    }

    let img = new Image();

    multiplierValue.map((ele, index) => {
      data.map((point: any) => {
        context.font = this.font;
        context.fillStyle = "white";
        context.textBaseline = "middle";
        context.textAlign = "right";
        if (Number(Number(ele?.multiplier).toFixed(1)) == Number(1 + Number(point.y.toFixed(1))) && cnt[index] === undefined) {
          img.src = `/assets/currencies/${currencies.get(ele?.currency)!!.img}`;
          context.save();
          context.translate(point.x * this.rocket_scaleX, Number(point.y * this.rocket_scaleY) - 15); // translate to the position of the transformation
          context.scale(1, -1); // apply the vertical scale transformation
          context.translate(- point.x * this.rocket_scaleX, - Number(point.y * this.rocket_scaleY) - 15);
          cnt[index] = 0;
          context.drawImage(img, point.x * this.rocket_scaleX, Number(point.y * this.rocket_scaleY) - 15, 30, 30);
          context.restore();
        }
      })
    })

    multiplierValue.map((ele, index) => {
      multiOrder = !multiOrder;
      data.map((point: any) => {
        context.font = "800 " + this.font;
        context.fillStyle = "white";
        context.textBaseline = "middle";
        context.textAlign = "right";
        if (Number(Number(ele?.multiplier).toFixed(1)) == Number(1 + Number(point.y.toFixed(1))) && cnt_text[index] === undefined) {
          context.restore();

          cnt_text[index] = 0;

          context.fillText(Number(ele?.multiplier).toFixed(2) + "x", point.x * this.rocket_scaleX + 45,
            canvasRef.height - Number(point.y * this.rocket_scaleY) - (multiOrder ? 50 : -10));
          context.fillStyle = "#60af5a";
          context.fillText(currencies.get(ele?.currency)!!.symbol + (Number(ele?.multiplier) * Number(ele?.amount)).toFixed(2), point.x * this.rocket_scaleX + 45,
            canvasRef.height - Number(point.y * this.rocket_scaleY) - (multiOrder ? 70 : -35));
          context.save();
          context.restore();

        }
      })
    })

    if (bBettingPhase === 1 && count === 0) {

      count++;
      degree = 0;
      data_x_y[0] = 0;
      data_x_y[1] = 0;
      let width = rocket.current!.width;
      rocket.current!.style.display = "none";
      rocket.current!.width = width;
      explosion.current!.style.display = "block";
      explosion.current!.style.left = Number(data[data.length - 1].x * this.rocket_scaleX - 75) + "px";
      explosion.current!.style.bottom = Number(data[data.length - 1].y * this.rocket_scaleY - 85) + "px";

    } else if (bBettingPhase === 1 && count === 1) {

      rocket.current!.style.display = "none";
      this.context.clearRect(0, 0, canvasRef.width, canvasRef.height);

      drawRainSteaks(1);
      setTimeout(() => {
        explosion.current!.style.display = "none";
      }, 1000);
      setTimeout(() => {
        rocket.current!.style.transform =
          "rotate(-44deg)";
        rocket.current!.style.left = "15px";
        rocket.current!.style.bottom =
          Number(0 -
            Number(rocket.current!.height / 3) + (canvas_div.current!.clientHeight / 2.1)
          ) + "px";

        rocket.current!.style.display = "block";
        drawRainSteaks(0);
      }, 3000);

      let interval: any;
      let interval1: any;

      setTimeout(() => {
        let co = 0;
        interval = setInterval(() => {
          co++;
          rocket.current!.style.bottom =
            Number(0 -
              Number(rocket.current!.height / 3) + (canvas_div.current!.clientHeight / 2.1) - co * (canvas_div.current!.clientHeight - Number(0 -
                Number(rocket.current!.height / 3) + (canvas_div.current!.clientHeight / 2.1))) / 40
            ) + "px";
        }, 10)
      }, 7000)

      setTimeout(() => {
        clearInterval(interval);
        let co = 0;
        interval1 = setInterval(() => {
          co++;
          rocket.current!.style.bottom =
            Number(0 -
              Number(rocket.current!.height / 3) + (canvas_div.current!.clientHeight / 2.1) + co * ((canvas_div.current!.clientHeight / 2.1)) / 12
            ) + "px";
          rocket.current!.style.opacity = (1 / co).toFixed(1);
        }, 100)
      }, 7100)

      setTimeout(() => {
        clearInterval(interval1);
        rocket.current!.style.display = "none";
      }, 7900);
      count++;

    } else if (bBettingPhase !== 1) {

      rocket.current!.style.opacity = "1";

      rocket.current!.style.left =
        Number(
          data[data.length - 1].x * this.rocket_scaleX -
          rocket.current!.width / 2.1
        ) + "px";

      rocket.current!.style.bottom =
        Number(
          data[data.length - 1].y * this.rocket_scaleY -
          rocket.current!.height / 2.19
        ) + "px";

      rocket.current!.style.display = "block";

      if (data_x_y[0] != data[data.length - 1].x && data_x_y[1] != data[data.length - 1].y) {

        let meet_side = Number(
          Math.sqrt(
            (data[data.length - 1].x - data_x_y[0]) * this.rocket_scaleX *
            (data[data.length - 1].x - data_x_y[0]) * this.rocket_scaleX +
            (data[data.length - 1].y - data_x_y[1]) * this.rocket_scaleY *
            (data[data.length - 1].y - data_x_y[1]) * this.rocket_scaleY
          )
        );

        let radian = Math.acos(
          (data[data.length - 1].x - data_x_y[0]) * this.rocket_scaleX / meet_side
        );

        if ((radian * 180) / 3.14 > degree || degree === 0) {
          degree = (radian * 180) / 3.14;
        }

        if (degree > 92) degree = 5;

        rocket.current!.style.transform =
          "rotate(" + (defaultAngle - degree) + "deg)";

        data_x_y[0] = data[data.length - 1].x;
        data_x_y[1] = data[data.length - 1].y;

      } else {

        rocket.current!.style.transform =
          "rotate(" + (defaultAngle - degree) + "deg)";
      }
      count = 0;
      multiOrder = false;
    }
    context.restore();

  };

  LineChart.prototype.transformContext = function () {

    this.context.translate(this.x, this.y + this.height);
    this.context.scale(1, -1);

  };

  const drawChart = () => {

    if (chartData?.datasets[0]?.data.length) {
      var myLineChart = new (LineChart as any)({
        minX: 0,
        minY: chartOptions?.scales?.yAxes?.min,
        maxX: chartOptions?.scales?.xAxes?.max,
        maxY: chartOptions?.scales?.yAxes?.max,
        unitsPerTickX:
          Math.pow(
            10,
            parseInt(chartOptions?.scales?.xAxes?.max).toString().length
          ) / 10,
        unitsPerTickY:
          Math.pow(
            10,
            Number(chartOptions?.scales?.yAxes?.max / 0.25).toFixed(0).toString().length
          ) / 100,
      });
      var data = [
        ...chartData.labels.map((i: any, index: number) => ({
          x: i,
          y: chartData.datasets[0].data[index] < 1 ? 0 : chartData.datasets[0].data[index] - 1,
        })),
      ];
      
      myLineChart.drawLine(data, "#d99de6", 3);
    }
  };

  const drawRainSteaks = function (state: number) {

    const ctx = canvass_rainRef.getContext("2d");
    const raindropImg = new Image();
    raindropImg.src = "/assets/games/online/crash/rain.png"; // Replace with your own raindrop image URL

    let streaks: Array<any> = [];

    if (state === 1) {
      clearInterval(SetInterval);
      ctx.clearRect(0, 0, canvass_rainRef.width, canvass_rainRef.height);
    }

    else {
      SetInterval = setInterval(() => {
        let opacity = 0.05;
        ctx.clearRect(0, 0, canvass_rainRef.width, canvass_rainRef.height);

        if (liveMultiplier === "Waiting for next round to start...") {
          return;
        }

        if (Math.random() < 0.3) {
          streaks.push({
            x: Math.random() * canvass_rainRef.width,
            y: -50,
            speed: 5 + Math.random() * 5,
          });
        }

        for (let i = 0; i < streaks.length; i++) {

          const streak = streaks[i];
          streak.y += streak.speed;
          if (count !== 2) streak.x -= 5;
          if (streak.y > canvass_rainRef.height) {
            streaks.splice(i, 1);
            i--;
          } else {
            ctx.save();
            if (opacity <= 0.1 && (streaks.length / 2) >= i) {
              ctx.globalAlpha = opacity;
              opacity += (0.05 / (streaks.length / 2));

            } else {
              ctx.globalAlpha = opacity;
              opacity -= (0.1 / (streaks.length / 2))
            }
            if (streak.y > canvass_rainRef.height - 60) ctx.globalAlpha = 0;
            ctx.translate(streak.x, streak.y);
            count === 2 ? ctx.rotate(Math.PI / 4 * 2) : ctx.rotate(Math.PI / 4 * 3); // Rotate by 45 degrees
            ctx.drawImage(raindropImg, -raindropImg.width / 2, -raindropImg.height / 2, raindropImg.width / 1.5, raindropImg.height);
            ctx.restore();
          }
        }
      }, 1);
    }

  }

  return (
    <>
      <div className="canvas" ref={canvas_div}>
        <canvas ref={canvass} width={size[0]} height={size[1]}></canvas>
        <canvas ref={canvass_rain} width={size[0]} height={size[1]} className="rain_area"></canvas>
        <img
          src="/assets/games/online/crash/crash_rocket.gif"
          className="rocket"
          ref={rocket}
          alt="rocket"
          style={{ transform: "rotate(40deg)" }}
        />
        <img
          src="/assets/games/online/crash/explosion.gif"
          className="explosion"
          ref={explosion}
          alt="explosion"
        />
      </div>
    </>
  );
};
