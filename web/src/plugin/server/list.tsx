import React, { Key } from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { Button, ConfigProvider, message, Table } from "antd";
import { observer } from "mobx-react-lite";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { AppUser } from "../../AppManager";
import { toObject } from "rpccloud-client-js/build/types";
import ServerCreate from "./create";
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";

const stringSorter = (a:any, b:any) => {
    if (a.addr > b.addr) {
        return 1
    } else if (a.addr === b.addr) {
        return 0
    } else {
        return -1
    }
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: (text:string, data: any) => (
            <Button style={{padding: 0}} type="link" onClick={(e) => {alert(JSON.stringify(data))}}>{text}</Button>
        ),
        sorter: stringSorter,
    },
    {
        title: 'Address',
        dataIndex: 'addr',
        sorter: stringSorter,
    },
    {
        title: 'User',
        dataIndex: 'user',
        sorter: stringSorter,
    },
    {
        title: 'Port',
        dataIndex: 'port',
    },
    {
        title: 'Comment',
        dataIndex: 'comment',
    },
];

class Data {
    loading: boolean
    creating: boolean
    selectedRowKeys: Key[]
    servers: object[]
    isInit: boolean

    constructor() {
        makeAutoObservable(this)
        this.selectedRowKeys = []
        this.loading = false
        this.creating = false
        this.servers = []
        this.isInit = false
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

    setCreating(creating: boolean) {
        runInAction(() => {
            this.creating = creating
        })
    }

    async load() {
        runInAction(() => {
            this.loading = true
        })

        try {
            let ret = await AppUser.send(
                8000, "#.server:List", AppUser.getSessionID(), false,
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
    param: string,
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
    const tableView = (
        <div style={{padding: 28}}>
            <div style={{ marginBottom: 20 }}>
                <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    disabled={ !data.loading && data.selectedRowKeys.length > 0 }
                    onClick={() => {data.setCreating(true)}}
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
    const createView = (
        <div style={{padding: 28}}>
            <div style={{ marginBottom: 20, flexDirection: "row"}}>
                <Button
                    type="primary"
                    shape="circle"
                    icon={<LeftOutlined />}
                    onClick={() => {data.setCreating(false)}}
                />
            </div>
            <ServerCreate param={""} />
        </div>
    )

    return data.creating ? createView : tableView
})

export default ServerList
