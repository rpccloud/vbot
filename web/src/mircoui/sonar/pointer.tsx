import { Point } from "..";

interface PointerListener {
    onMove: (xDelta: number, yDelta: number) => void;
    onMoveEnd: () => {};
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
                    const xDelta = e.clientX - this.mouseDownPoint.x;
                    const yDelta = e.clientY - this.mouseDownPoint.y;
                    this.sonarMap.forEach((v) => {
                        v.onMove(xDelta, yDelta);
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
                    v.onMoveEnd();
                });
                this.sonarMap = new Map<number, PointerListener>();
            },
            true
        );
    }

    public checkPointerMove(
        onMoveStart: () => void,
        onMove: (xDelta: number, yDelta: number) => void,
        onMoveEnd: () => {}
    ): boolean {
        if (this.mouseDownPoint) {
            const id = this.seed++;
            onMoveStart();
            this.sonarMap.set(id, {
                onMove: onMove,
                onMoveEnd: onMoveEnd,
            });
            return true;
        } else {
            return false;
        }
    }
}
