import React from "react";

import {
    LockOutlined,
} from '@ant-design/icons';

import { Button, Carousel, Input } from 'antd';
import Footer from "../common/Footer";
import Header from "../common/Header";
import VLayout from "../../component/VLayout";
import HLayout from "../../component/HLayout";
import Divider from "../../component/Divider";
import VSpacer from "../../component/VSpacer";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { passwordStrength } from "check-password-strength";

class InitPassword {
    private password: string
    private confirm: string

    constructor() {
        makeAutoObservable(this)
        this.password = ""
        this.confirm = ""
    }

    getPassword(): string {
        return this.password
    }

    getConfirm(): string {
        return this.confirm
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

const gInitPassword = new InitPassword()

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
    const password = gInitPassword.getPassword()
    const confirm =  gInitPassword.getConfirm()
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
                defaultValue={gInitPassword.getPassword()}
                prefix={<LockOutlined className="vbot-icon-prefix" />}
                onChange={(e) => {
                    gInitPassword.setPassword(e.target.value)
                }}
            />
            <VSpacer size={20} />
            <Input.Password
                size="large"
                placeholder="确认密码"
                prefix={<LockOutlined className="vbot-icon-prefix" />}
                onChange={(e) => {
                    gInitPassword.setConfirm(e.target.value)
                }}
            />
            <VSpacer size={16} />
            {indicator}
        </Card>
    )
})

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

