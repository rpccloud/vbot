import React, { useState } from "react";

import { LockOutlined } from "@ant-design/icons";

import { message, Spin } from "antd";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { passwordStrength } from "check-password-strength";
import { AppData, AppUser } from "./AppManager";
import Card from "../ui/component/Card";
import { delay } from "../util/util";
import Input from "../ui/component/Input";
import Plugin from "./plugin";

class Data {
    password: string;
    confirm: string;

    constructor() {
        makeAutoObservable(this);
        this.password = "";
        this.confirm = "";
    }

    setPassword(password: string) {
        runInAction(() => {
            this.password = password;
        });
    }

    setConfirm(confirm: string) {
        runInAction(() => {
            this.confirm = confirm;
        });
    }

    reset() {
        runInAction(() => {
            this.password = "";
            this.confirm = "";
        });
    }
}

const data = new Data();

const styles = {
    carousel: {
        content: {
            color: "var(--Vbot-FontColor)",
            height: "calc(100vh - var(--Vbot-HeaderHeight) - var(--Vbot-FooterHeight))",
        },
    },
    password: {
        container: {
            marginBottom: 0,
        },
        wrong: {
            fontSize: "var(--Vbot-FontSizeSmall)",
            color: "var(--Vbot-WarningColor)",
        },
    },
};

const CardPassword = observer((props: { onNext: () => void }) => {
    const password = data.password;
    const confirm = data.confirm;
    let indicator: any = null;
    let canNext = false;

    if (password !== confirm) {
        indicator = (
            <ul style={styles.password.container}>
                <li style={styles.password.wrong}>Password does not match</li>
            </ul>
        );
    } else {
        const passwordInfo = passwordStrength(password);
        const hasLowerChar = passwordInfo.contains.includes("lowercase");
        const hasUpperChar = passwordInfo.contains.includes("uppercase");
        const hasNumberChar = passwordInfo.contains.includes("number");
        const lengthOK = passwordInfo.length > 8;
        const lowerView = hasLowerChar ? null : (
            <li style={styles.password.wrong}>
                Password must contains lower letter
            </li>
        );
        const upperView = hasUpperChar ? null : (
            <li style={styles.password.wrong}>
                Password must contains upper letter
            </li>
        );
        const numberView = hasNumberChar ? null : (
            <li style={styles.password.wrong}>
                Password must contains upper number
            </li>
        );
        const lengthView = lengthOK ? null : (
            <li style={styles.password.wrong}>
                Password length must be bigger than 8
            </li>
        );
        indicator = (
            <ul style={styles.password.container}>
                {lowerView}
                {upperView}
                {numberView}
                {lengthView}
            </ul>
        );
        canNext = hasLowerChar && hasUpperChar && hasNumberChar && lengthOK;
    }

    return (
        <Card
            title="System initialize - set admin password"
            width={420}
            height={360}
            nextName="Next"
            canNext={canNext}
            onNext={props.onNext}
        >
            <div style={{ height: 20 }} />
            <Input
                size="medium"
                type="password"
                placeholder="Input password"
                value={data.password}
                prefixIcon={<LockOutlined />}
                edit={true}
                onChange={(e) => {
                    data.setPassword(e.target.value);
                }}
            />
            <div style={{ height: 20 }} />
            <Input
                size="medium"
                type="password"
                placeholder="Confirm password"
                value={data.confirm}
                prefixIcon={<LockOutlined />}
                edit={true}
                onChange={(e) => {
                    data.setConfirm(e.target.value);
                }}
            />
            <div style={{ height: 20 }} />
            {indicator}
        </Card>
    );
});

const CardAgree = observer(
    (props: { onPrev: () => void; onNext: () => void }) => (
        <Card
            title="初始化系统 - 同意协议"
            width={420}
            height={360}
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
);

const CardWaiting = observer(() => (
    <Card title="初始化系统 - 进行中..." width={420} height={360}>
        <div className="vbot-container-center">
            <Spin size="large" />
        </div>
    </Card>
));

const Register = observer((props: any) => {
    let [show, setShow] = useState(0);

    const view0 = (
        <CardPassword
            onNext={() => {
                setShow(1);
            }}
        />
    );
    const view1 = (
        <CardAgree
            onPrev={() => {
                setShow(0);
            }}
            onNext={async () => {
                setShow(2);
                try {
                    await AppUser.send(
                        8000,
                        "#.user:Create",
                        "admin",
                        data.password
                    );
                    AppData.get().setRootRoute("login");
                } catch (e) {
                    message.error((e as any).getMessage());
                    await delay(1000);
                    AppData.get().setRootRoute("start");
                } finally {
                    data.reset();
                    setShow(0);
                }
            }}
        />
    );
    const view2 = <CardWaiting />;

    return (
        <div
            className="vbot-fill-viewport"
            style={{ display: "flex", flexFlow: "column" }}
        >
            <Plugin kind="header" />
            <div
                style={{ display: "flex", flex: "1 0 0", flexFlow: "row" }}
                className="vbot-container-center"
            >
                {[view0, view1, view2][show]}
            </div>
            <Plugin kind="footer" />
        </div>
    );
});

export default Register;
