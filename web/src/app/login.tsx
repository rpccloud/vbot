import React, { useContext } from "react";

import { observer } from "mobx-react-lite";
import { makeAutoObservable, runInAction } from "mobx";
import { Plugin } from "./plugin";
import { Page } from "../microui/component/Page";
import { FlexBox } from "../microui/component/FlexBox";
import { Span } from "../microui/component/Span";
import { Input } from "../microui/component/Input";

import { AiOutlineUser } from "@react-icons/all-files/ai/AiOutlineUser";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { Divider } from "../microui/component/Divider";
import { ThemeContext } from "../microui/context/theme";
import { Button } from "../microui/component/Button";
import { AppConfig, AppError, AppUser } from "./AppManager";
import { RPCMap } from "rpccloud-client-js/build/types";
import { sleep } from "../microui/util";

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

export const Login = observer(() => {
    const theme = useContext(ThemeContext);
    return (
        <Page>
            <Plugin kind="header" />
            <FlexBox
                style={{
                    flex: "1 0 0",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <FlexBox
                    animated={true}
                    style={{
                        width: 400,
                        flexFlow: "column",
                        padding: AppConfig.get().margin,
                        backgroundColor: theme.default?.backgroundLight,
                        border: `1px solid ${theme.default?.outline}`,
                        borderRadius: 10,
                    }}
                >
                    <Span size="x-large">Login</Span>
                    <Divider space={AppConfig.get().margin} />
                    <Input
                        type="text"
                        outline="underline"
                        size="large"
                        defaultValue={data.user}
                        placeholder="Input username"
                        icon={<AiOutlineUser />}
                        onChange={(e) => {
                            data.setUser(e.target.value);
                        }}
                    />
                    <Divider space={AppConfig.get().margin} />
                    <Input
                        type="password"
                        outline="underline"
                        size="large"
                        defaultValue={data.password}
                        placeholder="Input password"
                        icon={<AiOutlineLock />}
                        onChange={(e) => {
                            data.setPassword(e.target.value);
                        }}
                    />
                    <Divider space={AppConfig.get().margin} />
                    <FlexBox flexFlow="row" justifyContent="flex-end">
                        <Button
                            text="Login"
                            disabled={
                                !data.user || !data.password || data.loading
                            }
                            ghost={true}
                            style={{ marginLeft: AppConfig.get().margin }}
                            onClick={async () => {
                                try {
                                    let ret = await AppUser.send(
                                        8000,
                                        "#.user:Login",
                                        data.user,
                                        data.password
                                    );
                                    if (ret) {
                                        const userName = (ret as RPCMap).get(
                                            "name"
                                        );
                                        const sessionID = (ret as RPCMap).get(
                                            "sessionID"
                                        );
                                        AppUser.setUserName(userName as string);
                                        AppUser.setSessionID(
                                            sessionID as string
                                        );
                                        AppConfig.get().setRootRoute("main");
                                    } else {
                                        AppError.get().report(
                                            "Username or password error"
                                        );
                                        await sleep(2000);
                                        AppConfig.get().setRootRoute("start");
                                    }
                                } catch (e) {
                                    AppError.get().report(
                                        (e as any).getMessage()
                                    );
                                    await sleep(2000);
                                    AppConfig.get().setRootRoute("start");
                                } finally {
                                    data.reset();
                                }
                            }}
                        />
                    </FlexBox>
                </FlexBox>
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
});
