import React from "react";

import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { message } from "antd";
import { observer } from "mobx-react-lite";
import Card from "../ui/component/Card";
import { makeAutoObservable, runInAction } from "mobx";
import { AppConfig, AppUser } from "./AppManager";
import { RPCMap } from "rpccloud-client-js/build/types";
import { delay } from "../util/util";
import Input from "../ui/component/Input";
import Plugin from "./plugin";

class Data {
    user: string;
    password: string;
    loading: boolean;

    constructor() {
        makeAutoObservable(this);
        this.user = "admin";
        this.password = "Test123456";
        this.loading = false;
    }

    setLoading(loading: boolean) {
        runInAction(() => {
            this.loading = loading;
        });
    }

    setUser(user: string) {
        runInAction(() => {
            this.user = user;
        });
    }

    setPassword(password: string) {
        runInAction(() => {
            this.password = password;
        });
    }

    reset() {
        runInAction(() => {
            this.user = "";
            this.password = "";
        });
    }
}

const data = new Data();

const Login = observer(() => {
    return (
        <div
            className="vbot-fill-viewport"
            style={{ display: "flex", flexFlow: "column" }}
        >
            <Plugin kind="header" />
            <div
                style={{ display: "flex", flex: "1 0 0", flexFlow: "row" }}
                className="vbot-container-center"
            >
                <Card
                    title="Login"
                    width={460}
                    nextName="Login"
                    canNext={!!data.user && !!data.password && !data.loading}
                    onNext={async () => {
                        try {
                            let ret = await AppUser.send(
                                8000,
                                "#.user:Login",
                                data.user,
                                data.password
                            );
                            if (ret) {
                                const userName = (ret as RPCMap).get("name");
                                const sessionID = (ret as RPCMap).get(
                                    "sessionID"
                                );
                                AppUser.setUserName(userName as string);
                                AppUser.setSessionID(sessionID as string);
                                AppConfig.get().setRootRoute("main");
                            } else {
                                message.error("Username or password error");
                                await delay(2000);
                                AppConfig.get().setRootRoute("start");
                            }
                        } catch (e) {
                            message.error((e as any).getMessage());
                            await delay(2000);
                            AppConfig.get().setRootRoute("start");
                        } finally {
                            data.reset();
                        }
                    }}
                >
                    <div style={{ height: 20 }} />
                    <Input
                        type="text"
                        size="medium"
                        defaultValue={data.user}
                        placeholder="Input Username"
                        prefixIcon={<UserOutlined />}
                        onChange={(value) => {
                            data.setUser(value);
                        }}
                    />
                    <div style={{ height: 20 }} />
                    <Input
                        type="password"
                        size="medium"
                        defaultValue={data.password}
                        placeholder="Input password"
                        prefixIcon={<LockOutlined />}
                        onChange={(value) => {
                            data.setPassword(value);
                        }}
                    />
                    <div style={{ height: 20 }} />
                </Card>
            </div>
            <Plugin kind="footer" />
        </div>
    );
});

export default Login;
