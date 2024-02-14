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
        setup().then(()=> window.addEventListener("keydown", onKeyDown));
        return () => {
            app.current.destroy(true);
            window.removeEventListener("keydown", onKeyDown);
        };

    }, []);

    async function setup() {
        app.current = new PIXI.Application({
            width: container.current.clientWidth,
            height: container.current.clientHeight,
            backgroundColor: 0x1099bb,
        });
        container.current.appendChild(app.current.view);
        // TODO We will want to build Pixi sprite maps for our assets
        square.current = PIXI.Sprite.from("/arrow.png");

        // center the sprite's origin
        square.current.anchor.set(0.5);
        square.current.x = app.current.renderer.width / 2;
        square.current.y = app.current.renderer.height / 2;
        square.current.width = 100;
        square.current.height = 100;
        app.current.stage.addChild(square.current);
        app.current.ticker.add(() => {
            let {x, y, width, height} = square.current;
            x += v.current.x;
            y += v.current.y;
            const halfWidth = width / 2;
            const halfHeight = height / 2;

            // If the square goes out of bounds, set it to the bounds
            if (x - halfWidth < 0) x = halfWidth;
            if (y - halfHeight < 0) y = halfHeight;
            if (x > app.current.renderer.width - width/2) x = app.current.renderer.width - width/2;
            if (y > app.current.renderer.height - height/2) y = app.current.renderer.height - height/2;
            square.current.x = x;
            square.current.y = y;
        });
    }
    // Handle arrow keys and WASD
    function onKeyDown(e) {
        switch (e.key) {
            case "ArrowUp":
            case "w":
                v.current.y = -V;
                v.current.x = 0;
                // rotate the sprite to point up (180 degrees)
                square.current.rotation = Math.PI;
                break;
            case "ArrowDown":
            case "s":
                v.current.y = V;
                v.current.x = 0;
                // set the sprite to point down (0 degrees)
                square.current.rotation = 0;
                break;
            case "ArrowLeft":
            case "a":
                v.current.x = -V;
                v.current.y = 0;
                // rotate the sprite to point left (90 degrees)
                square.current.rotation = Math.PI / 2;
                break;
            case "ArrowRight":
            case "d":
                v.current.x = V;
                v.current.y = 0;
                // rotate the sprite to point right (270 degrees)
                square.current.rotation = -Math.PI / 2;
                break;
        }
    }

    return (
        <div ref={container} className={"grow m-5 rounded overflow-hidden"}></div>
    );
}
