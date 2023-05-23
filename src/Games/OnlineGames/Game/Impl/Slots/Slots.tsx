import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Position = {
    x: number
    y: number
}

class Sprite {

    protected renderingContext: CanvasRenderingContext2D
    protected position: Position

    constructor(context: CanvasRenderingContext2D, position: Position) {
        this.renderingContext = context
        this.position = position
    }

    draw() {
        this.renderingContext.fillStyle = 'red'
        this.renderingContext.fillRect(this.position.x, this.position.y, 50, 150)
    }
}
class ImageSprite extends Sprite {

    protected width: number
    protected height: number
    protected image: HTMLImageElement
    protected scale: number
    protected framesMax: number
    protected framesCurrent: number
    protected framesElapsed: number
    protected framesHold: number
    public offset: Position
    private animate: Boolean
    public forcedHeight?: number

    constructor(context: CanvasRenderingContext2D,
        position: Position,
        imageSrc: string,
        scale: number,
        framesMax: number,
        offset: Position,
        forcedHeight?: number) {
        super(context, position)
        this.animate = false
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
        this.forcedHeight = forcedHeight;
    }

    draw() {
        const height = this.forcedHeight ?? this.image.height
        if (this.renderingContext)
            this.renderingContext.drawImage(
                this.image,
                this.framesCurrent * (this.image.width / this.framesMax),
                0,
                this.image.width / this.framesMax,
                height,
                this.position.x - this.offset.x,
                this.position.y - this.offset.y,
                (this.image.width / this.framesMax) * this.scale,
                height * this.scale
            )
    }

    animateFrames() {
        if (!this.animate && this.framesCurrent === 0) {
            return
        }
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    animated(): ImageSprite {
        this.animate = true
        this.forcedHeight = 70
        return this
    }

    update(): ImageSprite {
        this.draw()
        this.animateFrames()
        return this
    }
}

class AnimatedSprite extends ImageSprite {

    private sprites: Array<any>

    constructor(context: CanvasRenderingContext2D,
        position: Position,
        imageSrc: string,
        scale: number,
        framesMax: number,
        offset: Position,
        sprites: Array<any>) {
        super(context, position, imageSrc, scale, framesMax, offset);
        this.width = 1
        this.height = 1
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5 // animation speed
        this.sprites = sprites
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update(): ImageSprite {
        super.update()
        return this
    }
}

const defaultX = 0;

const drawSlotMachine = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    const background = new ImageSprite(ctx,
        { x: 195, y: 100 },
        'http://localhost:3000/assets/games/online/slots/mask_slot.png',
        0.5,
        1,
        { x: 0, y: 0 });
    background.draw()
}

const drawSlotMachineShadow = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    const background = new ImageSprite(ctx,
        { x: defaultX, y: 0 },
        'http://localhost:3000/assets/games/online/slots/item_shadow.png',
        1.0,
        1,
        { x: 0, y: 0 });
    background.draw()
    // const Img = new Image();

    // Img.src = "http://localhost:3000/assets/games/online/slots/symbol_1_1.jpg";
    // ctx.drawImage(Img, 0, 0, Img.width , Img.height / 4 * 3, defaultX, 0, Img.width / 3, Img.height / 2);
}

const drawSlotMachineNumbers = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    const numbers: Array<any> = [
        getLine(1, ctx, defaultX + 220, 160, 1),
        getLine(2, ctx, defaultX + 220, 210, 1),
        getLine(3, ctx, defaultX + 220, 250, 1),
        getLine(4, ctx, defaultX + 220, 290, 1),
        getLine(5, ctx, defaultX + 220, 335, 1),
        getLine(6, ctx, defaultX + 220, 380, 1),
        getLine(7, ctx, defaultX + 220, 425, 1),
        getLine(8, ctx, defaultX + 220, 470, 1),
        getLine(9, ctx, defaultX + 220, 520, 1),

        getLine(1, ctx, defaultX + 993, 160, 2),
        getLine(2, ctx, defaultX + 993, 210, 2),
        getLine(3, ctx, defaultX + 993, 250, 2),
        getLine(4, ctx, defaultX + 993, 290, 2),
        getLine(5, ctx, defaultX + 993, 335, 2),
        getLine(6, ctx, defaultX + 993, 380, 2),
        getLine(7, ctx, defaultX + 993, 425, 2),
        getLine(8, ctx, defaultX + 993, 470, 2),
        getLine(9, ctx, defaultX + 993, 520, 2),
    ]
}

