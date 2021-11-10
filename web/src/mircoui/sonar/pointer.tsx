import { Point } from "..";

export class PointerManager {
    private static instance = new PointerManager();

    public static get() {
        return PointerManager.instance;
    }

    private mouseDownPoint?: Point;
    private mousePoint: Point = { x: 0, y: 0 };
    private sonarMap = new Map<number, PointerSonar>();

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
                this.mousePoint = { x: e.clientX, y: e.clientY };
            },
            true
        );

        window.addEventListener(
            "pointerup",
            (e) => {
                this.mouseDownPoint = undefined;
                console.log(e);
            },
            true
        );
    }
}

export class PointerSonar {}
