'use client'

import React, {useEffect, useRef} from "react";
import * as PIXI from "pixi.js";

const V = 5;

export default function Snake() {
    const container = useRef(null);
    const app = useRef(null);
    const head = useRef(null);
    const tail = useRef(null);
    const v = useRef({x: 0, y: V});
    const headQueue = useRef([]);

    useEffect(() => {
        setup().then(() => window.addEventListener("keydown", onKeyDown));
        return () => {
            app.current.destroy(true);
            window.removeEventListener("keydown", onKeyDown);
        };
    });

    async function setup() {
        app.current = new PIXI.Application({
            width: container.current.clientWidth,
            height: container.current.clientHeight,
            backgroundColor: 0x1099bb,
        });
        container.current.appendChild(app.current.view);
        // TODO We will want to build Pixi sprite maps for our assets

        const snakeHead = PIXI.Texture.from("/arrow.png");
        const headPos = {x: app.current.renderer.width / 2, y: app.current.renderer.height / 2};
        head.current = createSprite(headPos, snakeHead);

        const snakeTail = PIXI.Texture.from("/arrow.png");
        const tailPos = {x: headPos.x, y: headPos.y - 100};
        tail.current = createSprite(tailPos, snakeTail);

        app.current.stage.addChild(head.current, tail.current);
        app.current.ticker.add(() => {
            updateHeadPos();
            updateTailPos();
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
                head.current.rotation = Math.PI;
                break;
            case "ArrowDown":
            case "s":
                v.current.y = V;
                v.current.x = 0;
                // set the sprite to point down (0 degrees)
                head.current.rotation = 0;
                break;
            case "ArrowLeft":
            case "a":
                v.current.x = -V;
                v.current.y = 0;
                // rotate the sprite to point left (90 degrees)
                head.current.rotation = Math.PI / 2;
                break;
            case "ArrowRight":
            case "d":
                v.current.x = V;
                v.current.y = 0;
                // rotate the sprite to point right (270 degrees)
                head.current.rotation = -Math.PI / 2;
                break;
        }
    }

    function updateHeadPos() {
        let {x, y, width, height} = head.current;
        x += v.current.x;
        y += v.current.y;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        // If the head goes out of bounds, set it to the bounds
        if (x - halfWidth < 0) x = halfWidth;
        if (y - halfHeight < 0) y = halfHeight;
        if (x > app.current.renderer.width - width / 2) x = app.current.renderer.width - width / 2;
        if (y > app.current.renderer.height - height / 2) y = app.current.renderer.height - height / 2;
        head.current.x = x;
        head.current.y = y;

        headQueue.current.push({x, y});

        if(headQueue.current.length > 20) {
            headQueue.current.shift();
        }
    }

    function updateTailPos() {
        let {x, y, width, height} = tail.current;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const {x: hx, y: hy} = headQueue.current[0];
        x = hx;
        y = hy;
        tail.current.x = x;
        tail.current.y = y;

    }

    function createSprite(pos, texture) {
        const sprite = new PIXI.Sprite(texture);
        const {x, y} = pos;
        sprite.anchor.set(0.5);
        sprite.width = 100;
        sprite.height = 100;
        sprite.x = x;
        sprite.y = y;
        return sprite;
    }


    return (
        <div ref={container} className={"grow m-5 rounded overflow-hidden"}></div>
    );
}
