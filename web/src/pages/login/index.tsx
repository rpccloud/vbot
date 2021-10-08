import React from "react";

import {
    UserOutlined,
    LockOutlined,
} from '@ant-design/icons';

import { message, Input } from 'antd';
import Footer from "../common/Footer";
import Header from "../common/Header";
import VLayout from "../../component/VLayout";
import VSpacer from "../../component/VSpacer";
import { observer } from "mobx-react-lite";
import Card from "../../component/Card";
import { makeAutoObservable, runInAction } from "mobx";
import { AppData, AppUser } from "../../AppManager";
import { RPCMap } from "rpccloud-client-js/build/types";
import { delay } from "../../util/util";

class Data {
    user: string
    password: string
    loading: boolean

    constructor() {
        makeAutoObservable(this)
        this.user = "admin"
        this.password = "Test123456"
        this.loading = false
    }

    setLoading(loading: boolean) {
        runInAction(() => {
            this.loading = loading
        })
    }

    setUser(user: string) {
        runInAction(() => {
            this.user = user
        })
    }

    setPassword(password: string) {
        runInAction(() => {
            this.password = password
        })
    }

    reset() {
        runInAction(() => {
            this.user = ""
            this.password = ""
        })
    }
}

const data = new Data()

const CardPassword = observer(() => {
    return (
        <Card
            title="系统登陆"
            width={420}
            height={360}
            nextName="立即登陆"
            canNext={!!data.user && !!data.password && !data.loading}
            onNext={async () => {
                try {
                    let ret = await AppUser.send(
                        8000, "#.user:Login", data.user, data.password,
                    )
                    if (ret) {
                        const userName = (ret as RPCMap).get("name")
                        const sessionID = (ret as RPCMap).get("sessionID")
                        AppUser.setUserName(userName as string)
                        AppUser.setSessionID(sessionID as string)
                        AppData.get().setRootRoute("main")
                    } else {
                        message.error("用户名或密码不正确")
                        await delay(2000)
                        AppData.get().setRootRoute("start")
                    }
                } catch(e) {
                    message.error((e as any).getMessage())
                    await delay(2000)
                    AppData.get().setRootRoute("start")
                } finally {
                    data.reset()
                }
            }}
        >
            <VSpacer size={12} />
            <Input
                id="user"
                size="large"
                placeholder="输入用户名"
                autoComplete="off"
                prefix={<UserOutlined className="vbot-icon-prefix" />}
                onChange={(e) => {
                    data.setUser(e.target.value)
                }}
            />
            <VSpacer size={20} />
            <Input.Password
                id="password"
                size="large"
                placeholder="确认密码"
                prefix={<LockOutlined className="vbot-icon-prefix" />}
                onChange={(e) => {
                    data.setPassword(e.target.value)
                }}
            />
            <VSpacer size={16} />
        </Card>
    )
})

const Register = observer(() => {
    return (
        <VLayout.Container className="vbot-fill-viewport">
            <Header/>
            <VLayout.Dynamic>
                <div className="vbot-fill-auto vbot-container-center">
                    <CardPassword/>
                </div>
            </VLayout.Dynamic>
            <Footer/>
        </VLayout.Container>
    )
})

export default Register
