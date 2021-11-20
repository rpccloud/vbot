import React from "react";
import { Plugin, PluginProps } from "..";
import { Button } from "../../../microui/component/Button";
import { FlexBox } from "../../../microui/component/FlexBox";
import { AppConfig, AppError, AppUser, ExtraColor } from "../../AppManager";
import { AiOutlinePlusCircle } from "@react-icons/all-files/ai/AiOutlinePlusCircle";
import { AiOutlineReload } from "@react-icons/all-files/ai/AiOutlineReload";
import { Theme, ThemeContext } from "../../../microui/context/theme";
import { toObject } from "rpccloud-client-js/build/types";
import { Popup } from "../../../microui/component/Popup";
import { Page } from "../../../microui/component/Page";

interface ServerListState {
    loading: boolean;
    servers: object[];
}

export class ServerList extends React.Component<PluginProps, ServerListState> {
    static contextType = ThemeContext;

    private loading: boolean = false;

    constructor(props: PluginProps) {
        super(props);
        this.state = {
            loading: false,
            servers: [],
        };
    }

    private setLoading(loading: boolean) {
        this.loading = loading;
        this.setState({ loading: loading });
    }

    private updateServers = () => {
        if (this.loading === false) {
            this.setLoading(true);
            AppUser.send(8000, "#.server:List", AppUser.getSessionID(), true)
                .then((v) => {
                    this.setState({ servers: toObject(v) });
                })
                .catch((e) => {
                    AppError.get().report((e as any).getMessage());
                })
                .finally(() => {
                    this.setLoading(false);
                });
        }
    };

    componentDidMount() {
        this.updateServers();
    }

