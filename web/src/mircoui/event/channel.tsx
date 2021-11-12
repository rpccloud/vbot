import { SeedManager } from "..";

type Handler = (...args: any) => any;

class ChannelManager {
    private static channelMap = new Map<string, Map<number, Handler>>();

    public static call(target: string, args: any[]): Array<any> {
        let handlerMap = ChannelManager.channelMap.get(target);

        if (!handlerMap) {
            return [];
        }

        let ret = new Array<any>();

        handlerMap.forEach((handler) => {
            ret.push(handler(...args));
        });

        return ret;
    }

    public static addListener(target: string, handler: Handler): number {
        let handlerMap = ChannelManager.channelMap.get(target);

        if (!handlerMap) {
            handlerMap = new Map<number, Handler>();
            ChannelManager.channelMap.set(target, handlerMap);
        }

        const handlerID = SeedManager.getSeed();
        handlerMap.set(handlerID, handler);
        return handlerID;
    }

    public static removeListener(target: string, handlerID: number): boolean {
        let handlerMap = ChannelManager.channelMap.get(target);
        if (!handlerMap) {
            return false;
        }

        const ret = handlerMap.delete(handlerID);
        ChannelManager.check(target);
        return ret;
    }

    private static check(target: string) {
        let handlerMap = ChannelManager.channelMap.get(target);

        if (handlerMap?.size === 0) {
            ChannelManager.channelMap.delete(target);
        }
    }

    static debug() {
        console.log("ChannelManager debug start");
        ChannelManager.channelMap.forEach((v1, k1) => {
            v1.forEach((v2, k2) => {
                console.log(`${k1}-${k2} ${v2}`);
            });
        });
        console.log("ChannelManager debug end");
    }
}

export class EventListener {
    private readonly target: string;
    private readonly handlerID: number;

    constructor(target: string, handler: Handler) {
        const handlerID = ChannelManager.addListener(target, handler);
        this.target = target;
        this.handlerID = handlerID;
    }

    public close(): boolean {
        return ChannelManager.removeListener(this.target, this.handlerID);
    }
}

export function evalEvent(target: string, ...args: any): Array<any> {
    return ChannelManager.call(target, args);
}
