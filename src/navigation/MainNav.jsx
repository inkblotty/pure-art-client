import React from 'react';
import { Menu, Icon } from 'antd';

const { SubMenu } = Menu;

class MainMenu extends React.Component {

  render() {
    const { activeView, handleClick } = this.props;

    return (
      <Menu
        onClick={handleClick}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        selectedKeys={[activeView]}
        theme='dark'
        mode="inline"
      >
        <SubMenu
          title={
            <span>
              <Icon type="appstore"/>
              <span>Projects</span>
            </span>
          }
        >
            <Menu.Item key="projectList-active">In Progress</Menu.Item>
            <Menu.Item key="projectList-pending">Pending</Menu.Item>
            <Menu.Item key="projectList-complete">Complete</Menu.Item>
        </SubMenu>
        <Menu.Item
          key="creation"
        >
            <span>
                <Icon type="dot-chart" />
                <span>Canvas</span>
            </span>
        </Menu.Item>
        <Menu.Item
          key="wallet"
        >
            <span>
                <Icon type="wallet" />
                <span>Wallet</span>
            </span>
        </Menu.Item>
        <Menu.Item
          key="settings"
        >
            <span>
                <Icon type="setting" />
                <span>Settings</span>
            </span>
        </Menu.Item>
      </Menu>
    );
  }
}

export default MainMenu;
