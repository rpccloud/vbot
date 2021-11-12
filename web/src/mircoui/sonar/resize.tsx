import { TimerManager } from "../util";
import { Rect } from "../config";

function isRectEqual(left?: Rect, right?: Rect): boolean {
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

export class ResizeSonar {
    private timer?: number;
    private ref: React.RefObject<HTMLElement>;
    private onResize: (rect?: Rect) => void;
    private rect?: Rect;

    constructor(
        ref: React.RefObject<HTMLElement>,
        onResize: (rect?: Rect) => void
    ) {
        this.ref = ref;
        this.onResize = onResize;
        this.timer = TimerManager.get().attach(this);
    }

    listenSlow() {
        if (this.timer) {
            TimerManager.get().slow(this.timer);
        }
    }

    listenFast() {
        if (this.timer) {
            TimerManager.get().fast(this.timer);
        }
    }

    onTimer() {
        let rect = this.ref.current
            ? this.ref.current.getBoundingClientRect()
            : undefined;

        if (!isRectEqual(rect, this.rect)) {
            this.rect = rect;
            this.onResize(rect);
        }
    }

    close() {
        if (this.timer) {
            TimerManager.get().detach(this.timer);
            this.timer = undefined;
        }
    }
}
