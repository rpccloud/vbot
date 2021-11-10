import { Point } from "..";

interface PointerListener {
    onPointerMove: (deltaX: number, deltaY: number) => void;
    onPointerUp: () => void;
}

export class PointerManager {
    private static instance = new PointerManager();

    public static get() {
        return PointerManager.instance;
    }

    private seed: number = 1;
    private mouseDownPoint?: Point;
    private sonarMap = new Map<number, PointerListener>();

    constructor() {
        window.addEventListener(
            "pointerdown",
            (e) => {
                this.mouseDownPoint = { x: e.clientX, y: e.clientY };
            },
            true
        );

        window.addEventListener(
            "pointermove",
            (e) => {
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
    }

    public checkPointerMove(
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
}
