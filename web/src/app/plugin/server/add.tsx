import React from "react";
import { PluginProps } from "..";
import { Divider } from "../../../microui/component/Divider";
import { FlexBox } from "../../../microui/component/FlexBox";
import { Input } from "../../../microui/component/Input";
import { Span } from "../../../microui/component/Span";
import { Theme, ThemeContext } from "../../../microui/context/theme";
import { AppConfig, ExtraColor } from "../../AppManager";

// import { AiOutlineGlobal } from "@react-icons/all-files/ai/AiOutlineGlobal";
// import { AiOutlineAim } from "@react-icons/all-files/ai/AiOutlineAim";
// import { AiOutlineUser } from "@react-icons/all-files/ai/AiOutlineUser";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { isValidHost } from "../../../microui/validator/host";
import { isValidPort } from "../../../microui/validator/port";
import { Button } from "../../../microui/component/Button";

//             <Input
//                 type="text"
//                 size="medium"
//                 placeholder="SSH Host (192.168.0.1 or www.example.com)"
//                 defaultValue={data.host}
//                 prefixIcon={<GlobalOutlined />}
//                 onChange={(value) => {
//                     data.setHost(value);
//                 }}
//                 validator={() => data.isValidHost}
//             />
//             <div style={{ height: 20 }} />
//             <Input
//                 type="text"
//                 size="medium"
//                 placeholder="SSH Port (0 - 65535)"
//                 defaultValue={data.port}
//                 prefixIcon={<AimOutlined />}
//                 onChange={(value) => {
//                     data.setPort(value);
//                 }}
//                 validator={() => data.isValidPort}
//             />
//             <div style={{ height: 20 }} />
//             <Input
//                 type="text"
//                 size="medium"
//                 placeholder="SSH Username"
//                 defaultValue={data.user}
//                 prefixIcon={<UserOutlined />}
//                 onChange={(value) => {
//                     data.setUser(value);
//                 }}
//                 validator={(v) => v !== ""}
//             />
//             <div style={{ height: 20 }} />
//             <Input
//                 type="password"
//                 size="medium"
//                 placeholder="SSH Password"
//                 defaultValue={data.password}
//                 prefixIcon={<LockOutlined />}
//                 onChange={(value) => {
//                     data.setPassword(value);
//                 }}
//                 validator={(v) => v !== ""}
//             />

interface ServerAddState {
    loading: boolean;
    host: string;
    port: string;
    user: string;
    password: string;
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
        };
    }

    private setLoading(loading: boolean) {
        if (this.loading !== loading) {
            this.loading = loading;
            this.setState({ loading: loading });
        }
    }

    private goBack() {
        if (this.props.data && this.props.data.goBack) {
            this.props.data.goBack(false);
        }
    }

    render() {
        const theme: Theme = this.context;
        return (
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
                <Divider space={AppConfig.get().margin} />
                <Input
                    type="text"
                    outline="underline"
                    size="large"
                    defaultValue={this.state.host}
                    placeholder="SSH Host (192.168.0.1 or www.example.com)"
                    icon={<AiOutlineLock />}
                    onChange={(e) => {
                        this.setState({ host: e.target.value });
                    }}
                    validator={isValidHost}
                />
                <Divider space={AppConfig.get().margin} />
                <Input
                    type="text"
                    outline="underline"
                    size="large"
                    defaultValue={this.state.port}
                    placeholder="SSH Port (0 - 65535)"
                    icon={<AiOutlineLock />}
                    onChange={(e) => {
                        this.setState({ port: e.target.value });
                    }}
                    validator={isValidPort}
                />

                <Divider space={AppConfig.get().margin} />

                <FlexBox flexFlow="row" justifyContent="flex-end">
                    <Button
                        text="Cancel"
                        ghost={true}
                        style={{ marginRight: 16 }}
                        onClick={this.goBack.bind(this)}
                        onEnter={this.goBack.bind(this)}
                    />
                    <Button
                        text="Add"
                        ghost={true}
                        // style={{ marginLeft: AppConfig.get().margin }}
                        // onClick={() => props.onNext()}
                        // onEnter={() => props.onNext()}
                    />
                </FlexBox>
            </FlexBox>
        );
    }
}

// import {
//     AimOutlined,
//     GlobalOutlined,
//     UserOutlined,
//     LockOutlined,
// } from "@ant-design/icons";

