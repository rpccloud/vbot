import React from "react";

import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';

import  { ProFormText } from "@ant-design/pro-form";
import { Card, Carousel } from 'antd';
import Footer from "../../component/Footer";
import Header from "../../component/Header";
import VLayout from "../../component/VLayout";
import Page from "../../component/Page";

const styles = {
    card: {
        width: 400,
        height: 360,
        margin: 100
    },
    carousel: {
        width:"100%",
        height:"100%",
        backgroundColor: "var(--PrimaryColor)",
    }
}

const CardUser = () => (
    <Card title="创建用户" bordered={true} style={styles.card}>
        <ProFormText
            name="username"
            fieldProps={{
                size: 'large',
                prefix: <UserOutlined className="vbot-icon-prefix" />,
            }}
            placeholder={"创建用户名!"}
        />
    </Card>
)

const CardPassword = () => (
    <Card title="设置密码" bordered={true} style={styles.card}>
        <ProFormText.Password
            name="password"
            fieldProps={{
                size: 'large',
                prefix: <LockOutlined className="vbot-icon-prefix" />,
            }}
            placeholder={"创建密码！"}
        />
        <ProFormText.Password
            name="password"
            fieldProps={{
                size: 'large',
                prefix: <LockOutlined className="vbot-icon-prefix" />,
            }}
            placeholder={"确认密码！"}
        />
    </Card>
)

const CardAgree = () => (
    <Card title="同意协议" bordered={true} style={styles.card}>
        <div>用户协议内容</div>
    </Card>
)

const CarouselView = () => {
    return (
        <Carousel effect="fade" style={styles.carousel}>
            <div className="vbot-center-container">
                <CardUser />
            </div>
            <div className="vbot-center-container">
                <CardPassword />
            </div>
            <div className="vbot-center-container">
                <CardAgree />
            </div>
        </Carousel>
    )
}

export default function Register() {
    return (
        <Page>
            <VLayout.Container>
                <Header/>
                <VLayout.Dynamic className="vbot-need-ant-carousel-auto-fill">
                    <CarouselView/>
                </VLayout.Dynamic>
                <Footer/>
            </VLayout.Container>
        </Page>

    )
}

