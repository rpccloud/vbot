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

    static async new(lang: string) {
        let ret = new Locale()
        switch (lang) {
            case "en-US":
                ret.antd = (await import("antd/lib/locale/en_US")).default
                ret.app = (await import("./en_US")).default
                return ret
            case "zh-CN":
                ret.antd = (await import("antd/lib/locale/zh_CN")).default
                ret.app = (await import("./en_US")).default
                return ret
            default:
                ret.antd = (await import("antd/lib/locale/en_US")).default
                ret.app = (await import("./en_US")).default
                return ret
        }
    }

    private constructor() {

    }
}