    render() {
        const theme: Theme = this.context;
        return (
            <FlexBox style={{ flex: 1, flexFlow: "column" }}>
                <FlexBox
                    style={{
                        height: 50,
                        alignItems: "center",
                        background: ExtraColor.appBG,
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderBottomColor: theme.default?.divider,
                    }}
                >
                    <Popup
                        action={["click"]}
                        renderPopup={(_, closePopup) => {
                            return (
                                <Page
                                    style={{
                                        opacity: 0.75,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Plugin
                                        kind="server.add"
                                        data={{
                                            goBack: () => {
                                                closePopup();
                                            },
                                        }}
                                    />
                                </Page>
                            );
                        }}
                    >
                        <Button
                            ghost={true}
                            border={false}
                            disabled={this.state.loading}
                            icon={<AiOutlinePlusCircle />}
                            text="Add Server"
                            style={{
                                marginLeft: AppConfig.get().margin,
                                height: 30,
                            }}
                        />
                    </Popup>

                    <Button
                        ghost={true}
                        border={false}
                        disabled={this.state.loading}
                        icon={<AiOutlineReload />}
                        text="Reload"
                        style={{ height: 28 }}
                        onClick={this.updateServers}
                    />
                </FlexBox>

                <FlexBox style={{ flex: 1 }}>
                    {/* {JSON.stringify(this.state.servers)} */}
                </FlexBox>
            </FlexBox>
        );
    }
}

// import { makeAutoObservable, runInAction } from "mobx";
// import { ConfigProvider, message, Modal, Table, Tooltip } from "antd";
// import { observer } from "mobx-react-lite";

// import {
//     EyeOutlined,
//     PlusOutlined,
//     ReloadOutlined,
//     DeleteOutlined,
// } from "@ant-design/icons";

// import { AppUser } from "../../AppManager";
// import { toObject } from "rpccloud-client-js/build/types";
// import { getChannel } from "../../../ui/event/event";
// import { Plugin, PluginProps } from "..";
// import Button, { ButtonContext } from "../../../ui/component/Button";

// class Data {
//     createModal: boolean;
//     deleteModal: boolean;
//     loading: boolean;
//     servers: object[];
//     isInit: boolean;
//     deleteItem?: object;

//     constructor() {
//         makeAutoObservable(this);
//         this.createModal = false;
//         this.deleteModal = false;
//         this.loading = false;
//         this.servers = [];
//         this.isInit = false;
//     }

//     setDeleteModal(deleteModal: boolean) {
//         runInAction(() => {
//             this.deleteModal = deleteModal;
//         });
//     }

//     setCreateModal(createModal: boolean) {
//         runInAction(() => {
//             this.createModal = createModal;
//         });
//     }

//     setDeleteItem(deleteItem: object | undefined) {
//         runInAction(() => {
//             this.deleteItem = deleteItem;
//         });
//     }

//     init() {
//         if (!this.isInit) {
//             this.isInit = true;
//             this.load();
//         }
//     }

//     async load() {
//         runInAction(() => {
//             this.loading = true;
//         });

//         try {
//             let ret = await AppUser.send(
//                 8000,
//                 "#.server:List",
//                 AppUser.getSessionID(),
//                 true
//             );
//             runInAction(() => {
//                 this.servers = toObject(ret);
//             });
//         } catch (e) {
//             message.error((e as any).getMessage());
//         } finally {
//             runInAction(() => {
//                 this.loading = false;
//             });
//         }
//     }

//     view(id: string) {
//         getChannel("vbot-browser")?.call("AddTab", {
//             kind: "server.show",
//             param: id,
//         });
//     }
// }

// const data = new Data();

// const NameView = (props: { text: string; data: any }) => {
//     return (
//         <Tooltip title="View detail">
//             <ButtonContext.Provider value={{}}>
//                 <Button
//                     round={false}
//                     border={false}
//                     style={{
//                         padding: "6px 0px 6px 0px",
//                     }}
//                     size="small"
//                     value={props.text}
//                     onClick={() => {
//                         alert(JSON.stringify(props.data));
//                     }}
//                 />
//             </ButtonContext.Provider>
//         </Tooltip>
//     );
// };

// const ActionView = (props: { id: string; item: object }) => {
//     return (
//         <>
//             <Tooltip title="View detail">
//                 <Button
//                     round={true}
//                     icon={<EyeOutlined />}
//                     size="small"
//                     style={{
//                         padding: "0px",
//                     }}
//                     onClick={() => {
//                         data.view(props.id);
//                     }}
//                 />
//             </Tooltip>

//             <Tooltip title="Remove SSH server">
//                 <Button
//                     style={{
//                         marginLeft: 8,
//                         color: "--VBot-FontColor",
//                         padding: "0px",
//                     }}
//                     round={true}
//                     size="small"
//                     icon={<DeleteOutlined />}
//                     onClick={() => {
//                         data.setDeleteItem(props.item);
//                         data.setDeleteModal(true);
//                     }}
//                 />
//             </Tooltip>
//         </>
//     );
// };

// const columns = [
//     {
//         title: "Name",
//         dataIndex: "name",
//         render: (text: string, data: any) => (
//             <NameView text={text} data={data} />
//         ),
//         sorter: (a: any, b: any) => {
//             if (a.name > b.name) {
//                 return 1;
//             } else if (a.name === b.name) {
//                 return 0;
//             } else {
//                 return -1;
//             }
//         },
//     },
//     {
//         title: "Host",
//         dataIndex: "host",
//         sorter: (a: any, b: any) => {
//             if (a.host > b.host) {
//                 return 1;
//             } else if (a.host === b.host) {
//                 return 0;
//             } else {
//                 return -1;
//             }
//         },
//     },
//     {
//         title: "User",
//         dataIndex: "user",
//         sorter: (a: any, b: any) => {
//             if (a.user > b.user) {
//                 return 1;
//             } else if (a.user === b.user) {
//                 return 0;
//             } else {
//                 return -1;
//             }
//         },
//     },
//     {
//         title: "Port",
//         dataIndex: "port",
//         sorter: (a: any, b: any) => {
//             if (a.user > b.user) {
//                 return 1;
//             } else if (a.port === b.port) {
//                 return 0;
//             } else {
//                 return -1;
//             }
//         },
//     },
//     {
//         title: "Comment",
//         dataIndex: "comment",
//     },
//     {
//         title: "Action",
//         dataIndex: "id",
//         render: (id: string, item: object) => (
//             <ActionView id={id} item={item} />
//         ),
//     },
// ];

// const ServerList = observer((props: PluginProps) => {
//     data.init();

//     const emptyView = (
//         <div>
//             <div style={{ margin: 10, fontSize: "var(--Vbot-FontSizeMiddle)" }}>
//                 No Data
//             </div>
//             <Button size="small" icon={<ReloadOutlined />} value="Reload" />
//         </div>
//     );

//     return (
//         <ButtonContext.Provider
//             value={{
//                 hover: {},
//             }}
//         >
//             <div style={{ padding: 26 }}>
//                 <div style={{ marginBottom: 20 }}>
//                     <Tooltip title="Add SSH server">
//                         <Button
//                             round={true}
//                             icon={<PlusOutlined />}
//                             disabled={data.loading}
//                             onClick={() => {
//                                 data.setCreateModal(true);
//                             }}
//                         />
//                     </Tooltip>
//                     <Tooltip title="Reload">
//                         <Button
//                             round={true}
//                             icon={<ReloadOutlined />}
//                             style={{ marginLeft: 10 }}
//                             disabled={data.loading}
//                             onClick={() => {
//                                 data.load();
//                             }}
//                         />
//                     </Tooltip>
//                     <Modal visible={data.createModal} className="vbot-modal">
//                         <Plugin
//                             kind="server.create"
//                             data={{
//                                 goBack: (ok: boolean) => {
//                                     data.setCreateModal(false);

//                                     if (ok) {
//                                         data.load();
//                                     }
//                                 },
//                             }}
//                         />
//                     </Modal>
//                     <Modal visible={data.deleteModal} className="vbot-modal">
//                         <Plugin
//                             kind="server.delete"
//                             data={{
//                                 goBack: (ok: boolean) => {
//                                     data.setDeleteModal(false);

//                                     if (ok) {
//                                         data.load();
//                                     }
//                                 },
//                                 item: data.deleteItem,
//                             }}
//                         />
//                     </Modal>
//                 </div>
//                 <ConfigProvider renderEmpty={() => emptyView}>
//                     <Table
//                         columns={columns}
//                         dataSource={data.servers}
//                         rowKey={(o) => (o as any).id}
//                     />
//                 </ConfigProvider>
//             </div>
//         </ButtonContext.Provider>
//     );
// });

// export default ServerList;
