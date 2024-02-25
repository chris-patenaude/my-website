'use client'

import React, {useEffect, useRef} from "react";
import * as PIXI from "pixi.js";

const V = 5;

export default function Snake() {
    const v = useRef({x: 0, y: V});
    const container = useRef(null);
    const app = useRef(null);
    const snakeSegments = useRef([]);

    useEffect(() => {
        app.current = new PIXI.Application({
            width: container.current.clientWidth,
            height: container.current.clientHeight,
            backgroundColor: 0x1099bb,
        });
        const gameContainer = new PIXI.Container();
        // TODO We will want to build Pixi sprite maps for our assets
        container.current.appendChild(app.current.view);

        const headPos = {x: app.current.renderer.width / 2, y: app.current.renderer.height / 2};
        const tailPos = {x: headPos.x, y: headPos.y - 100};
        snakeSegments.current.push(createSnakeSegment(headPos));
        snakeSegments.current.push(createSnakeSegment(tailPos));

        // Remove later
        snakeSegments.current.push(createSnakeSegment({x: tailPos.x, y: tailPos.y - 200}));

        gameContainer.addChild(...snakeSegments.current);
        app.current.stage.addChild(gameContainer);
        app.current.ticker.add(() => {
            updateHeadPos();
            for(let i = 1; i < snakeSegments.current.length; i++) {
                updateSegmentPos(snakeSegments.current[i], snakeSegments.current[i-1].queue);
                gameContainer.setChildIndex(snakeSegments.current[i], gameContainer.children.length - 1);
            }
            gameContainer.removeChildren(0, gameContainer.children.length - 1);
            // Reverse the order of the segments so the head is on top
            for (let i = snakeSegments.current.length -1; i >= 0; i--) {
                gameContainer.addChild(snakeSegments.current[i]);
            }
        });
        window.addEventListener("keydown", onKeyDown);
        return () => {
            app.current.destroy(true);
            snakeSegments.current = [];
            window.removeEventListener("keydown", onKeyDown);
        };
    });

    // Handle arrow keys and WASD
    function onKeyDown(e) {
        switch (e.key) {
            case "ArrowUp":
            case "w":
                v.current.y = -V;
                v.current.x = 0;
                break;
            case "ArrowDown":
            case "s":
                v.current.y = V;
                v.current.x = 0;
                break;
            case "ArrowLeft":
            case "a":
                v.current.x = -V;
                v.current.y = 0;
                break;
            case "ArrowRight":
            case "d":
                v.current.x = V;
                v.current.y = 0;
                break;
        }
    }

    function updateHeadPos() {
        let {x, y, width, height} = snakeSegments.current[0];
        x += v.current.x;
        y += v.current.y;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        // If the head goes out of bounds, set it to the bounds
        if (x - halfWidth < 0) x = halfWidth;
        if (y - halfHeight < 0) y = halfHeight;
        if (x > app.current.renderer.width - width / 2) x = app.current.renderer.width - width / 2;
        if (y > app.current.renderer.height - height / 2) y = app.current.renderer.height - height / 2;
        if (v.current.x > 0) {
            snakeSegments.current[0].rotation = -Math.PI / 2;
        }
        if (v.current.x < 0) {
            snakeSegments.current[0].rotation = Math.PI / 2;
        }
        if(v.current.y > 0) {
            snakeSegments.current[0].rotation = 0;
        }
        if(v.current.y < 0) {
            snakeSegments.current[0].rotation = Math.PI;
        }
        updateSegmentPos(snakeSegments.current[0], [{x, y}]);
    }

    function updateSegmentPos(segment, leaderQueue) {
        const {x, y} = leaderQueue[0];
        segment.x = x;
        segment.y = y;
        segment.queue.push({x, y});

        // if segment changes direction, rotate the sprite
        // in the direction the segment is moving
        if (leaderQueue.length <= 1) {
            return
        }
        const {x: x1, y: y1} = leaderQueue[0];
        const {x: x2, y: y2} = leaderQueue[1];
        // If the segment is moving vertically
        if(x1 === x2) {
            if(y1 > y2) {
                segment.rotation = Math.PI;
            } else {
                segment.rotation = 0;
            }
        } else {
            if(x1 > x2) {
                segment.rotation = Math.PI / 2;
            } else {
                segment.rotation = -Math.PI / 2;
            }
        }

        // Remove the last position to maintain a one segment distance
        while(leaderQueue.length > segment.width / (V * 1.5)) {
            leaderQueue.shift();
        }
    }

    function createSnakeSegment(pos){
        const texture = PIXI.Texture.from("/arrow.png");
        const sprite = new PIXI.Sprite(texture);
        const {x, y} = pos;
        sprite.anchor.set(0.5);
        sprite.width = 100;
        sprite.height = 100;
        sprite.x = x;
        sprite.y = y;
        // Add position queue to sprite

        sprite.queue = [];
        return sprite;
    }


    return (
        <div ref={container} className={"grow m-5 rounded overflow-hidden"}></div>
    );
}
