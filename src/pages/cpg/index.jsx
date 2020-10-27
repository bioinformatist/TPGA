import React from 'react';
import { Tabs } from 'antd';
import LazyTable from '../../components/LazyTable';

const { TabPane } = Tabs;

export default function Cpg() {
  return (
    <>
      <h2>CpG Methylation</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Acute" key="1">
          <LazyTable
            table="cpgacute"
          />
        </TabPane>
        <TabPane tab="Chroic" key="2">
          <LazyTable
            table="cpgchroic"
          />
        </TabPane>
      </Tabs>
    </>
  );
}
