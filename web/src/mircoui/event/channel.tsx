import { SeedManager } from "..";

type Handler = (...args: any) => any;

class ChannelRecord {
    channelID?: number;
    eventMap = new Map<string, Map<number, Handler>>();

    isFree(): boolean {
        return this.channelID === undefined && this.eventMap.size === 0;
    }
}

class ChannelManager {
    private static channelMap = new Map<string, ChannelRecord>();

    public static registerChannel(
        listenID: string,
        channelID: number
    ): boolean {
        let record = ChannelManager.channelMap.get(listenID);
        if (!record) {
            record = new ChannelRecord();
            ChannelManager.channelMap.set(listenID, record);
        }

        if (record.channelID !== undefined) {
            return false;
        }

        record.channelID = channelID;
        return true;
    }

    public static unregisterChannel(
        listenID: string,
        channelID: number
    ): boolean {
        let record = ChannelManager.channelMap.get(listenID);
        if (!record) {
            return false;
        }
        if (record.channelID !== channelID) {
            return false;
        }

        record.channelID = undefined;
        ChannelManager.check(listenID);
        return true;
    }

    public static hasChannel(listenID: string): boolean {
        let record = ChannelManager.channelMap.get(listenID);
        return !!record && record.channelID !== undefined;
    }

    public static call(
        listenID: string,
        channelID: number,
        eventName: string,
        args: any[]
    ): Array<any> {
        const record = ChannelManager.channelMap.get(listenID);
        if (record?.channelID !== channelID) {
            return [];
        }

        let handlerMap = record.eventMap.get(eventName);
        if (!handlerMap) {
            return [];
        }

        let ret = new Array<any>();

        handlerMap.forEach((handler) => {
            ret.push(handler(...args));
        });

        return ret;
    }

    public static addListener(
        listenID: string,
        eventName: string,
        handler: Handler
    ): number {
        let record = ChannelManager.channelMap.get(listenID);
        if (!record) {
            record = new ChannelRecord();
            ChannelManager.channelMap.set(listenID, record);
        }

        let handlerMap = record.eventMap.get(eventName);
        if (!handlerMap) {
            handlerMap = new Map<number, Handler>();
            record.eventMap.set(eventName, handlerMap);
        }

        const handlerID = SeedManager.getSeed();
        handlerMap.set(handlerID, handler);
        return handlerID;
    }

    public static removeListener(
        listenID: string,
        eventName: string,
        handlerID: number
    ): boolean {
        let record = ChannelManager.channelMap.get(listenID);
        if (!record) {
            return false;
        }

        let handlerMap = record.eventMap.get(eventName);
        if (!handlerMap) {
            return false;
        }

        const ret = handlerMap.delete(handlerID);
        ChannelManager.check(listenID);
        return ret;
    }

    private static check(listenID: string) {
        let record = ChannelManager.channelMap.get(listenID);
        if (record && record.isFree()) {
            ChannelManager.channelMap.delete(listenID);
        }
    }

    static debug() {
        console.log("ChannelManager debug start");
        ChannelManager.channelMap.forEach((v1, k1) => {
            v1.eventMap.forEach((v2, k2) => {
                v2.forEach((v3, k3) => {
                    console.log(`${k1}-${k2}-${k3} ${v3}`);
                });
            });
        });
        console.log("ChannelManager debug end");
    }
}

export class EventChannel {
    private readonly listenID: string;
    private readonly channelID: number;

    public static new(listenID: string): EventChannel | null {
        const channelID = SeedManager.getSeed();

        if (ChannelManager.registerChannel(listenID, channelID)) {
            return new EventChannel(listenID, channelID);
        } else {
            return null;
        }
    }

    private constructor(listenID: string, channelID: number) {
        this.channelID = channelID;
        this.listenID = listenID;
    }

    public call(eventName: string, ...args: any): Array<any> {
        return ChannelManager.call(
            this.listenID,
            this.channelID,
            eventName,
            args
        );
    }

    public close(): boolean {
        return ChannelManager.unregisterChannel(this.listenID, this.channelID);
    }
}

export class EventListener {
    private readonly listenID: string;
    private readonly eventName: string;
    private readonly handlerID: number;

    constructor(listenID: string, eventName: string, handler: Handler) {
        const handlerID = ChannelManager.addListener(
            listenID,
            eventName,
            handler
        );
        this.listenID = listenID;
        this.eventName = eventName;
        this.handlerID = handlerID;
    }

    public close(): boolean {
        return ChannelManager.removeListener(
            this.listenID,
            this.eventName,
            this.handlerID
        );
    }
}
