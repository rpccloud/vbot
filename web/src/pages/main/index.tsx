import React from "react";
import { Layout, Menu } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import Header from "../common/Header";

const { Sider } = Layout;
const { SubMenu } = Menu;

class Main extends React.Component {
    state = {
      collapsed: false,
    };

    onCollapse = (collapsed: boolean) => {
      console.log(collapsed);
      this.setState({ collapsed });
    };

    render() {
      const { collapsed } = this.state;
      return (
        <Layout style={{width: "100%"}}>
            <Header/>

          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse} style={{
        overflow: 'auto',
        height: '100%',
        position: 'fixed',
        left: 0,
        top:64,
      }}>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<PieChartOutlined />}>
                Option 1
              </Menu.Item>
              <Menu.Item key="2" icon={<DesktopOutlined />}>
                Option 2
              </Menu.Item>
              <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="9" icon={<FileOutlined />}>
                Files
              </Menu.Item>
            </Menu>
          </Sider>

          <Layout className="site-layout" style={{height: '100%', width:"100%"}}>
            <div style={{width: "100%", height: "100%", background: "red"}}></div>
          </Layout>
        </Layout>
      );
    }
  }

export default Main

