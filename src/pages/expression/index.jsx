import React from 'react';
import { Tabs } from 'antd';
import LazyTable from '../../components/LazyTable';
import './index.styl';

const { TabPane } = Tabs;

export default function Expression() {
  return (
    <div>
      <h1 className="expression">Expression</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Acute" key="1">
          <LazyTable
            table="acute"
          />
        </TabPane>
        <TabPane tab="Chroic" key="2">
          <LazyTable
            table="chroic"
          />
        </TabPane>
        <TabPane tab="Disease" key="3">
          <LazyTable
            table="disease"
          />
        </TabPane>
        <TabPane tab="Drug" key="4">
          <LazyTable
            table="drug"
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
