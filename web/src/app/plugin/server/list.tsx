import React, { Key } from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { Button, ConfigProvider, message, Modal, Table, Tooltip } from "antd";
import { observer } from "mobx-react-lite";


import {
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

import { AppUser } from "../../../AppManager";
import { toObject } from "rpccloud-client-js/build/types";
import ServerCreate from "./create";
import ServerDelete from "./delete";

class Data {
    createModal: boolean
    deleteModal: boolean
    loading: boolean
    selectedRowKeys: Key[]
    servers: object[]
    isInit: boolean
    deleteItem?: object

    constructor() {
        makeAutoObservable(this)
        this.createModal = false
        this.deleteModal = false
        this.selectedRowKeys = []
        this.loading = false
        this.servers = []
        this.isInit = false
    }

    setDeleteModal(deleteModal: boolean) {
        runInAction(() => {
            this.deleteModal = deleteModal
        })
    }

    setCreateModal(createModal: boolean) {
        runInAction(() => {
            this.createModal = createModal
        })
    }

    setDeleteItem(deleteItem: object | undefined) {
        runInAction(() => {
            this.deleteItem = deleteItem
        })
    }

    setSelectedRowKeys(selectedRowKeys: Key[]) {
        runInAction(() => {
            this.selectedRowKeys = selectedRowKeys
        })
    }

    init() {
        if (!this.isInit) {
            this.isInit = true
            this.load()
        }
    }

    async load() {
        runInAction(() => {
            this.loading = true
        })

        try {
            let ret = await AppUser.send(
                8000, "#.server:List", AppUser.getSessionID(), true,
            )
            runInAction(() => {
                this.servers = toObject(ret)
            })
        } catch(e) {
            message.error((e as any).getMessage())
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }
}

const data = new Data()

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: (text:string, data: any) => (
            <Tooltip title="View detail">
                <Button
                    style={{padding: 0}}
                    type="link"
                    onClick={(e) => {alert(JSON.stringify(data))}}
                >
                    {text}
                </Button>
            </Tooltip>
        ),
        sorter: (a:any, b:any) => {
            if (a.name > b.name) {
                return 1
            } else if (a.name === b.name) {
                return 0
            } else {
                return -1
            }
        },
    },
    {
        title: 'Host',
        dataIndex: 'host',
        sorter: (a:any, b:any) => {
            if (a.host > b.host) {
                return 1
            } else if (a.host === b.host) {
                return 0
            } else {
                return -1
            }
        },
    },
    {
        title: 'User',
        dataIndex: 'user',
        sorter: (a:any, b:any) => {
            if (a.user > b.user) {
                return 1
            } else if (a.user === b.user) {
                return 0
            } else {
                return -1
            }
        },
    },
    {
        title: 'Port',
        dataIndex: 'port',
        sorter: (a:any, b:any) => {
            if (a.user > b.user) {
                return 1
            } else if (a.port === b.port) {
                return 0
            } else {
                return -1
            }
        },
    },
    {
        title: 'Comment',
        dataIndex: 'comment',
    },
    {
        title: 'Action',
        dataIndex: 'id',
        render: (id:string, item: object) => (
            <>
                <Tooltip title="View detail">
                    <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={(e) => {alert(JSON.stringify(data))}}
                    />
                </Tooltip>

                <Tooltip title="Remove SSH server">
                    <Button
                        style={{marginLeft: 8, color:"--VBot-FontColor"}}
                        type="primary"
                        shape="circle"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            data.setDeleteItem(item)
                            data.setDeleteModal(true)
                        }}
                    />
                </Tooltip>
            </>

        ),
    },
];

interface ServerListProps {
    param: any,
}

const ServerList = observer((props: ServerListProps) => {
    data.init()

    const emptyView = (
        <div>
            <div style={{margin: 10, fontSize:"var(--Vbot-FontSizeMiddle)"}}>No Data</div>
            <Button type="primary" shape="round" icon={<ReloadOutlined />}>
                Reload
            </Button>
        </div>
    )

    return (
        <div style={{padding: 26}}>
            <div style={{ marginBottom: 20 }}>
                <Tooltip title="Add SSH server">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<PlusOutlined />}
                        disabled={ !data.loading && data.selectedRowKeys.length > 0 }
                        onClick={() => {data.setCreateModal(true)}}
                    />
                </Tooltip>
                <Tooltip title="Reload">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<ReloadOutlined />}
                        style={{marginLeft: 10}}
                        disabled={ !data.loading  && data.selectedRowKeys.length > 0 }
                        onClick={() => {data.load()}}
                    />
                </Tooltip>
                <Modal visible={data.createModal} className="vbot-modal">
                    <ServerCreate
                        param={{goBack: (ok: boolean) => {
                            data.setCreateModal(false)

                            if (ok) {
                                data.load()
                            }
                        }}}
                    />
                </Modal>
                <Modal visible={data.deleteModal} className="vbot-modal">
                    <ServerDelete
                        param={{
                            goBack: (ok: boolean) => {
                                data.setDeleteModal(false)

                                if (ok) {
                                    data.load()
                                }
                            },
                            item: data.deleteItem
                        }}
                    />
                </Modal>
            </div>
            <ConfigProvider renderEmpty={() => emptyView}>
                <Table
                    columns={columns}
                    dataSource={data.servers}
                    rowKey={o => (o as any).id}
                />
            </ConfigProvider>
        </div>
    )
})

export default ServerList
