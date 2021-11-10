import { gTimerManager, ScreenRect } from "..";

function isScreenRectEqual(left?: ScreenRect, right?: ScreenRect): boolean {
    if (left === undefined && right === undefined) {
        return true;
    }

    return (
        left?.x === right?.x &&
        left?.y === right?.y &&
        left?.width === right?.width &&
        left?.height === right?.height
    );
}

export class ResizeSensor {
    private timer?: number;
    private ref: React.RefObject<HTMLElement>;
    private onResize: (rect?: ScreenRect) => void;
    private rect?: ScreenRect;

    constructor(
        ref: React.RefObject<HTMLElement>,
        onResize: (rect?: ScreenRect) => void
    ) {
        this.ref = ref;
        this.onResize = onResize;
        this.timer = gTimerManager.attach(this);
    }

    listenSlow() {
        if (this.timer) {
            gTimerManager.slow(this.timer);
        }
    }

    listenFast() {
        if (this.timer) {
            gTimerManager.fast(this.timer);
        }
    }

    onTimer() {
        let rect = this.ref.current
            ? this.ref.current.getBoundingClientRect()
            : undefined;

        if (!isScreenRectEqual(rect, this.rect)) {
            this.rect = rect;
            this.onResize(rect);
        }
    }

    close() {
        if (this.timer) {
            gTimerManager.detach(this.timer);
            this.timer = undefined;
        }
    }
}
