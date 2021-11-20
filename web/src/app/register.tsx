import React, { useContext, useState } from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { passwordStrength } from "check-password-strength";
import { AppConfig, AppError, AppUser, ExtraColor } from "./AppManager";
import { Plugin } from "./plugin";
import { ThemeContext } from "../microui/context/theme";
import { FlexBox } from "../microui/component/FlexBox";
import { Divider } from "../microui/component/Divider";
import { Input } from "../microui/component/Input";
import { Button } from "../microui/component/Button";
import { Page } from "../microui/component/Page";
import { Spin } from "../microui/component/Spin";
import { Span } from "../microui/component/Span";
import { sleep } from "../microui/util";

import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";

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

const SetPassword = observer((props: { onNext: () => void }) => {
    const theme = useContext(ThemeContext);
    const minPassLength = 9;
    const password = data.password;
    const confirm = data.confirm;
    let canNext = false;

    let errors: string[] = [];

    if (password !== confirm) {
        errors.push("Password does not match");
    } else {
        const passwordInfo = passwordStrength(password);
        const hasLowerChar = passwordInfo.contains.includes("lowercase");
        const hasUpperChar = passwordInfo.contains.includes("uppercase");
        const hasNumberChar = passwordInfo.contains.includes("number");
        const lengthOK = passwordInfo.length >= minPassLength;

        if (!hasLowerChar) {
            errors.push("Password must contains lower letter");
        }

        if (!hasUpperChar) {
            errors.push("Password must contains upper letter");
        }

        if (!hasNumberChar) {
            errors.push("Password must contains upper number");
        }

        if (!lengthOK) {
            errors.push(
                `Password length must be bigger than ${minPassLength - 1}`
            );
        }

        canNext = hasLowerChar && hasUpperChar && hasNumberChar && lengthOK;
    }

    return (
        <FlexBox
            animated={true}
            style={{
                width: 400,
                height: 280,
                flexFlow: "column",
                padding: AppConfig.get().margin,
                backgroundColor: ExtraColor.appBG,
                border: `1px solid ${theme.default?.outline}`,
                borderRadius: 10,
            }}
        >
            <Span size="x-large">Set admin password</Span>
            <Divider space={AppConfig.get().margin} />
            <Input
                type="password"
                outline="underline"
                size="large"
                defaultValue={data.password}
                placeholder="Input password"
                icon={<AiOutlineLock />}
                onChange={(e) => {
                    data.setPassword(e.target.value);
                }}
            />
            <Divider space={AppConfig.get().margin} />
            <Input
                type="password"
                outline="underline"
                size="large"
                defaultValue={data.confirm}
                placeholder="Confirm password"
                icon={<AiOutlineLock />}
                onChange={(e) => {
                    data.setConfirm(e.target.value);
                }}
            />

            <Divider space={AppConfig.get().margin} />

            <FlexBox style={{ flexFlow: "column", flex: 1 }}>
                {errors.map((it) => {
                    return (
                        <Span key={it} size="medium" color={theme.failed?.main}>
                            {it}
                        </Span>
                    );
                })}
            </FlexBox>

            <FlexBox flexFlow="row" justifyContent="flex-end">
                <Button
                    text="Next"
                    disabled={!canNext}
                    ghost={true}
                    style={{ marginLeft: AppConfig.get().margin }}
                    onClick={() => props.onNext()}
                    onEnter={() => props.onNext()}
                />
            </FlexBox>
        </FlexBox>
    );
});

const TermsOfService = observer(
    (props: { onPrev: () => void; onNext: () => void }) => {
        const theme = useContext(ThemeContext);

        return (
            <FlexBox
                animated={true}
                style={{
                    width: 400,
                    height: 300,
                    flexFlow: "column",
                    padding: AppConfig.get().margin,
                    backgroundColor: ExtraColor.appBG,
                    border: `1px solid ${theme.default?.outline}`,
                    borderRadius: 10,
                }}
            >
                <Span size="x-large">Terms Of Service</Span>

                <Divider space={AppConfig.get().margin} />

                <FlexBox style={{ flex: 1, flexFlow: "column" }}>
                    <Span>TermsOfService</Span>
                </FlexBox>

                <Divider space={AppConfig.get().margin} />

                <FlexBox style={{ justifyContent: "flex-end" }}>
                    <Button
                        text="I decline"
                        ghost={true}
                        style={{ marginLeft: AppConfig.get().margin }}
                        onClick={() => props.onPrev()}
                        onEnter={() => props.onPrev()}
                    />
                    <Button
                        text="I agree"
                        ghost={true}
                        style={{ marginLeft: AppConfig.get().margin }}
                        onClick={() => props.onNext()}
                        onEnter={() => props.onNext()}
                    />
                </FlexBox>
            </FlexBox>
        );
    }
);

export const Register = observer((props: any) => {
    let [show, setShow] = useState(0);

    let inner: React.ReactNode | null = null;

    switch (show) {
        case 0:
            inner = (
                <SetPassword
                    onNext={() => {
                        setShow(1);
                    }}
                />
            );
            break;
        case 1:
            inner = (
                <TermsOfService
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
                            AppConfig.get().setRootRoute("login");
                        } catch (e) {
                            AppError.get().report((e as any).getMessage());
                            await sleep(1000);
                            AppConfig.get().setRootRoute("start");
                        } finally {
                            data.reset();
                            setShow(0);
                        }
                    }}
                />
            );
            break;
        case 2:
            inner = (
                <FlexBox
                    animated={true}
                    style={{
                        flex: "1",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spin size="x-large" />
                    <Span
                        size="x-large"
                        style={{ marginLeft: AppConfig.get().margin }}
                    >
                        Initializing ...
                    </Span>
                </FlexBox>
            );
            break;
    }

    return (
        <Page
            style={{
                background: `radial-gradient(circle farthest-side, ${ExtraColor.appBG}, ${ExtraColor.appDarkBG})`,
            }}
        >
            <Plugin kind="header" />
            <FlexBox
                style={{
                    flex: "1 0 0",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {inner}
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
});
