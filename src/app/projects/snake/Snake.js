'use client'

import React, {useEffect, useRef} from "react";
import * as PIXI from "pixi.js";

const V = 5;

export default function Snake() {
    const container = useRef(null);
    const app = useRef(null);
    const square = useRef(null);
    const v = useRef({x: 0, y: V});

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
        app.current.ticker.add(() => {
            square.current.x += v.current.x;
            square.current.y += v.current.y;
            if (square.current.x <= 0 || square.current.x + square.current.width >= app.current.screen.width) {
                v.current.x = -v.current.x;
            }
            if (square.current.y <= 0 || square.current.y + square.current.height >= app.current.screen.height) {
                v.current.y = -v.current.y;
            }
        });

        // Handle arrow keys and WASD
        const onKeyDown = (e) => {
            console.log("Key down", e.key)
            switch (e.key) {
                case "ArrowUp":
                case "w":
                    v.current.y = reverse(V);
                    v.current.x = 0;
                    break;
                case "ArrowDown":
                case "s":
                    v.current.y = V;
                    v.current.x = 0;
                    break;
                case "ArrowLeft":
                case "a":
                    v.current.x = reverse(V);
                    v.current.y = 0;
                    break;
                case "ArrowRight":
                case "d":
                    v.current.x = V;
                    v.current.y = 0;
                    break;
            }

        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            app.current.destroy(true);
            window.removeEventListener("keydown", onKeyDown);
        };

    }, []);

    function reverse(v) {
        return -v;
    }

    return (
        <div ref={container} className={"grow m-5 rounded overflow-hidden"}></div>
    );
}
