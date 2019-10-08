import React from 'react';
import { Tabs, Icon, Layout } from 'antd';
import WalletsContent from './WalletContent';
import StatsContent from './StatsContent';
import TransactionsContent from './PaymentsContent';

const { Content } = Layout;

class Wallet extends React.Component {


    render() {
        return (
            <Content>
                <div className="App">
                    <Tabs defaultActiveKey="2" style={{ padding: '16px' }}>
                        <Tabs.TabPane tab={<span><Icon type="line-chart" />Price Charts</span>} key="1">
                            <StatsContent />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><Icon type="wallet" />Wallets</span>} key="2">
                            <WalletsContent />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><Icon type="credit-card" />Payments</span>} key="3">
                            <TransactionsContent />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </Content>
        );
    }
}

export default Wallet;
