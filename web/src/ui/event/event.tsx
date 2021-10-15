
type Handler = (...args: Array<any>) => any
const channelMap = new Map<string, Map<string, Map<number, Handler>>>()

export function debugChannelMap() {
    console.log("debugChannelMap start")
    channelMap.forEach((v1, k1) => {
        v1.forEach((v2, k2) =>  {
            v2.forEach((v3, k3) =>  {
                console.log(`${k1}-${k2}-${k3} ${v3}`)

            })
        })
    })
    console.log("debugChannelMap end")
}

let seed = 1
function getSeed() {
    return seed++
}

export class EventSubscription {
    private id: string
    private eventName: string
    private handleID: number

    constructor(id: string, eventName: string, handleID: number) {
        this.id = id
        this.eventName = eventName
        this.handleID = handleID
    }
}

export class EventListener {
    private channelID: string
    private eventName: string
    private handlerID: number

    constructor(channelID: string, eventName: string,  handlerID: number) {
        this.channelID = channelID
        this.eventName = eventName
        this.handlerID = handlerID
    }

    close(): boolean {
        const channel = channelMap.get(this.channelID)
        if (!channel) {
            return false
        }

        let eventMap = channel.get(this.eventName)
        if (!eventMap) {
            return false
        }

        const ret = eventMap.delete(this.handlerID)

        if (eventMap.size === 0) {
            channel.delete(this.eventName)
        }

        return ret
    }
}

export class EventChannel {
    private channelID: string

    constructor(channelID: string) {
        this.channelID = channelID
    }

    listen(eventName: string, fn: Handler): EventListener | null {
        const channel = channelMap.get(this.channelID)
        if (!channel) {
            return null
        }

        const handlerID = getSeed()

        let eventMap = channel.get(eventName)
        if (!eventMap) {
            eventMap = new Map<number, Handler>()
            channel.set(eventName, eventMap)
        }
        eventMap.set(handlerID, fn)

        return new EventListener(this.channelID, eventName, handlerID)
    }

    close(): boolean {
        return channelMap.delete(this.channelID)
    }
}

export function registerChannel(channelID: string): EventChannel | null {
    if (!channelMap.has(channelID)) {
        channelMap.set(channelID, new Map<string, Map<number, Handler>>())
        return new EventChannel(channelID)
    }

    return null
}

export function getChannel(channelID: string): EventChannel | null {
    if (channelMap.has(channelID)) {
        return new EventChannel(channelID)
    }

    return null
}

