import React from "react";

import Client from "rpccloud-client-js";
import { observer } from "mobx-react-lite";
import { makeAutoObservable, runInAction } from "mobx";
import { Locale } from "./locale";
import Main from "./main";
import Login from "./login";
import Register from "./register";
import Debug from "./debug";
import { Start } from "./start";
import { RPCAny } from "rpccloud-client-js/build/types";

const routeMap: Map<string, React.ReactNode> = new Map([
    ["start", <Start />],
    ["main", <Main />],
    ["login", <Login />],
    ["register", <Register />],
    ["debug", <Debug />],
]);

export default observer(function () {
    return AppConfig.get().isValid() ? (
        <>{routeMap.get(AppConfig.get().rootRoute)}</>
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

export class AppConfig {
    locale?: Locale;
    rootRoute: string;
    headHeight: number;
    footerHeight: number;
    margin: number;

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
