import React from "react";

import {
    AimOutlined,
    GlobalOutlined,
    UserOutlined,
    LockOutlined,
} from '@ant-design/icons';

import { message } from 'antd';
import { observer } from "mobx-react-lite";
import Card from "../../../ui/component/Card";
import { makeAutoObservable, runInAction } from "mobx";
import { AppUser } from "../../AppManager";
import { isValidHost, isValidPort } from "../../../util/util";
import Input from "../../../ui/component/Input";
import { PluginProps } from "..";

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

const ServerCreate = observer((props: PluginProps) => {
    return (
        <Card
            title="Add SSH Server"
            width={460}
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
            <div style={{height:20}} />
            <Input
                type="text"
                size="medium"
                placeholder="SSH Host (192.168.0.1 or www.example.com)"
                edit={true}
                value={data.host}
                prefixIcon={<GlobalOutlined/>}
                onChange={(e) => { data.setHost(e.target.value); } }
                validator={() => data.isValidHost}
            />
            <div style={{height:20}} />
            <Input
                type="text"
                size="medium"
                placeholder="SSH Port (0 - 65535)"
                edit={true}
                value={data.port}
                prefixIcon={<AimOutlined/>}
                onChange={(e) => { data.setPort(e.target.value) }}
                validator={() => data.isValidPort}
            />
            <div style={{height:20}} />
            <Input
                type="text"
                size="medium"
                placeholder="SSH Username"
                edit={true}
                value={data.user}
                prefixIcon={<UserOutlined/>}
                onChange={(e) => { data.setUser(e.target.value) }}
                validator={(v) => v !== ""}
            />
            <div style={{height:20}} />
            <Input
                type="password"
                size="medium"
                placeholder="SSH Password"
                edit={true}
                value={data.password}
                prefixIcon={<LockOutlined/>}
                onChange={(e) => {  data.setPassword(e.target.value) }}
                validator={(v) => v !== ""}
            />
            <div style={{height:20}} />
        </Card>
    )
})

export default ServerCreate