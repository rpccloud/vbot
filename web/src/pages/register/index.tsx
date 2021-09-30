import React, { useRef } from "react";

import {
    LockOutlined,
} from '@ant-design/icons';

import { useHistory } from "react-router-dom";

import { Button, Carousel, Input, Spin } from 'antd';
import Footer from "../common/Footer";
import Header from "../common/Header";
import VLayout from "../../component/VLayout";
import HLayout from "../../component/HLayout";
import Divider from "../../component/Divider";
import VSpacer from "../../component/VSpacer";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { passwordStrength } from "check-password-strength";
import { AppClient } from "../../AppManager";

class PageData {
    password: string
    confirm: string
    busy: boolean

    constructor() {
        makeAutoObservable(this)
        this.password = ""
        this.confirm = ""
        this.busy = false
    }

    setPassword(password: string) {
        runInAction(() => {
            this.password = password
        })
    }

    setConfirm(confirm: string) {
        runInAction(() => {
            this.confirm = confirm
        })
    }

    async sendInitRequest() {
        let ok = false

        runInAction(() => {
            this.busy = true
        })

        try {
            ok = !! await AppClient.get().send(8000, "#.user:create", "ts", "pass")
        } catch(e) {
            ok = false
        }

        runInAction(() => {
            this.busy = false
        })

        return ok
    }

    reset() {
        runInAction(() => {
            this.password = ""
            this.confirm = ""
            this.busy = false
        })
    }
}

const pageData = new PageData()

const styles = {
    card: {
        title: {
            marginTop: 6,
            fontSize: "var(--FontSizeLarge)",
        },
        container: {
            width: 420,
            height: 360,
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
            marginBottom: 8,
        },
    },
    carousel: {
        width:"100%",
        height:"100%",
        backgroundColor: "var(--PrimaryBGColor)",
    },
    password: {
        container: {
            marginBottom: 0,
        },
        wrong: {
            fontSize: "var(--FontSizeSmall)",
            color: "var(--WarnColor)",
        },
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
    onKeyDown?: (e: any) => void,
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
        <div
            className="vbot-container-round vbot-container-shadow"
            style={styles.card.container}
            onKeyDown={props.onKeyDown}
        >
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
                <VSpacer size={4} />
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

const CardPassword = observer((props: {onNext: () => void}) => {
    let passwordRef: any = useRef(null)
    let confirmRef: any = useRef(null)
    const password = pageData.password
    const confirm =  pageData.confirm
    let indicator: any = null
    let canNext = false
    let focusInput: any = null

    if (password !== confirm) {
        indicator = (
            <ul style={styles.password.container}>
                <li style={styles.password.wrong}>密码不一致</li>
            </ul>
        )
    } else {
        const passwordInfo = passwordStrength(password)
        const hasLowerChar = passwordInfo.contains.includes("lowercase")
        const hasUpperChar = passwordInfo.contains.includes("uppercase")
        const hasNumberChar = passwordInfo.contains.includes("number")
        const lengthOK = passwordInfo.length > 8
        const lowerView =  hasLowerChar ? null :
            <li style={styles.password.wrong}>密码必须包含小写字母</li>
        const upperView = hasUpperChar ? null:
            <li style={styles.password.wrong}>密码必须包含大写字母</li>
        const numberView = hasNumberChar ? null:
            <li style={styles.password.wrong}>密码必须包含数字</li>
        const lengthView = lengthOK ? null :
            <li style={styles.password.wrong}>密码长度必须大于8</li>
        indicator = (
            <ul style={styles.password.container}>
                {lowerView}
                {upperView}
                {numberView}
                {lengthView}
            </ul>
        )
        canNext = hasLowerChar && hasUpperChar && hasNumberChar && lengthOK
    }

    return (
        <Card
            title="初始化系统 - 设置admin密码"
            nextName="下一步"
            canNext={canNext}
            onNext={props.onNext}
            onKeyDown={(e: any) => {
                if (e.key === "Tab") {
                    e.preventDefault()
                    if (focusInput === passwordRef) {
                        confirmRef.current.focus()
                    } else {
                        passwordRef.current.focus()
                    }
                }
            }}
        >
            <VSpacer size={12} />
            <Input.Password
                ref={passwordRef}
                size="large"
                placeholder="输入密码"
                defaultValue={pageData.password}
                prefix={<LockOutlined className="vbot-icon-prefix" />}
                onFocus={() => {focusInput = passwordRef}}
                onChange={(e) => {
                    pageData.password = e.target.value
                }}
            />
            <VSpacer size={20} />
            <Input.Password
                ref={confirmRef}
                size="large"
                placeholder="确认密码"
                defaultValue={pageData.confirm}
                prefix={<LockOutlined className="vbot-icon-prefix" />}
                onFocus={() => {focusInput = confirmRef}}
                onChange={(e) => {
                    pageData.confirm = e.target.value
                }}
            />
            <VSpacer size={16} />
            {indicator}
        </Card>
    )
})

const CardAgree = observer((props: {onPrev: () => void, onNext: () => void}) => (
    <Card
        title="初始化系统 - 同意协议"
        prevName="上一步"
        nextName="同意并初始化"
        canPrev={!pageData.busy}
        canNext={!pageData.busy}
        onPrev={props.onPrev}
        onNext={props.onNext}
    >
        <div>用户协议内容</div>
    </Card>
))

const CardWaiting = observer(() => (
    <Card title="初始化系统 - 进行中...">
        <div className="vbot-fill-auto vbot-container-center">
         <Spin size="large" />
        </div>
    </Card>
))

const Register = observer((props: any) => {
    let history = useHistory();
    const carouselRef: any = useRef(null);
    return (
        <VLayout.Container className="vbot-fill-viewport">
            <Header/>
            <VLayout.Dynamic className="vbot-need-ant-carousel-auto-fill">
                <Carousel
                    ref={carouselRef}
                    dots={false}
                    effect="scrollx"
                    style={styles.carousel}
                    beforeChange={() => {return false}}
                >
                    <div className="vbot-container-center">
                        <CardPassword onNext={() => {
                            carouselRef.current.goTo(1)
                        }} />
                    </div>
                    <div className="vbot-container-center">
                        <CardAgree
                            onPrev={() => {
                                carouselRef.current.goTo(0)
                            }}
                            onNext={async () => {
                                carouselRef.current.goTo(2)
                                try {
                                    await pageData.sendInitRequest()
                                    history.push("/login")
                                } catch(e) {
                                    carouselRef.current.goTo(0)
                                }
                            }}/>
                    </div>
                    <div className="vbot-container-center">
                        <CardWaiting />
                    </div>
                </Carousel>
            </VLayout.Dynamic>
            <Footer/>
        </VLayout.Container>
    )
})

export default Register