const drawSlotMachineHeader = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    const background = new ImageSprite(ctx,
        { x: defaultX + 460, y: 60 },
        'http://localhost:3000/assets/games/online/slots/logo_0.png',
        0.7,
        1,
        { x: 0, y: 0 });
    background.draw()
}

const drawSlotMachineWagerOptions = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.font = "30px Arial";
    ctx.textAlign = "center"
    ctx.fillStyle = "white";
    const linesButton = new ImageSprite(ctx,
        { x: defaultX + 560, y: 620 },
        'http://localhost:3000/assets/games/online/slots/amount_bonus_win.png',
        0.6,
        1,
        { x: 0, y: 0 });
    linesButton.draw()
    ctx.fillText("spin", defaultX + 560 + 85, 620 + 35)
}

function getLine(value: number, ctx: CanvasRenderingContext2D, x: number, y: number, range: number) {
    const Img = new Image();

    Img.src = "http://localhost:3000/assets/games/online/slots/bet_but.png";
    ctx.drawImage(Img, Img.width / 2 * (range - 1), Img.height / 20 * (value - 1 + 10 * (range - 1)), Img.width / 2, Img.height / 20, x, y, 60, 50);
    return Img;
}

function getSlot(slot: number, ctx: CanvasRenderingContext2D, position: Position): Slot {
    return new Slot(
        slot,
        position,
        ctx
    )
}

class Slot {

    public image: ImageSprite
    private timeRemaining: number
    private offsetY: number
    private start: number
    private multiplier: number
    private speed: number
    private timer: number

    constructor(slot: number, position: Position, ctx: CanvasRenderingContext2D) {
        let slotImage = slot < 10 ? '0' + slot : '' + slot;
        this.image = new ImageSprite(ctx,
            { x: defaultX + 330 + (136 * position.x), y: 180 + (80 * position.y) },
            `http://localhost:3000/assets/games/online/slots/slot/slot_${slotImage}.png`,
            1.0,
            1,
            { x: 0, y: 0 }).update() as ImageSprite
        this.timeRemaining = 10000;
        this.offsetY = 0;
        this.timer = 1000;
        this.start = this.setStartPosition()
        this.multiplier = Math.floor(Math.random() * (4 - 1) + 1);
        this.speed = iconHeight * this.multiplier;
        // this.image.forcedHeight = 50
    }

    setStartPosition() {
        return ((Math.floor((Math.random() * 9))) * iconHeight) * -1;
    }


    getSymbolFromPosition() {

        const totalSymbols = 9;
        const maxPosition = (iconHeight * (totalSymbols - 1) * -1);
        let moved = (this.timer / 100) * this.multiplier
        let startPosition = this.start;
        let currentPosition = startPosition;

        for (let i = 0; i < moved; i++) {
            currentPosition -= iconHeight;

            if (currentPosition < maxPosition) {
                currentPosition = 0;
            }
        }
        this.offsetY = currentPosition
        console.log('moved slot ' + currentPosition)
        // props.onFinish(currentPosition);
    }

    tick() {
        if (this.timeRemaining <= 0) {
            this.getSymbolFromPosition();

        } else {
            this.offsetY = (this.offsetY - this.speed)
            this.timeRemaining = (this.timeRemaining - 1)
            if (this.timeRemaining % 6 === 0)
                this.image.offset = { x: 0, y: this.offsetY / 10 }
            const offset = this.image.offset.y * -1
            if (offset > 250) {
                this.image.offset = { x: 0, y: 0 }
                this.offsetY = 0
            }
            // this.timeRemaining = 10;
            this.image.update()
        }
    }
}
class Reel {
    public slots: Array<Slot>
    constructor(
        slots: Array<Slot>
    ) {
        this.slots = slots;
    }
}

const iconHeight = 50;

