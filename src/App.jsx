import React from 'react';
import { Layout } from 'antd';
import Sider from 'antd/lib/layout/Sider';

import Navigation from './navigation';
import views from './views';

const { Header, Content } = Layout;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleNavClick = this.handleNavClick.bind(this); // upgrading to higher js / react version will remove need for binders
        this.state = {
            activeView: 'creation',
        };
    }

    handleNavClick({ key }) {
        this.setState({ activeView: key });
    }

    render() {
        const { activeView } = this.state;
        const [viewName, viewParams] = activeView.split('-');

        const ActiveView = views[viewName] || React.div;

        return (
            <Layout>
                <Header className="Header">
                    <img style={{ marginTop: '10px', height: '40px', width: 'auto', float: 'left', marginRight: '18px' }}
                         src="./images/planet.png"
                         alt="Bitcoin Logo" />

                    <h3>PureArt</h3>
                </Header>
                <Layout>
                    <Sider>
                        <Navigation
                            activeView={activeView}
                            handleClick={this.handleNavClick}
                        />
                    </Sider>
                    <Content>
                        <ActiveView type={viewParams} />
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

export default App;