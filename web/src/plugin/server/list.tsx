import React, { Key } from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { Button, ConfigProvider, message, Modal, Table } from "antd";
import { observer } from "mobx-react-lite";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { AppUser } from "../../AppManager";
import { toObject } from "rpccloud-client-js/build/types";
import ServerCreate from "./create";

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: (text:string, data: any) => (
            <Button style={{padding: 0}} type="link" onClick={(e) => {alert(JSON.stringify(data))}}>{text}</Button>
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
        render: (text:string, data: any) => (
            <>
                <Button style={{padding: 4}} type="link" onClick={(e) => {alert(JSON.stringify(data))}}>Connect</Button>
                <Button style={{padding: 4}} type="link" onClick={(e) => {alert(JSON.stringify(data))}}>Edit</Button>
                <Button style={{padding: 4}} type="link" onClick={(e) => {alert(JSON.stringify(data))}}>Delete</Button>
            </>

        ),
    },
];

class Data {
    createModal: boolean
    loading: boolean
    selectedRowKeys: Key[]
    servers: object[]
    isInit: boolean

    constructor() {
        makeAutoObservable(this)
        this.createModal = false
        this.selectedRowKeys = []
        this.loading = false
        this.servers = []
        this.isInit = false
    }

    setCreateModal(createModal: boolean) {
        runInAction(() => {
            this.createModal = createModal
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

interface ServerListProps {
    param: any,
}

const ServerList = observer((props: ServerListProps) => {
    data.init()

    const deleteText = data.selectedRowKeys.length > 0 ? `Delete ${data.selectedRowKeys.length} items` : ""
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
                <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    disabled={ !data.loading && data.selectedRowKeys.length > 0 }
                    onClick={() => {data.setCreateModal(true)}}
                />
                <Button
                    type="primary"
                    shape="circle"
                    icon={<ReloadOutlined />}
                    style={{marginLeft: 10}}
                    disabled={ !data.loading  && data.selectedRowKeys.length > 0 }
                    onClick={() => {data.load()}}
                />
                <Button
                    type="primary"
                    shape="round"
                    icon={<DeleteOutlined />}
                    style={{marginLeft: 10}}
                    disabled={ !data.loading  && data.selectedRowKeys.length === 0 }
                    onClick={() => {}}
                >
                    {deleteText}
                </Button>
                <Modal title="Basic Modal" visible={data.createModal} className="vbot-modal">
                    <ServerCreate
                        param={{goBack: (ok: boolean) => {
                            data.setCreateModal(false)

                            if (ok) {
                                data.load()
                            }
                        }}}
                    />
                </Modal>
            </div>
            <ConfigProvider renderEmpty={() => emptyView}>
                <Table
                    rowSelection={{
                        selectedRowKeys: data.selectedRowKeys,
                        onChange:  selectedRowKeys => data.setSelectedRowKeys(selectedRowKeys),
                    }}
                    columns={columns}
                    dataSource={data.servers}
                    rowKey={o => (o as any).id}
                />
            </ConfigProvider>
        </div>
    )
})

export default ServerList
