import React, { useContext } from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { ConfigProvider, message, Modal, Table, Tooltip } from "antd";
import { observer } from "mobx-react-lite";

import {
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import { AppUser } from "../../AppManager";
import { toObject } from "rpccloud-client-js/build/types";
import { getChannel } from "../../../ui/event/event";
import Plugin, { PluginProps } from "..";
import Button, { ButtonContext } from "../../../ui/component/Button";
import { ThemeContext } from "../../../ui/theme/config";

class Data {
    createModal: boolean;
    deleteModal: boolean;
    loading: boolean;
    servers: object[];
    isInit: boolean;
    deleteItem?: object;

    constructor() {
        makeAutoObservable(this);
        this.createModal = false;
        this.deleteModal = false;
        this.loading = false;
        this.servers = [];
        this.isInit = false;
    }

    setDeleteModal(deleteModal: boolean) {
        runInAction(() => {
            this.deleteModal = deleteModal;
        });
    }

    setCreateModal(createModal: boolean) {
        runInAction(() => {
            this.createModal = createModal;
        });
    }

    setDeleteItem(deleteItem: object | undefined) {
        runInAction(() => {
            this.deleteItem = deleteItem;
        });
    }

    init() {
        if (!this.isInit) {
            this.isInit = true;
            this.load();
        }
    }

    async load() {
        runInAction(() => {
            this.loading = true;
        });

        try {
            let ret = await AppUser.send(
                8000,
                "#.server:List",
                AppUser.getSessionID(),
                true
            );
            runInAction(() => {
                this.servers = toObject(ret);
            });
        } catch (e) {
            message.error((e as any).getMessage());
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    view(id: string) {
        getChannel("vbot-browser")?.call("AddTab", {
            kind: "server.show",
            param: id,
        });
    }
}

const data = new Data();

const NameView = (props: { text: string; data: any }) => {
    return (
        <Tooltip title="View detail">
            <ButtonContext.Provider value={{}}>
                <Button
                    round={false}
                    border={false}
                    padding="6px 0px 6px 0px"
                    fontSize="14px"
                    value={props.text}
                    onClick={() => {
                        alert(JSON.stringify(props.data));
                    }}
                />
            </ButtonContext.Provider>
        </Tooltip>
    );
};

const ActionView = (props: { id: string; item: object }) => {
    return (
        <>
            <Tooltip title="View detail">
                <Button
                    round={true}
                    icon={<EyeOutlined />}
                    fontSize="14px"
                    padding="0px"
                    radius={12}
                    onClick={() => {
                        data.view(props.id);
                    }}
                />
            </Tooltip>

            <Tooltip title="Remove SSH server">
                <Button
                    style={{ marginLeft: 8, color: "--VBot-FontColor" }}
                    round={true}
                    fontSize="14px"
                    padding="0px"
                    radius={12}
                    icon={<DeleteOutlined />}
                    onClick={() => {
                        data.setDeleteItem(props.item);
                        data.setDeleteModal(true);
                    }}
                />
            </Tooltip>
        </>
    );
};

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        render: (text: string, data: any) => (
            <NameView text={text} data={data} />
        ),
        sorter: (a: any, b: any) => {
            if (a.name > b.name) {
                return 1;
            } else if (a.name === b.name) {
                return 0;
            } else {
                return -1;
            }
        },
    },
    {
        title: "Host",
        dataIndex: "host",
        sorter: (a: any, b: any) => {
            if (a.host > b.host) {
                return 1;
            } else if (a.host === b.host) {
                return 0;
            } else {
                return -1;
            }
        },
    },
    {
        title: "User",
        dataIndex: "user",
        sorter: (a: any, b: any) => {
            if (a.user > b.user) {
                return 1;
            } else if (a.user === b.user) {
                return 0;
            } else {
                return -1;
            }
        },
    },
    {
        title: "Port",
        dataIndex: "port",
        sorter: (a: any, b: any) => {
            if (a.user > b.user) {
                return 1;
            } else if (a.port === b.port) {
                return 0;
            } else {
                return -1;
            }
        },
    },
    {
        title: "Comment",
        dataIndex: "comment",
    },
    {
        title: "Action",
        dataIndex: "id",
        render: (id: string, item: object) => (
            <ActionView id={id} item={item} />
        ),
    },
];

const ServerList = observer((props: PluginProps) => {
    const theme = useContext(ThemeContext);
    data.init();

    const emptyView = (
        <div>
            <div style={{ margin: 10, fontSize: "var(--Vbot-FontSizeMiddle)" }}>
                No Data
            </div>
            <Button fontSize="14px" icon={<ReloadOutlined />} value="Reload" />
        </div>
    );

    return (
        <ButtonContext.Provider
            value={{
                hoverColor: {
                    font: theme.backgroundColor,
                    border: theme.primaryColor,
                    background: theme.primaryColor,
                },
            }}
        >
            <div style={{ padding: 26 }}>
                <div style={{ marginBottom: 20 }}>
                    <Tooltip title="Add SSH server">
                        <Button
                            round={true}
                            icon={<PlusOutlined />}
                            disabled={data.loading}
                            onClick={() => {
                                data.setCreateModal(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Reload">
                        <Button
                            round={true}
                            icon={<ReloadOutlined />}
                            style={{ marginLeft: 10 }}
                            disabled={data.loading}
                            onClick={() => {
                                data.load();
                            }}
                        />
                    </Tooltip>
                    <Modal visible={data.createModal} className="vbot-modal">
                        <Plugin
                            kind="server.create"
                            param={{
                                goBack: (ok: boolean) => {
                                    data.setCreateModal(false);

                                    if (ok) {
                                        data.load();
                                    }
                                },
                            }}
                        />
                    </Modal>
                    <Modal visible={data.deleteModal} className="vbot-modal">
                        <Plugin
                            kind="server.delete"
                            param={{
                                goBack: (ok: boolean) => {
                                    data.setDeleteModal(false);

                                    if (ok) {
                                        data.load();
                                    }
                                },
                                item: data.deleteItem,
                            }}
                        />
                    </Modal>
                </div>
                <ConfigProvider renderEmpty={() => emptyView}>
                    <Table
                        columns={columns}
                        dataSource={data.servers}
                        rowKey={(o) => (o as any).id}
                    />
                </ConfigProvider>
            </div>
        </ButtonContext.Provider>
    );
});

export default ServerList;
