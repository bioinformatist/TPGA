import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Input, Card, Divider, Tabs, Select,
} from 'antd';
import GeneBasicInfo from '../../components/GeneBasicInfo';
import SimpleLazyTable from '../../components/SimpleLazyTable';
import LazyTable from '../../components/LazyTable';
import './index.styl';

const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

export default function SearchPage() {
  const [result, setResult] = useState(null);
  const [org, setOrg] = useState('Homo sapiens');
  // https://stackoverflow.com/a/60256650
  const location = useLocation();

  const SelectOrg = () => (
    <>
      <Select defaultValue="Homo sapiens" value={org} style={{ width: 'auto' }} onChange={(value) => setOrg(value)}>
        <Option value="Homo sapiens">Homo sapiens</Option>
        <Option value="Mus musculus">Mus musculus</Option>
        <Option value="Rattus norvegicus">Rattus norvegicus</Option>
        <Option value="Sus scrofa">Sus scrofa</Option>
      </Select>
    </>
  );

  const onSearch = (gene) => {
    setResult(
      <>
        <Divider />
        <GeneBasicInfo
          gene={gene}
          org={org}
        />
        <Divider />
        <Card title="Gene Differential Expression" bordered={false} style={{ width: 'auto' }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Acute" key="1">
              <LazyTable
                table="acute"
                selectedGene={gene}
                searched
              />
            </TabPane>
            <TabPane tab="Chroic" key="2">
              <LazyTable
                table="chroic"
                selectedGene={gene}
                searched
              />
            </TabPane>
            <TabPane tab="Disease" key="3">
              <LazyTable
                table="disease"
                selectedGene={gene}
                searched
              />
            </TabPane>
            <TabPane tab="Drug" key="4">
              <LazyTable
                table="drug"
                selectedGene={gene}
                searched
              />
            </TabPane>
          </Tabs>
        </Card>
        <Divider />
        <Card title="Gene GWAS Information" bordered={false} style={{ width: 'auto' }}>
          <SimpleLazyTable
            table="gwas"
            gene={gene}
          />
        </Card>
        <Divider />
        <Card title="Gene CpG Methylation Information" bordered={false} style={{ width: 'auto' }}>
          <SimpleLazyTable
            table="cpg"
            gene={gene}
          />
        </Card>
      </>,
    );
  };

  useEffect(() => {
    if (location.state) {
      onSearch(location.state.gene);
    }
  }, [location]);

  let search;

  if (location.state) {
    search = (
      <>
        <h1 className="search">Search</h1>
        <SelectOrg />
        <Search
          placeholder="Search Gene"
          enterButton="Search"
          size="large"
          value={location.state.gene}
          onSearch={onSearch}
          style={{ width: 'auto' }}
        />
        {result}
      </>
    );
  } else {
    search = (
      <>
        <h1 className="search">Search</h1>
        <SelectOrg />
        <Search
          placeholder="Search Gene"
          enterButton="Search"
          size="large"
          onSearch={onSearch}
          style={{ width: 'auto' }}
        />
        {result}
      </>
    );
  }

  return (
    <>
      {search}
    </>
  );
}
