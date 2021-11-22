import { TimerManager } from "./time-manager";

export class ShortLivedValue {
    private delayMS: number;
    private defaultValue: any;
    private currentValue: any;
    private onValueChange?: (value: any) => void;

    private timer?: number;
    private startMS: number;

    constructor(
        delayMS: number,
        defaultValue: any,
        onValueChange: (value: any) => void
    ) {
        this.startMS = 0;
        this.delayMS = delayMS;
        this.defaultValue = defaultValue;
        this.currentValue = defaultValue;
        this.onValueChange = onValueChange;
    }

    public setValue(value: any) {
        if (this.onValueChange) {
            if (value !== this.currentValue) {
                this.currentValue = value;
                this.onValueChange(this.currentValue);
            }

            if (this.currentValue !== this.defaultValue) {
                this.startMS = TimerManager.getNowMS();
                if (!this.timer) {
                    this.timer = TimerManager.attach(this);
                }
            }
        }
    }

    public onTimer(nowMS: number) {
        if (nowMS - this.startMS > this.delayMS) {
            this.setValue(this.defaultValue);

            if (this.timer) {
                TimerManager.detach(this.timer);
                this.timer = undefined;
            }
        }
    }

    public close() {
        this.onValueChange = undefined;
        if (this.timer) {
            TimerManager.detach(this.timer);
            this.timer = undefined;
        }
    }
}
