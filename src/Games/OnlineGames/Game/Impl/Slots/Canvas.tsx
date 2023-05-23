import React, {useEffect, useRef} from 'react'

const Canvas = (props: any) => {

    const { draw, ...rest } = props
    const canvasRef = useRef(null)

    useEffect(() => {

        const canvas: HTMLCanvasElement | null = canvasRef.current
        const context = canvas!!.getContext('2d')
        let frameCount = 0
        let animationFrameId: number;

        const render = () => {
            frameCount++
            draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])

    return <canvas ref={canvasRef} {...rest}/>
}

export default Canvas