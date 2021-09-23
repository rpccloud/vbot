import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { observer } from "mobx-react-lite";

import { makeAutoObservable, runInAction } from "mobx"
import { Locale } from "./locale"

import Main from "./pages/main"
import Login from "./pages/login"
import Register from "./pages/register"

import { ConfigProvider } from "antd";

export default observer(() => {
    return gAppData.isValid() ? (
        <ConfigProvider locale={gAppData.locale?.antd} >
            <Router>
                <Redirect exact from="/" to="login" />
                <Switch>
                    <Route path="/main">
                        <Main />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                </Switch>
            </Router>
        </ConfigProvider>
    ) : null
})

export class ThemeManager {
    private styleElem: HTMLLinkElement
    private displayMode: string

    constructor() {
        this.displayMode = ""
        this.styleElem = document.createElement('link')
        this.styleElem.rel = 'stylesheet';
        this.styleElem.type = 'text/css';
        document.head.appendChild(this.styleElem);
        this.setLight()
    }

    setLight() {
        this.displayMode = "light"
        this.styleElem.href = "/light.css"
    }

    setDark() {
        this.displayMode = "dark"
        this.styleElem.href = "/dark.css"
    }

    isLight(): boolean {
        return this.displayMode === "light"
    }

    isDark(): boolean {
        return this.displayMode === "dark"
    }
}

export class AppData {
    locale?: Locale

    constructor() {
        makeAutoObservable(this)
        this.setLang(window.navigator.language)
    }

    async setLang(lang: string) {
        let ret = await Locale.new(lang)
        runInAction(() => {
            this.locale  = ret
        })
    }

    isValid(): boolean {
        return !!this.locale
    }
}

export const gThemeManager = new ThemeManager()
export const gAppData = new AppData()

