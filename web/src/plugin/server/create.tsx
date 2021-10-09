import React from "react";

import {
    AimOutlined,
    GlobalOutlined,
    UserOutlined,
    LockOutlined,
} from '@ant-design/icons';

import { message, Input } from 'antd';
import VSpacer from "../../component/VSpacer";
import { observer } from "mobx-react-lite";
import Card from "../../component/Card";
import { makeAutoObservable, runInAction } from "mobx";
import { AppUser } from "../../AppManager";
import { isValidHost, isValidPort } from "../../util/util";

class Data {
    loading: boolean
    host: string
    port: string
    user: string
    password: string
    isValidHost: boolean
    isValidPort: boolean

    constructor() {
        makeAutoObservable(this)
        this.loading = false
        this.host = ""
        this.port = "22"
        this.user = ""
        this.password = ""
        this.isValidHost = false
        this.isValidPort = true
    }

    setLoading(loading: boolean) {
        runInAction(() => {
            this.loading = loading
        })
    }


    setHost(host: string) {
        runInAction(() => {
            this.host = host
            this.isValidHost = isValidHost(this.host)
        })
    }

    setPort(port: string) {
        runInAction(() => {
            this.port = port
            this.isValidPort = isValidPort(this.port)
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
            this.loading = false
            this.host = ""
            this.port = "22"
            this.user = ""
            this.password = ""
            this.isValidHost = false
            this.isValidPort = true
        })
    }
}

const data = new Data()

interface ServerCreateProps {
    param: any,
}

const ServerCreate = observer((props: ServerCreateProps) => {
    return (
        <Card
            title="Add SSH Server"
            width={500}
            height={390}
            prevName={(!!props.param && !!props.param.goBack) ? "Cancel" : ""}
            onPrev={() => {
                if (props.param && props.param.goBack) {
                    props.param.goBack(false)
                }
            }}
            nextName="Add"
            canNext={ data.isValidPort && data.isValidHost && !!data.user && !!data.password}
            onNext={async () => {
                try {
                    await AppUser.send(
                        8000, "#.server:Create", AppUser.getSessionID(),
                        data.host, data.port, data.user, data.password,
                        "", "", false,
                    )
                    data.reset()
                    props.param.goBack(true)
                } catch(e) {
                    message.error((e as any).getMessage())
                }
            }}
        >
            <VSpacer size={12} />
            <Input
                size="large"
                placeholder="SSH Host (192.168.0.1 or www.example.com)"
                autoComplete="off"
                prefix={<GlobalOutlined className="vbot-icon-prefix" />}
                onChange={(e) => { data.setHost(e.target.value) }}
                className={data.isValidHost ? "" : "ant-input-error"}
            />
            <VSpacer size={20} />
            <Input
                size="large"
                placeholder="SSH Port (0 - 65535)"
                defaultValue={data.port}
                autoComplete="off"
                prefix={<AimOutlined className="vbot-icon-prefix" />}
                onChange={(e) => { data.setPort(e.target.value) }}
                className={data.isValidPort ? "" : "ant-input-error"}
            />
            <VSpacer size={20} />
            <Input
                size="large"
                placeholder="SSH Username"
                autoComplete="off"
                prefix={<UserOutlined className="vbot-icon-prefix" />}
                onChange={(e) => { data.setUser(e.target.value) }}
            />
            <VSpacer size={20} />
            <Input.Password
                id="password"
                size="large"
                placeholder="SSH Password"
                prefix={<LockOutlined className="vbot-icon-prefix" />}
                onChange={(e) => {  data.setPassword(e.target.value) }}
            />
        </Card>
    )
})

export default ServerCreate
