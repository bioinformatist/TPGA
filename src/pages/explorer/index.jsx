import React from 'react';
// import {
//   HashRouter, Route, Switch,
// } from 'react-router-dom';
import { Tabs } from 'antd';
import Table from '../../components/table';

const { TabPane } = Tabs;

export default function Explorer() {
  return (
    <div className="explorer">
      <h1>Explorer</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Acute" key="1">
          <Table table="acute" />
        </TabPane>
        <TabPane tab="Chroic" key="2">
          <Table table="chroic" />
        </TabPane>
        <TabPane tab="Disease" key="3">
          <Table table="disease" />
        </TabPane>
        <TabPane tab="Drug" key="4">
          <Table table="drug" />
        </TabPane>
      </Tabs>
    </div>
  );
}
