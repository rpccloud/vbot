import React, { useRef } from "react";

import {
    UserOutlined,
    LockOutlined,
} from '@ant-design/icons';

import { Input } from 'antd';
import Footer from "../common/Footer";
import Header from "../common/Header";
import VLayout from "../../component/VLayout";
import VSpacer from "../../component/VSpacer";
import { observer } from "mobx-react-lite";
import Card from "../../component/Card";
import { useState } from "react";

const CardPassword = observer(() => {
    let passwordRef: any = useRef(null)
    let confirmRef: any = useRef(null)
    let [next] = useState()

    return (
        <Card
            title="系统登陆"
            nextName="立即登陆"
            canNext={next}
            onNext={() => {

            }}
        >
            <VSpacer size={12} />
            <Input.Password
                ref={passwordRef}
                size="large"
                placeholder="输入用户名"
                prefix={<UserOutlined className="vbot-icon-prefix" />}
            />
            <VSpacer size={20} />
            <Input.Password
                ref={confirmRef}
                size="large"
                placeholder="确认密码"
                prefix={<LockOutlined className="vbot-icon-prefix" />}
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
                <div className="vbot-container-center">
                    <CardPassword/>
                </div>
            </VLayout.Dynamic>
            <Footer/>
        </VLayout.Container>
    )
})

export default Register
