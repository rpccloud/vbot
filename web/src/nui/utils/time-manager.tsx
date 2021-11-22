interface TimeListener {
    onTimer(timeMS: number): void;
}

export class TimerManager {
    private static timeNowMS: number = new Date().getTime();
    private static slowMap = new Map<number, TimeListener>();
    private static fastMap = new Map<number, TimeListener>();
    private static timeCount = 0;
    private static seed: number = 1;

    static getNowMS = (): number => {
        return this.timeNowMS;
    };

    static onTimer = (): void => {
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
    };

    static attach = (item: TimeListener): number => {
        const seed = this.seed++;
        this.slowMap.set(seed, item);
        return seed;
    };

    static detach = (id: number): boolean => {
        const retSlow = this.slowMap.delete(id);
        const retFast = this.fastMap.delete(id);
        return retSlow || retFast;
    };

    static slow = (id: number): boolean => {
        const item = this.fastMap.get(id);
        if (item) {
            this.fastMap.delete(id);
            this.slowMap.set(id, item);
        }
        return this.slowMap.has(id);
    };

    static fast = (id: number): boolean => {
        const item = this.slowMap.get(id);
        if (item) {
            this.slowMap.delete(id);
            this.fastMap.set(id, item);
        }
        return this.fastMap.has(id);
    };

    // we do not want to close it at any time
    private static _ = window.setInterval(this.onTimer, 25);
}
