import React from "react";

import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';

import  { ProFormText } from "@ant-design/pro-form";
import { Layout, Card, Carousel } from 'antd';
import Footer from "../../component/Footer";
import Header from "../../component/Header";

const styles = {
    layout: {
        minHeight: "100vh"
    },
    carousel: {
        margin: 0,
        flex: 1,
        backgroundColor: "#364d79",
    }
}

const CardUser = () => (
    <Card title="创建用户" bordered={true} className={"autoMargin"}>
        <ProFormText
            name="username"
            fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={"prefixIcon"} />,
            }}
            placeholder={"创建用户名!"}
        />
    </Card>
)

const CardPassword = () => (
    <Card title="设置密码" bordered={true} style={{ width: 360 }} className={"autoMargin"}>
        <ProFormText.Password
            name="password"
            fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={"创建密码！"}
        />
        <ProFormText.Password
            name="password"
            fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={"确认密码！"}
        />
    </Card>
)

const CarouselView = () => {
    return (
        <Carousel effect="fade" style={styles.carousel} className={"fullView"}>
            <div>
            <CardUser />
            </div>
            <div>
            <CardPassword />
            </div>
            <div>
            <h3>123234232</h3>
            </div>
        </Carousel>
    )
}

export default function Register() {
    return (
        <Layout style={styles.layout}>
            <Header/>
            <Layout.Content>
                <div style={{background: "red"}} className="fullView">
                    <CarouselView/>
                </div>
            </Layout.Content>
            <Footer/>
        </Layout>
    )
}

