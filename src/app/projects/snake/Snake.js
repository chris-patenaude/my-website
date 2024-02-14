'use client'

import React, {useRef, useEffect} from "react";
import * as PIXI from "pixi.js";

const V = 1;

export default function Snake() {
    const container= useRef(null);
    const app = useRef(null);
    const square = useRef(null);

    useEffect(() => {
        // Initialize PIXI and create a canvas
        app.current = new PIXI.Application({
            width: container.current.clientWidth,
            height: container.current.clientHeight,
            backgroundColor: 0x1099bb,
        });
        container.current.appendChild(app.current.view);

        // Draw a square
        square.current = new PIXI.Graphics();
        square.current.beginFill(0x66CCFF);
        square.current.drawRect(0, 0, 100, 100);
        square.current.endFill();
        square.current.x = 100;
        square.current.y = 100;

        app.current.stage.addChild(square.current);
        let vx = V;
        let vy = V;
        app.current.ticker.add(() => {
            square.current.x += vx;
            square.current.y += vy;
            if (square.current.x <= 0 || square.current.x + square.current.width >= app.current.screen.width) {
                vx = -vx;
            }
            if (square.current.y <= 0 || square.current.y + square.current.height >= app.current.screen.height) {
                vy = -vy;
            }
        });
        return () => {
            app.current.destroy(true);
        };

    }, []);

    return (
        <div ref={container} className={"grow m-5 rounded overflow-hidden"}></div>
    );
}
