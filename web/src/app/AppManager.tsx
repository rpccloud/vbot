import React from "react";

import Client from "rpccloud-client-js";
import { observer } from "mobx-react-lite";
import { makeAutoObservable, runInAction } from "mobx";
import { Locale } from "./locale";
import { Main } from "./main";
import { Login } from "./login";
import { Register } from "./register";
import Debug from "./debug";
import { Start } from "./start";
import { RPCAny } from "rpccloud-client-js/build/types";
import { Theme, ThemeContext } from "../microui/context/theme";

const routeMap: Map<string, React.ReactNode> = new Map([
    ["start", <Start />],
    ["main", <Main />],
    ["login", <Login />],
    ["register", <Register />],
    ["debug", <Debug />],
]);

export default observer(function () {
    return AppConfig.get().isValid() ? (
        <ThemeContext.Provider value={AppConfig.get().getTheme()}>
            {routeMap.get(AppConfig.get().rootRoute)}
        </ThemeContext.Provider>
    ) : null;
});

export class AppError {
    public report(e: any) {
        console.log(e);
    }

    private static instance = new AppError();
    static get(): AppError {
        return AppError.instance;
    }
}

export const ExtraColor = {
    appDarkBG: "rgb(10,20,41)",
    appBG: "rgba(10,30,65)",
    appLightBG: "rgba(51,129,246)",
};

export class AppConfig {
    locale?: Locale;
    rootRoute: string;
    headHeight: number;
    footerHeight: number;
    margin: number;
    private theme: Theme = {
        default: {
            pageBackground: "rgb(5, 10, 15)",
            contrastText: "#FFFFFFD0",
            outline: "#a0a0a0",
            divider: "rgb(30, 73, 118)",
        },
        primary: {
            main: "#cc7e00",
            contrastText: "#FFFFFFD0",
        },
        hover: {
            main: "#ff9c00",
            contrastText: "#FFFFFFE0",
        },
        highlight: {
            main: "#ffb133",
            contrastText: "#FFFFFFFF",
        },
        focus: {
            main: "#ffa733",
            contrastText: "#FFFFFFD0",
        },
        selected: {
            main: "#ff9100",
            contrastText: "#FFFFFFD0",
        },
        successful: {
            main: "#76ff03",
            contrastText: "#FFFFFFD0",
        },
        failed: {
            main: "rgb(235, 0, 20)",
            contrastText: "#FFFFFFD0",
        },
        disabled: {
            main: "#555",
            contrastText: "#808080C0",
        },
        transition: {
            duration: "300ms",
            easing: "ease-in-out",
        },
    };

    private constructor() {
        makeAutoObservable(this);
        this.setLang(window.navigator.language);
        this.rootRoute = "start";
        this.headHeight = 48;
        this.footerHeight = 24;
        this.margin = 24;
    }

    async setLang(lang: string) {
        let ret = await Locale.new(lang);
        runInAction(() => {
            this.locale = ret;
        });
    }

    setRootRoute(rootRoute: string) {
        runInAction(() => {
            this.rootRoute = rootRoute;
        });
    }

    isValid(): boolean {
        return !!this.locale;
    }

    getTheme(): Theme {
        return this.theme;
    }

    private static instance = new AppConfig();
    static get(): AppConfig {
        return AppConfig.instance;
    }
}

export class AppUser {
    private static client = new Client("ws://127.0.0.1:8080/rpc");
    private static sessionID = "";
    private static userName = "";

    static getSessionID(): string {
        return AppUser.sessionID;
    }

    static setSessionID(sessionID: string) {
        AppUser.sessionID = sessionID;
    }

    static getUserName(): string {
        return AppUser.userName;
    }

    static setUserName(userName: string) {
        AppUser.userName = userName;
    }

    static send(
        timeoutMS: number,
        target: string,
        ...args: Array<RPCAny>
    ): Promise<RPCAny> {
        return AppUser.client.send(timeoutMS, target, ...args);
    }
}

// window.onbeforeunload = function (event) {
//     event.returnValue = "false";
// };
