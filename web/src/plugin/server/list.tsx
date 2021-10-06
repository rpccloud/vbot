import React, { Key } from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { Button, Table } from "antd";
import { observer } from "mobx-react-lite";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      sorter: (a:any, b:any) => a.age - b.age,
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
];

class Data {
    selectedRowKeys: Key[]
    loading: boolean
    servers: object[]

    constructor() {
        makeAutoObservable(this)
        this.selectedRowKeys = []
        this.loading = false
        this.servers = []
        for (let i = 0; i < 1546; i++) {
            this.servers.push({
              key: i,
              name: `Edward King ${i}`,
              age: i,
              address: `London, Park Lane no. ${i}`,
            });
        }
    }

    setSelectedRowKeys(selectedRowKeys: Key[]) {
        runInAction(() => {
            this.selectedRowKeys = selectedRowKeys
        })
    }
}

const data = new Data()


interface ServerListProps {
    param: string,
}

const ServerList = observer((props: ServerListProps) => {
    const deleteText = data.selectedRowKeys.length > 0 ? `Delete ${data.selectedRowKeys.length} items` : ""
    return (
        <div style={{padding: 24}}>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" shape="circle" icon={<PlusOutlined />} />
                <Button type="primary" shape="circle" icon={<ReloadOutlined />} style={{marginLeft: 10}} />
                <Button type="primary" shape="round" icon={<DeleteOutlined />} style={{marginLeft: 10}}>
                    {deleteText}
                </Button>
            </div>
            <Table
                rowSelection={{
                    selectedRowKeys: data.selectedRowKeys,
                    onChange:  selectedRowKeys => data.setSelectedRowKeys(selectedRowKeys),
                }}
                columns={columns}
                dataSource={data.servers}
            />
        </div>
    )
})

export default ServerList
