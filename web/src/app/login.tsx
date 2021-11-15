import React, { useContext } from "react";

import { observer } from "mobx-react-lite";
import { makeAutoObservable, runInAction } from "mobx";
import Plugin from "./plugin";
import { Page } from "../microui/component/Page";
import { FlexBox } from "../microui/component/FlexBox";
import { Span } from "../microui/component/Span";
import { Input } from "../microui/component/Input";

import { AiOutlineUser } from "@react-icons/all-files/ai/AiOutlineUser";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { Divider } from "../microui/component/Divider";
import { ThemeContext } from "../microui/context/theme";
import { Button } from "../microui/component/Button";
import { AppConfig } from "./AppManager";

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
    const theme = useContext(ThemeContext);
    return (
        <Page>
            <Plugin kind="header" />
            <FlexBox style={{ flex: "1 0 0", flexFlow: "row" }}>
                <FlexBox
                    animated={true}
                    alignItems="stretch"
                    style={{
                        width: 400,
                        padding: AppConfig.get().margin,
                        backgroundColor: theme.default?.backgroundLight,
                        border: `1px solid ${theme.default?.outline}`,
                        borderRadius: 10,
                    }}
                >
                    <Span text="Login" size="x-large" />
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
                    <Divider space={AppConfig.get().margin * 2} />
                    <FlexBox flexFlow="row" justifyContent="flex-end">
                        <Button text="Cancel" ghost={true} />
                        <Button
                            text="Login"
                            ghost={true}
                            style={{ marginLeft: AppConfig.get().margin }}
                        />
                    </FlexBox>
                </FlexBox>

                {/* <Card
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
                </Card> */}
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
});

export default Login;
