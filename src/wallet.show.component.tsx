import React from 'react';
import { List } from 'antd';
import { Wallet2 } from './logic/Wallet'
import { Asset } from './logic/asset'

class WalletShow<A extends Asset> extends React.Component {

    constructor(props: Wallet2<A>) {
        super(props);
    }

    render() {
        return (
            <div>
                <h3> HOLY FUCK TSX </h3>

                <h4>Inputs</h4>
                {/*<List*/}
                {/*    size="small"*/}
                {/*    header={<div>Header</div>}*/}
                {/*    footer={<div>Footer</div>}*/}
                {/*    bordered*/}
                {/*    dataSource={this.state.inputs}*/}
                {/*    renderItem={item => (<List.Item>{item}</List.Item>)} />*/}

                {/*<h4>Outputs</h4>*/}
                {/*<List*/}
                {/*    size="small"*/}
                {/*    header={<div>Header</div>}*/}
                {/*    footer={<div>Footer</div>}*/}
                {/*    bordered*/}
                {/*    dataSource={this.state.outputs}*/}
                {/*    renderItem={item => (<List.Item>{item}</List.Item>)} />*/}

            </div>

        );
    }
}

export default WalletShow;
