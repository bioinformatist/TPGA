import React from 'react';
import { Layout } from 'antd';
import { hot } from 'react-hot-loader';
import { HashRouter } from 'react-router-dom';
import './App.css';
import './App.styl';
import Navbar from './components/Navbar';
import Contents from './components/Content';

const { Header, Content, Footer } = Layout;

const App = () => (
  <>
    <h1>
      TPGA
    </h1>
    <Layout className="layout">
      <Header>
        <HashRouter>
          <Navbar />
        </HashRouter>
      </Header>
      <Content style={{ padding: '0 50px', overflow: 'auto' }}>
        <Contents />
      </Content>
      <Footer style={{ textAlign: 'center' }}>SYSUCC ©2020 Created by Yu Sun</Footer>
    </Layout>
  </>
);

export default hot(module)(App);
