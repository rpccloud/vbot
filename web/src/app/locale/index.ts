export default interface Lang {
    register: Register;
}

export interface Register {
    title1: string;
    title2: string;
}

export class Locale {
    antd: any;
    app: Lang;

    static async new(lang: string) {
        switch (lang) {
            case "en-US": {
                const antd = (await import("antd/lib/locale/en_US")).default;
                const app = (await import("./en-US")).default;
                return new Locale(antd, app);
            }
            case "zh-CN": {
                const antd = (await import("antd/lib/locale/zh_CN")).default;
                const app = (await import("./zh-CN")).default;
                return new Locale(antd, app);
            }
            default: {
                const antd = (await import("antd/lib/locale/en_US")).default;
                const app = (await import("./en-US")).default;
                return new Locale(antd, app);
            }
        }
    }

    private constructor(antd: any, app: Lang) {
        this.antd = antd;
        this.app = app;
    }
}