const Slots = (props: any) => {

    const { ...rest } = props
    const canvasRef = useRef(null)
    const slotsCanvas = useRef<HTMLDivElement>(null);

    const [lights, setLights] = useState(null)
    const [lever, setLever] = useState(null)
    const [reels, setReels] = useState(null)
    const [result, setResult] = useState<Array<any>>([])
    const [size, setSize] = useState<Array<number>>([400, 200]);

    useEffect(() => {
        const client = new EventSource("https://betsse.onyxtechnology.co.uk/api/slots/feed");
        client.addEventListener("slots", jmsevent => {
            if (jmsevent.data === 'keep-alive') return;
            let args = jmsevent.data.split(' ')
            switch (args[0]) {
                case "game_result": {
                    const username = args[1]
                    let results: Array<any> =  [ args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16] ]

                    setResult(results);
                    break;
                }
            }
        })
    }, []);

    useLayoutEffect(() => {

        function updateSize() {
            setSize([
                slotsCanvas.current!.clientWidth,
                slotsCanvas.current!.clientHeight,
            ]);
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {

        const canvas: HTMLCanvasElement | null = canvasRef.current
        const context: CanvasRenderingContext2D = canvas!!.getContext('2d')!!

        // context.fillRect(0, 0, 1000, 1000)
        let frameCount = 0
        let animationFrameId: number;

        if (!reels && result.length) {
            console.log(result);
            
            const reels: Array<Reel> = [

                new Reel([
                    getSlot(result[0], context, { x: 0, y: 0 }),
                    getSlot(result[1], context, { x: 0, y: 1 }),
                    getSlot(result[2], context, { x: 0, y: 2 })
                ]),

                new Reel([
                    getSlot(result[3], context, { x: 1, y: 0 }),
                    getSlot(result[4], context, { x: 1, y: 1 }),
                    getSlot(result[5], context, { x: 1, y: 2 })
                ]),

                new Reel([
                    getSlot(result[6], context, { x: 2, y: 0 }),
                    getSlot(result[7], context, { x: 2, y: 1 }),
                    getSlot(result[8], context, { x: 2, y: 2 })
                ]),

                new Reel([
                    getSlot(result[9], context, { x: 3, y: 0 }),
                    getSlot(result[10], context, { x: 3, y: 1 }),
                    getSlot(result[11], context, { x: 3, y: 2 })
                ]),

                new Reel([
                    getSlot(result[12], context, { x: 4, y: 0 }),
                    getSlot(result[13], context, { x: 4, y: 1 }),
                    getSlot(result[14], context, { x: 4, y: 2 }),
                ])
            ]
            // @ts-ignore
            setReels(reels)
        }
        if (!lever) {
            //@ts-ignore
            // setLever(new AnimatedSprite(context,
            //     { x: defaultX + 1110, y: 160 },
            //     'http://localhost:3000/assets/games/online/slots/handle_Spritesheet5x1.png',
            //     1,
            //     5,
            //     { x: 0, y: 0 },
            //     [{
            //         idle: {
            //             imageSrc: 'http://localhost:3000/assets/games/online/slots/handle_Spritesheet5x1.png',
            //             framesMax: 5
            //         },
            //     }]).update())
        }

        const render = () => {
            frameCount++
            const canvas: HTMLCanvasElement | null = canvasRef.current
            context.clearRect(0, 0, canvas!!.width, canvas!!.height);
            drawSlotMachine(context, frameCount)
            drawSlotMachineShadow(context, frameCount)
            drawSlotMachineNumbers(context, frameCount)
            drawSlotMachineHeader(context, frameCount)
            drawSlotMachineWagerOptions(context, frameCount)

            if (reels) {
                // @ts-ignore
                reels.map((reel: Reel) => {
                    reel.slots.map((slot: Slot) => {
                        slot.tick()
                        // slot.image.update()
                    })
                })
            }

            if (lever) {
                // @ts-ignore
                lever!!.update()
            }

            if (lights) {
                // @ts-ignore
                lights!!.update()
            }
            // @ts-ignore
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [result, lever])

    return (<div className='slotsCanvas' ref={slotsCanvas}><canvas width="1400" height="750" ref={canvasRef} {...rest} /></div>)
}

export default Slots