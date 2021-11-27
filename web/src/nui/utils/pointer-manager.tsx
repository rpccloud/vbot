import { Point } from "..";

interface PointerListener {
    onPointerMove: (deltaX: number, deltaY: number) => void;
    onPointerUp: () => void;
}

export class PointerManager {
    private static seed: number = 1;
    private static mouseDownPoint?: Point;
    private static sonarMap = new Map<number, PointerListener>();
    private static mouseLocation: Point = { x: 0, y: 0 };

    public static checkPointerMove(
        onPointerDown: () => void,
        onPointerMove: (xDelta: number, yDelta: number) => void,
        onPointerUp: () => void
    ): boolean {
        if (this.mouseDownPoint) {
            const id = this.seed++;
            onPointerDown();
            this.sonarMap.set(id, {
                onPointerMove: onPointerMove,
                onPointerUp: onPointerUp,
            });
            return true;
        } else {
            return false;
        }
    }

    public static getMouseLocation(): Point {
        return { x: this.mouseLocation.x, y: this.mouseLocation.y };
    }

    private static _ = (() => {
        window.addEventListener(
            "pointerdown",
            (e) => {
                if (e.button === 0) {
                    this.mouseDownPoint = { x: e.clientX, y: e.clientY };
                }
            },
            true
        );

        window.addEventListener(
            "pointermove",
            (e) => {
                this.mouseLocation.x = e.clientX;
                this.mouseLocation.y = e.clientY;
                if (this.mouseDownPoint) {
                    const deltaX = e.clientX - this.mouseDownPoint.x;
                    const deltaY = e.clientY - this.mouseDownPoint.y;
                    this.sonarMap.forEach((v) => {
                        v.onPointerMove(deltaX, deltaY);
                    });
                }
            },
            true
        );

        window.addEventListener(
            "pointerup",
            (e) => {
                this.mouseDownPoint = undefined;
                this.sonarMap.forEach((v) => {
                    v.onPointerUp();
                });
                this.sonarMap = new Map<number, PointerListener>();
            },
            true
        );
    })();
}