// import { message } from "antd";
// import { observer } from "mobx-react-lite";
// import Card from "../../../ui/component/Card";
// import { makeAutoObservable, runInAction } from "mobx";
// import { AppUser } from "../../AppManager";
// import Input from "../../../ui/component/Input";
// import { PluginProps } from "..";
// import { isValidHost } from "../../../microui/validator/host";
// import { isValidPort } from "../../../microui/validator/port";

// class Data {
//     loading: boolean;
//     host: string;
//     port: string;
//     user: string;
//     password: string;
//     isValidHost: boolean;
//     isValidPort: boolean;

//     constructor() {
//         makeAutoObservable(this);
//         this.loading = false;
//         this.host = "";
//         this.port = "22";
//         this.user = "";
//         this.password = "";
//         this.isValidHost = false;
//         this.isValidPort = true;
//     }

//     setLoading(loading: boolean) {
//         runInAction(() => {
//             this.loading = loading;
//         });
//     }

//     setHost(host: string) {
//         runInAction(() => {
//             this.host = host;
//             this.isValidHost = isValidHost(this.host);
//         });
//     }

//     setPort(port: string) {
//         runInAction(() => {
//             this.port = port;
//             this.isValidPort = isValidPort(this.port);
//         });
//     }

//     setUser(user: string) {
//         runInAction(() => {
//             this.user = user;
//         });
//     }

//     setPassword(password: string) {
//         runInAction(() => {
//             this.password = password;
//         });
//     }

//     reset() {
//         runInAction(() => {
//             this.loading = false;
//             this.host = "";
//             this.port = "22";
//             this.user = "";
//             this.password = "";
//             this.isValidHost = false;
//             this.isValidPort = true;
//         });
//     }
// }

// const data = new Data();

// const ServerAdd = observer((props: PluginProps) => {
//     return (
//         <Card
//             title="Add SSH Server"
//             width={460}
//             prevName={!!props.data && !!props.data.goBack ? "Cancel" : ""}
//             onPrev={() => {
//                 if (props.data && props.data.goBack) {
//                     props.data.goBack(false);
//                 }
//             }}
//             nextName="Add"
//             canNext={
//                 data.isValidPort &&
//                 data.isValidHost &&
//                 !!data.user &&
//                 !!data.password
//             }
//             onNext={async () => {
//                 try {
//                     await AppUser.send(
//                         8000,
//                         "#.server:Create",
//                         AppUser.getSessionID(),
//                         data.host,
//                         data.port,
//                         data.user,
//                         data.password,
//                         "",
//                         "",
//                         false
//                     );
//                     data.reset();
//                     props.data.goBack(true);
//                 } catch (e) {
//                     message.error((e as any).getMessage());
//                 }
//             }}
//         >
//             <div style={{ height: 20 }} />
//             <Input
//                 type="text"
//                 size="medium"
//                 placeholder="SSH Host (192.168.0.1 or www.example.com)"
//                 defaultValue={data.host}
//                 prefixIcon={<GlobalOutlined />}
//                 onChange={(value) => {
//                     data.setHost(value);
//                 }}
//                 validator={() => data.isValidHost}
//             />
//             <div style={{ height: 20 }} />
//             <Input
//                 type="text"
//                 size="medium"
//                 placeholder="SSH Port (0 - 65535)"
//                 defaultValue={data.port}
//                 prefixIcon={<AimOutlined />}
//                 onChange={(value) => {
//                     data.setPort(value);
//                 }}
//                 validator={() => data.isValidPort}
//             />
//             <div style={{ height: 20 }} />
//             <Input
//                 type="text"
//                 size="medium"
//                 placeholder="SSH Username"
//                 defaultValue={data.user}
//                 prefixIcon={<UserOutlined />}
//                 onChange={(value) => {
//                     data.setUser(value);
//                 }}
//                 validator={(v) => v !== ""}
//             />
//             <div style={{ height: 20 }} />
//             <Input
//                 type="password"
//                 size="medium"
//                 placeholder="SSH Password"
//                 defaultValue={data.password}
//                 prefixIcon={<LockOutlined />}
//                 onChange={(value) => {
//                     data.setPassword(value);
//                 }}
//                 validator={(v) => v !== ""}
//             />
//             <div style={{ height: 20 }} />
//         </Card>
//     );
// });

// export default ServerAdd;
