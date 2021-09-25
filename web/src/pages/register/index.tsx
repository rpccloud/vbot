import React from "react";

import {
    LockOutlined,
} from '@ant-design/icons';

import  { ProFormText } from "@ant-design/pro-form";
import { Button, Carousel } from 'antd';
import Footer from "../common/Footer";
import Header from "../common/Header";
import VLayout from "../../component/VLayout";
import HLayout from "../../component/HLayout";
import Divider from "../../component/Divider";
import VSpacer from "../../component/VSpacer";

const styles = {
    card: {
        title: {
            fontSize: "var(--FontSizeLarge)"
        },
        container: {
            width: 420,
            height: 380,
            margin: 120,
            background: "var(--PrimaryBGColorLighten)",
            padding: "16px 24px 16px 24px",
        },
        button: {
            marginRight: 8,
        },
        divider: {
            width: "100%",
            height: 1,
            backgroundColor: "var(--PrimaryBGColorDarken)",
            marginTop: 8,
            marginBottom: 16,
        },
    },
    carousel: {
        width:"100%",
        height:"100%",
        backgroundColor: "var(--PrimaryBGColor)",
    }
}

interface CardProps {
    title: string,
    prevName?: string,
    nextName?: string,
    canPrev?: boolean,
    canNext?: boolean,
    onPrev?: () => void,
    onNext?: () => void,
    children: any,
}

const Card = (props: CardProps) => {
    const buttonPrev = props.prevName ? (
        <Button
            type="primary"
            ghost={true}
            disabled={props.canPrev === false}
            onClick={props.onPrev}
            style={styles.card.button}
        >
            {props.prevName}
        </Button>
    ) : null

    const buttonNext = props.nextName ? (
        <Button
            type="primary"
            ghost={true}
            disabled={props.canNext === false}
            onClick={props.onNext}
        >
            {props.nextName}
        </Button>
    ): null

    return (
        <div style={styles.card.container} className="vbot-container-round vbot-container-shadow">
            <VLayout.Container>
                <VLayout.Fixed>
                    <div style={styles.card.title}>
                        {props.title}
                    </div>
                </VLayout.Fixed>
                <Divider style={styles.card.divider} />
                <VLayout.Dynamic>
                    {props.children}
                </VLayout.Dynamic>
                <Divider style={styles.card.divider} />
                <VLayout.Fixed>
                    <HLayout.Container>
                        <HLayout.Dynamic />
                        {buttonPrev}
                        {buttonNext}
                    </HLayout.Container>
                </VLayout.Fixed>
            </VLayout.Container>
        </div>
    )
}

const CardPassword = (props: {onNext: () => void}) => (
    <Card
        title="初始化系统 - 设置admin密码"
        nextName="下一步"
        canNext={false}
        onNext={props.onNext}
    >
        <VSpacer size={9} />
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
    <Card
        title="同意协议"
        prevName="上一步"
        nextName="同意并初始化"
        canPrev={true}
        canNext={true}
        onPrev={props.onPrev}
        onNext={props.onNext}
    >
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
            <VLayout.Container className="vbot-fill-viewport">
                <Header/>
                <VLayout.Dynamic className="vbot-need-ant-carousel-auto-fill">
                    <Carousel ref={this.refCarousel} effect="scrollx" style={styles.carousel}>
                        <div className="vbot-container-center">
                            <CardPassword onNext={() => {
                                this.refCarousel.current.next()
                                }} />
                        </div>
                        <div className="vbot-container-center">
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
        )
    }
}

export default Register

