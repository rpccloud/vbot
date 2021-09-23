import React from "react";

import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';

import  { ProFormText } from "@ant-design/pro-form";
import { Layout } from 'antd';

export default function Register() {
    return (
        <Layout>
            <Layout.Header>
                <div> Vbot</div>
            </Layout.Header>
            <Layout.Content>
                <div> Content </div>
                {/* <ProFormText
                    name="username"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={"prefixIcon"} />,
                    }}
                    placeholder={"请输入用户名!"}
                />
                <ProFormText.Password
                    name="password"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={"prefixIcon"} />,
                    }}
                    placeholder={"请输入密码！"}
                /> */}
            </Layout.Content>
            <Layout.Footer>
                Vbot rpccloud.com ©2021 Created by tianshuo
            </Layout.Footer>
        </Layout>
    )
}

