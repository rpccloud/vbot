import { SeedManager } from "../util";

type HandlerParam = {
    action: string;
    param: any[];
    callback?: (param: any) => void;
};

type Handler = (o: HandlerParam) => void;

class ChannelManager {
    private static channelMap = new Map<string, Map<number, Handler>>();

    public static call(eid: string, param: HandlerParam) {
        let handlerMap = ChannelManager.channelMap.get(eid);

        if (!handlerMap) {
            return [];
        }

        handlerMap.forEach((handler) => {
            handler(param);
        });
    }

    public static addListener(eid: string, handler: Handler): number {
        let handlerMap = ChannelManager.channelMap.get(eid);

        if (!handlerMap) {
            handlerMap = new Map<number, Handler>();
            ChannelManager.channelMap.set(eid, handlerMap);
        }

        const handlerID = SeedManager.getSeed();
        handlerMap.set(handlerID, handler);
        return handlerID;
    }

    public static removeListener(eid: string, handlerID: number): boolean {
        let handlerMap = ChannelManager.channelMap.get(eid);
        if (!handlerMap) {
            return false;
        }

        const ret = handlerMap.delete(handlerID);
        ChannelManager.check(eid);
        return ret;
    }

    private static check(eid: string) {
        let handlerMap = ChannelManager.channelMap.get(eid);

        if (handlerMap?.size === 0) {
            ChannelManager.channelMap.delete(eid);
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
    private readonly eid: string;
    private readonly handlerID: number;

    constructor(eid: string, handler: Handler) {
        const handlerID = ChannelManager.addListener(eid, handler);
        this.eid = eid;
        this.handlerID = handlerID;
    }

    public close(): boolean {
        return ChannelManager.removeListener(this.eid, this.handlerID);
    }
}

export function evalEvent(eid: string, param: HandlerParam) {
    return ChannelManager.call(eid, param);
}
