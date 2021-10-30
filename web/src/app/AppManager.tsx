import React from "react";

import Client from "rpccloud-client-js";
import { observer } from "mobx-react-lite";
import { makeAutoObservable, runInAction } from "mobx";
import { Locale } from "./locale";
import Main from "./main";
import Login from "./login";
import Register from "./register";
import Debug from "./debug";
import { ConfigProvider } from "antd";
import StartPage from "./start";
import { RPCAny } from "rpccloud-client-js/build/types";

import { ThemeContext, ThemeConfig } from "../ui/theme/config";

const routeMap: Map<string, any> = new Map([
    ["start", <StartPage />],
    ["main", <Main />],
    ["login", <Login />],
    ["register", <Register />],
    ["debug", <Debug />],
]);

export default observer(() => {
    const appData = AppData.get();
    return appData.isValid() ? (
        <ThemeContext.Provider value={ThemeConfig.get()}>
            <ConfigProvider locale={AppData.get().locale?.antd}>
                {routeMap.get(AppData.get().rootRoute)}
            </ConfigProvider>
        </ThemeContext.Provider>
    ) : null;
});

export class AppData {
    locale?: Locale;
    rootRoute: string;

    private constructor() {
        makeAutoObservable(this);
        this.setLang(window.navigator.language);
        this.rootRoute = "debug";
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

    private static instance = new AppData();
    static get(): AppData {
        return AppData.instance;
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

// window.onbeforeunload = function(event) {
//     event.returnValue = "false";
// }
