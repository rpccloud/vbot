import React from "react";

import {
    MessageOutlined,
    IdcardOutlined,
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
import Divider from "../../component/Divider";

class Data {
    loading: boolean
    host: string
    port: string
    user: string
    password: string
    name: string
    comment: string

    isValidHost: boolean
    isValidPort: boolean

    constructor() {
        makeAutoObservable(this)
        this.loading = false
        this.host = ""
        this.port = "22"
        this.user = ""
        this.password = ""
        this.name = ""
        this.comment = ""
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

    setName(name: string) {
        runInAction(() => {
            this.name = name
        })
    }

    setComment(comment: string) {
        runInAction(() => {
            this.comment = comment
        })
    }

    reset() {
        runInAction(() => {
            this.loading = false
            this.host = ""
            this.port = "22"
            this.user = ""
            this.password = ""
            this.name = ""
            this.comment = ""
            this.isValidHost = false
            this.isValidPort = true
        })
    }
}

const data = new Data()

interface ServerEditProps {
    param: any,
}

const ServerEdit = observer((props: ServerEditProps) => {
    return (
        <Card
            title="Add SSH Server"
            width={600}
            height={540}
            prevName={(!!props.param && !!props.param.goBack) ? "Cancel" : ""}
            onPrev={() => {
                if (props.param && props.param.goBack) {
                    props.param.goBack()
                }
            }}
            nextName="Add"
            canNext={ data.isValidPort && data.isValidHost && !!data.user && !!data.password}
            onNext={async () => {
                try {
                    await AppUser.send(
                        8000, "#.server:Edit", AppUser.getSessionID(),
                        data.host, data.port, data.user, data.password,
                        data.name, data.comment, false,
                    )
                } catch(e) {
                    message.error((e as any).getMessage())
                } finally {
                    if (props.param && props.param.goBack) {
                        props.param.goBack()
                    }
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
            <VSpacer size={26} />
            <Divider style={{height: 1, width: "100%", margin:0, backgroundColor: "var(--Vbot-DividerColor)"}}/>
            <VSpacer size={26} />
            <Input
                size="large"
                placeholder="Name (optional)"
                autoComplete="off"
                prefix={<IdcardOutlined className="vbot-icon-prefix" />}
                onChange={(e) => {  data.setName(e.target.value) }}
            />
            <VSpacer size={20} />
            <Input
                size="large"
                placeholder="Comment (optional)"
                autoComplete="off"
                prefix={<MessageOutlined className="vbot-icon-prefix" />}
                onChange={(e) => {  data.setComment(e.target.value) }}
            />
        </Card>
    )
})

export default ServerEdit
