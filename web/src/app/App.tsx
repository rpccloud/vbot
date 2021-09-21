
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { observer } from "mobx-react-lite";

import Main from "./main/Main"
import Login from "./login/Login"
import Register from "./register/Register"

import {AppData} from "./AppData"
import { ConfigProvider } from "antd";

interface AppProps {
    appData?: AppData
}

export default observer(({ appData }: AppProps) => (
    <ConfigProvider locale={appData?.locale.antd}>
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
))
