export default interface Lang {
    register: Register;
}

export interface Register {
    title1: string;
    title2: string;
}

export class Locale {
    app: Lang;

    static async new(lang: string) {
        switch (lang) {
            case "en-US": {
                const app = (await import("./en-US")).default;
                return new Locale(app);
            }
            case "zh-CN": {
                const app = (await import("./zh-CN")).default;
                return new Locale(app);
            }
            default: {
                const app = (await import("./en-US")).default;
                return new Locale(app);
            }
        }
    }

    private constructor(app: Lang) {
        this.app = app;
    }
}
