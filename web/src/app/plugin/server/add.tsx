import React from "react";
import { PluginProps } from "..";
import { Divider } from "../../../microui/component/Divider";
import { FlexBox } from "../../../microui/component/FlexBox";
import { Input } from "../../../microui/component/Input";
import { Span } from "../../../microui/component/Span";
import { Theme, ThemeContext } from "../../../microui/context/theme";
import { AppConfig, AppError, AppUser, ExtraColor } from "../../AppManager";

import { AiOutlineGlobal } from "@react-icons/all-files/ai/AiOutlineGlobal";
import { AiOutlineAim } from "@react-icons/all-files/ai/AiOutlineAim";
import { AiOutlineUser } from "@react-icons/all-files/ai/AiOutlineUser";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { AiOutlinePaperClip } from "@react-icons/all-files/ai/AiOutlinePaperClip";
import { isValidHost } from "../../../microui/validator/host";
import { isValidPort } from "../../../microui/validator/port";
import { Button } from "../../../microui/component/Button";
import { Spin } from "../../../microui/component/Spin";

interface ServerAddState {
    loading: boolean;
    host: string;
    port: string;
    user: string;
    password: string;
    alias: string;
}

export class ServerAdd extends React.Component<PluginProps, ServerAddState> {
    static contextType = ThemeContext;
    private loading: boolean;

    constructor(props: PluginProps) {
        super(props);
        this.loading = false;
        this.state = {
            loading: false,
            host: "",
            port: "22",
            user: "",
            password: "",
            alias: "",
        };
    }

    private setLoading(loading: boolean) {
        if (this.loading !== loading) {
            this.loading = loading;
            this.setState({ loading: loading });
        }
    }

    private goBack = () => {
        if (this.props.data && this.props.data.goBack) {
            this.props.data.goBack(false);
        }
    };

    private addServer = () => {
        if (this.loading === false) {
            this.setLoading(true);

            AppUser.send(
                8000,
                "#.server:Create",
                AppUser.getSessionID(),
                this.state.host,
                this.state.port,
                this.state.user,
                this.state.password,
                this.state.alias,
                "",
                false
            )
                .then((v) => {
                    this.setState({
                        host: "",
                        port: "22",
                        user: "",
                        password: "",
                        alias: "",
                    });
                    this.goBack();
                })
                .catch((e) => {
                    AppError.get().report((e as any).getMessage());
                    this.setLoading(false);
                })
                .finally(() => {});
        }
    };

    render() {
        const theme: Theme = this.context;
        const hostOK = isValidHost(this.state.host);
        const portOK = isValidPort(this.state.port);
        const userOK = this.state.user.length > 0;
        const passOK = this.state.password.length > 0;
        return this.state.loading ? (
            <FlexBox
                animated={true}
                style={{
                    flex: "1",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Spin size="x-large" />
                <Span
                    size="x-large"
                    style={{ marginLeft: AppConfig.get().margin }}
                >
                    Loading ...
                </Span>
            </FlexBox>
        ) : (
            <FlexBox
                animated={true}
                style={{
                    width: 400,
                    flexFlow: "column",
                    padding: AppConfig.get().margin,
                    backgroundColor: ExtraColor.appBG,
                    border: `1px solid ${theme.default?.outline}`,
                    borderRadius: 10,
                }}
            >
                <Span size="x-large">Add Server</Span>
                <Divider space={16} />
                <Input
                    type="text"
                    outline="underline"
                    size="large"
                    label="Host:"
                    labelWidth={80}
                    defaultValue={this.state.host}
                    placeholder="SSH host (IP or hostname)"
                    icon={<AiOutlineGlobal />}
                    onChange={(e) => {
                        this.setState({ host: e.target.value });
                    }}
                    valid={hostOK}
                />
                <Divider space={16} />
                <Input
                    type="text"
                    outline="underline"
                    size="large"
                    label="Port:"
                    labelWidth={80}
                    defaultValue={this.state.port}
                    placeholder="SSH port (0 - 65535)"
                    icon={<AiOutlineAim />}
                    onChange={(e) => {
                        this.setState({ port: e.target.value });
                    }}
                    valid={portOK}
                />
                <Divider space={16} />
                <Input
                    type="text"
                    outline="underline"
                    size="large"
                    label="Username:"
                    labelWidth={80}
                    defaultValue={this.state.user}
                    placeholder="SSH username"
                    icon={<AiOutlineUser />}
                    onChange={(e) => {
                        this.setState({ user: e.target.value });
                    }}
                    valid={userOK}
                />
                <Divider space={16} />
                <Input
                    type="password"
                    outline="underline"
                    size="large"
                    label="Password:"
                    labelWidth={80}
                    defaultValue={this.state.password}
                    placeholder="SSH password"
                    icon={<AiOutlineLock />}
                    onChange={(e) => {
                        this.setState({ password: e.target.value });
                    }}
                    valid={passOK}
                />
                <Divider space={16} />
                <Input
                    type="text"
                    outline="underline"
                    size="large"
                    label="Alias:"
                    labelWidth={80}
                    defaultValue={this.state.alias}
                    icon={<AiOutlinePaperClip />}
                    onChange={(e) => {
                        this.setState({ alias: e.target.value });
                    }}
                />

                <Divider space={24} />

                <FlexBox flexFlow="row" justifyContent="flex-end">
                    <Button
                        text="Cancel"
                        ghost={true}
                        style={{ marginRight: 16, width: 50 }}
                        onClick={this.goBack}
                        onEnter={this.goBack}
                    />
                    <Button
                        text="Add"
                        disabled={!hostOK || !portOK || !userOK || !passOK}
                        ghost={true}
                        style={{ width: 50 }}
                        onClick={this.addServer}
                        onEnter={this.addServer}
                    />
                </FlexBox>
            </FlexBox>
        );
    }
}
