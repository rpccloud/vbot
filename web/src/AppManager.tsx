import React from "react";
import Client from "rpccloud-client-js";

import { observer } from "mobx-react-lite";
import { makeAutoObservable, runInAction } from "mobx"

import { Locale } from "./locale"
import Main from "./pages/main"
import Login from "./pages/login"
import Register from "./pages/register"
import Debug from "./pages/debug";
import { ConfigProvider } from "antd";
import StartPage from "./pages/start";
import { RPCAny } from "rpccloud-client-js/build/types";

const routeMap: Map<string, any> = new Map([
    ["start", (<StartPage />)],
    ["main", (<Main />)],
    ["login", (<Login />)],
    ["register", (<Register />)],
    ["debug", (<Debug />)],
]);

export default observer(() => {
    return AppData.get().isValid() ? (
        <ConfigProvider locale={AppData.get().locale?.antd} >
            {routeMap.get(AppData.get().rootRoute)}
        </ConfigProvider>
    ) : null
})

export class AppTheme {
    private styleElem: HTMLLinkElement
    private displayMode: string

    private constructor() {
        this.displayMode = ""
        this.styleElem = document.createElement('link')
        this.styleElem.rel = 'stylesheet';
        this.styleElem.type = 'text/css';
        document.head.appendChild(this.styleElem);
        this.setLight()
    }

    setLight() {
        this.displayMode = "light"
        this.styleElem.href = "./light.css"
    }

    setDark() {
        this.displayMode = "dark"
        this.styleElem.href = "./dark.css"
    }

    isLight(): boolean {
        return this.displayMode === "light"
    }

    isDark(): boolean {
        return this.displayMode === "dark"
    }

    private static instance = new AppTheme()
    static get(): AppTheme {
        return AppTheme.instance
    }
}

export class AppData {
    locale?: Locale
    rootRoute: string

    private constructor() {
        makeAutoObservable(this)
        this.setLang(window.navigator.language)
        this.rootRoute = "start"
    }

    async setLang(lang: string) {
        let ret = await Locale.new(lang)
        runInAction(() => {
            this.locale  = ret
        })
    }

    setRootRoute(rootRoute: string) {
        runInAction(() => {
            this.rootRoute  = rootRoute
        })
    }

    isValid(): boolean {
        return !!this.locale
    }

    private static instance = new AppData()
    static get(): AppData {
        return AppData.instance
    }
}

export class AppUser {
    private static client = new Client("ws://127.0.0.1:8080/rpc")
    private static sessionID = ""

    static getSessionID(): string {
        return AppUser.sessionID
    }

    static send(timeoutMS: number, target: string, ...args: Array<RPCAny>): Promise<RPCAny> {
        return AppUser.client.send(timeoutMS, target, ...args)
    }
}

// window.onbeforeunload = function(event) {
//     event.returnValue = "false";
// }
