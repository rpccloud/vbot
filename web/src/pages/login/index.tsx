import React, { useRef } from "react";

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

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

class PageData {
    user: string
    password: string
    loading: boolean

    constructor() {
        makeAutoObservable(this)
        this.user = ""
        this.password = ""
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

const pageData = new PageData()

const CardPassword = observer(() => {
    let userRef: any = useRef(null)
    let passwordRef: any = useRef(null)

    return (
        <Card
            title="系统登陆"
            nextName="立即登陆"
            canNext={!!pageData.user && !!pageData.password && !pageData.loading}
            onNext={async () => {
                try {
                    let ret = await AppUser.send(
                        8000, "#.user:Login", pageData.user, pageData.password,
                    )
                    if (ret) {
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
                }
            }}
        >
            <VSpacer size={12} />
            <Input
                id="user"
                ref={userRef}
                size="large"
                placeholder="输入用户名"
                prefix={<UserOutlined className="vbot-icon-prefix" />}
                onChange={(e) => {
                    pageData.user = e.target.value
                }}
            />
            <VSpacer size={20} />
            <Input.Password
                id="password"
                ref={passwordRef}
                size="large"
                placeholder="确认密码"
                prefix={<LockOutlined className="vbot-icon-prefix" />}
                onChange={(e) => {
                    pageData.password = e.target.value
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
