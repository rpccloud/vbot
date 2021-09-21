import { makeAutoObservable } from "mobx"

export default interface Lang {
    register: Register
}

export interface Register {
    title1: string
    title2: string
}

export class Locale {
    antd: any
    app: any

    constructor() {
        makeAutoObservable(this)
    }
}

export async function newLocale(name: string): Promise<Locale> {
    let ret = new Locale()
    switch (name) {
        case "en_US":
            ret.antd = (await import("antd/lib/locale/zh_CN")).default
            ret.app = (await import("./en_US")).default
            return ret
        default:
            return ret
    }
}
