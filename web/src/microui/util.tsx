export async function sleep(timeMS: number) {
    return new Promise((resolve) => setTimeout(resolve, timeMS));
}

export function range(v: number, min: number, max: number): number {
    if (v < min) {
        v = min;
    }

    if (v > max) {
        v = max;
    }

    return v;
}

export function makeTransition(
    attrs: Array<string>,
    timeMS: number,
    timingFunc: string
): string {
    const vArray = attrs.map((v) => {
        return `${v} ${timeMS}ms ${timingFunc}`;
    });

    return vArray.join(",");
}

interface TimeListener {
    onTimer(timeMS: number): void;
}

export class TimerManager {
    private static instance = new TimerManager();

    private timer?: number;
    private timeNowMS: number;
    private slowMap = new Map<number, TimeListener>();
    private fastMap = new Map<number, TimeListener>();
    private timeCount = 0;
    private seed: number = 1;

    public static get(): TimerManager {
        return TimerManager.instance;
    }

    constructor() {
        this.timeNowMS = new Date().getTime();
        this.timer = window.setInterval(this.onTimer.bind(this), 25);
    }

    getNowMS() {
        return this.timeNowMS;
    }

    onTimer() {
        this.timeNowMS = new Date().getTime();
        this.timeCount++;

        if (this.timeCount % 10 === 0) {
            this.slowMap.forEach((it) => {
                it.onTimer(this.timeNowMS);
            });
        }

        this.fastMap.forEach((it) => {
            it.onTimer(this.timeNowMS);
        });
    }

    attach(item: TimeListener): number {
        const seed = this.seed++;
        this.slowMap.set(seed, item);
        return seed;
    }

    detach(id: number): boolean {
        const retSlow = this.slowMap.delete(id);
        const retFast = this.fastMap.delete(id);
        return retSlow || retFast;
    }

    slow(id: number) {
        const item = this.fastMap.get(id);
        if (item) {
            this.fastMap.delete(id);
            this.slowMap.set(id, item);
        }
        return this.slowMap.has(id);
    }

    fast(id: number): boolean {
        const item = this.slowMap.get(id);
        if (item) {
            this.slowMap.delete(id);
            this.fastMap.set(id, item);
        }
        return this.fastMap.has(id);
    }

    close() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}

export class ThemeCache {
    private configMap = new Map<string, { timeMS: number; config: any }>();
    private timer: number;

    constructor() {
        this.timer = TimerManager.get().attach(this);
    }

    onTimer(nowMS: number): void {
        this.configMap.forEach((item, key) => {
            if (nowMS - item.timeMS > 10000) {
                this.configMap.delete(key);
            }
        });
    }

    getConfig(key: string): any {
        let item = this.configMap.get(key);

        if (item) {
            item.timeMS = TimerManager.get().getNowMS();
            this.configMap.set(key, item);
            return item.config;
        } else {
            return null;
        }
    }

    setConfig(key: string, config: any) {
        this.configMap.set(key, {
            timeMS: TimerManager.get().getNowMS(),
            config: config,
        });
    }
}

export class SeedManager {
    private static seed = 1;
    public static getSeed() {
        return SeedManager.seed++;
    }
}
