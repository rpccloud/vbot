import React, { useRef } from "react";

import {
    LockOutlined,
} from '@ant-design/icons';

import { message, Carousel, Input, Spin } from 'antd';
import Footer from "../common/Footer";
import Header from "../common/Header";
import VLayout from "../../component/VLayout";
import VSpacer from "../../component/VSpacer";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { passwordStrength } from "check-password-strength";
import { AppData, AppUser } from "../../AppManager";
import Card from "../../component/Card";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

class PageData {
    password: string
    confirm: string

    constructor() {
        makeAutoObservable(this)
        this.password = ""
        this.confirm = ""
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

    reset() {
        runInAction(() => {
            this.password = ""
            this.confirm = ""
        })
    }
}

const pageData = new PageData()

const styles = {
    carousel: {
        container: {
            width:"100%",
            height:"100%",
            backgroundColor: "var(--PrimaryBGColor)",
        },
        content: {
            height: "calc(100vh - var(--VbotHeaderHeight) - var(--VbotFooterHeight))"
        }
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

const CardPassword = observer((props: {onNext: () => void}) => {
    const password = pageData.password
    const confirm =  pageData.confirm
    let indicator: any = null
    let canNext = false

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
        >
            <VSpacer size={12} />
            <Input.Password
                size="large"
                placeholder="输入密码"
                defaultValue={pageData.password}
                prefix={<LockOutlined className="vbot-icon-prefix" />}
                onChange={(e) => {
                    pageData.password = e.target.value
                }}
            />
            <VSpacer size={20} />
            <Input.Password
                size="large"
                placeholder="确认密码"
                defaultValue={pageData.confirm}
                prefix={<LockOutlined className="vbot-icon-prefix" />}
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
        canPrev={true}
        canNext={true}
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
    const carouselRef: any = useRef(null);
    return (
        <VLayout.Container className="vbot-fill-viewport">
            <Header/>
            <VLayout.Dynamic className="vbot-need-ant-carousel-auto-fill">
                <Carousel
                    ref={carouselRef}
                    className={"vbot-need-ant-carousel-auto-fill"}
                    dots={false}
                    effect="fade"
                    style={styles.carousel.container}
                >
                    <div>
                        <div style={styles.carousel.content} className="vbot-container-center">
                            <CardPassword
                                onNext={() => {
                                    carouselRef.current.goTo(1)
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <div style={styles.carousel.content} className="vbot-container-center">
                            <CardAgree
                                onPrev={() => {
                                    carouselRef.current.goTo(0)
                                }}
                                onNext={async () => {
                                    carouselRef.current.goTo(2)
                                    try {
                                        await AppUser.send(8000, "#.user:Create", "admin", pageData.password)
                                        carouselRef.current.goTo(0)
                                        AppData.get().setRootRoute("login")
                                    } catch(e) {
                                        message.error((e as any).getMessage())
                                        await delay(1000)
                                        carouselRef.current.goTo(0)
                                        AppData.get().setRootRoute("start")
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <div style={styles.carousel.content} className="vbot-container-center">
                            <CardWaiting />
                        </div>
                    </div>
                </Carousel>
            </VLayout.Dynamic>
            <Footer/>
        </VLayout.Container>
    )
})

export default Register
