import React from 'react';
import { Tabs, Icon, Layout } from 'antd';
import ProjectsMosaic from './ProjectMosaicList';

const { Content } = Layout;

class Wallet extends React.Component {


    render() {
        const { viewParams } = this.props;
        return (
            <Content>
                <div className="App">
                    <Tabs activeKey={viewParams} style={{ padding: '16px' }}>
                        <Tabs.TabPane tab={<span><Icon type="line-chart" />In Progress</span>} key="1">
                            <ProjectsMosaic type='active' />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><Icon type="wallet" />Pending</span>} key="2">
                            <ProjectsMosaic type='pending' />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><Icon type="credit-card" />Complete</span>} key="3">
                            <ProjectsMosaic type='complete' />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </Content>
        );
    }
}

export default Wallet;
