import React from "react";

import {
    LockOutlined,
} from '@ant-design/icons';

import  { ProFormText } from "@ant-design/pro-form";
import { Button, Carousel } from 'antd';
import Footer from "../../component/Footer";
import Header from "../../component/Header";
import VLayout from "../../component/VLayout";
import Page from "../../component/Page";
import HLayout from "../../component/HLayout";
import Divider from "../../component/Divider";

const styles = {
    card: {
        width: 420,
        height: 380,
        margin: 100,
        background: "white",
        padding: 20,
    },
    carousel: {
        width:"100%",
        height:"100%",
        backgroundColor: "var(--PrimaryColor)",
    }
}

interface CardProps {
    title: string,
    message?: string,
    prevName?: string,
    nextName?: string,
    canPrev: boolean,
    canNext: boolean,
    onPrev?: () => void,
    onNext?: () => void,
    children: any,
}

const Card = (props: CardProps) => (
    <div style={styles.card}>
        <VLayout.Container>
            <VLayout.Fixed>
                <div style={{fontSize: "var(--FontSizeLarge)"}}>{props.title}</div>
            </VLayout.Fixed>
            <Divider size="1" top="16" bottom="16"  color="var(--PrimaryBGColorDarken)" />
            <VLayout.Dynamic>
                {props.children}
            </VLayout.Dynamic>
            <Divider size="1" top="16" bottom="16" color="var(--PrimaryBGColorDarken)"/>
            <VLayout.Fixed>
                <HLayout.Container>
                    <HLayout.Dynamic />
                    {props.canPrev ? <Button type="primary" onClick={props.onPrev} style={{marginRight: 8}}>{props.prevName}</Button> : null }
                    {props.canNext ? <Button type="primary" onClick={props.onNext}>{props.nextName}</Button> : null}
                </HLayout.Container>
            </VLayout.Fixed>
        </VLayout.Container>
    </div>
)

const CardPassword = (props: {onNext: () => void}) => (
    <Card title="初始化admin密码" nextName="下一步" canPrev={false} canNext={true} onNext={props.onNext}>
        <ProFormText.Password
            name="password"
            fieldProps={{
                size: 'large',
                prefix: <LockOutlined className="vbot-icon-prefix" />,
            }}
            placeholder={"输入admin密码"}
        />
        <ProFormText.Password
            name="password"
            fieldProps={{
                size: 'large',
                prefix: <LockOutlined className="vbot-icon-prefix" />,
            }}
            placeholder={"确认密码"}
        />
    </Card>
)

const CardAgree = (props: {onPrev: () => void, onNext: () => void}) => (
    <Card title="同意协议" prevName="上一步" nextName="同意并初始化" canPrev={true} canNext={true} onPrev={props.onPrev} onNext={props.onNext}>
        <div>用户协议内容</div>
    </Card>
)

class Register extends React.Component {
    private refCarousel: any

    constructor(props: {}) {
      super(props);
      this.refCarousel = React.createRef();
    }

    render() {
        return (
            <Page>
                <VLayout.Container>
                    <Header/>
                    <VLayout.Dynamic className="vbot-need-ant-carousel-auto-fill">
                        <Carousel ref={this.refCarousel} effect="fade" style={styles.carousel}>
                            <div className="vbot-center-container">
                                <CardPassword onNext={() => {
                                    this.refCarousel.current.next()
                                    }} />
                            </div>
                            <div className="vbot-center-container">
                                <CardAgree
                                    onPrev={() => {
                                        this.refCarousel.current.prev()
                                    }}
                                    onNext={() => {alert("ok")}}/>
                            </div>
                        </Carousel>
                    </VLayout.Dynamic>
                    <Footer/>
                </VLayout.Container>
            </Page>
        )
    }
}

export default Register

