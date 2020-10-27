import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Input, Card, Divider, Select, Collapse, Space, Spin, Table,
} from 'antd';
import { CaretRightOutlined, FundViewOutlined } from '@ant-design/icons';
import GeneBasicInfo from '../../components/GeneBasicInfo';
import SimpleLazyTable from '../../components/SimpleLazyTable';
import BoxPlot from '../../components/BoxPlot';
import './index.styl';

const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const superJoin = (arr) => {
  let joined;
  if (arr.length === 1) {
    // https://cn.eslint.org/docs/rules/prefer-destructuring
    [joined] = arr;
  } else {
    joined = `${arr.slice(0, -1).join(', ')} and ${arr.slice(-1)}`;
  }
  return joined;
};

const SearchedExpression = (props) => {
  const { org, gene } = props;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/tables/searched-expression/${org}-${gene}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setIsLoaded(true);
      },
      (e) => {
        setIsLoaded(true);
        setError(e);
      });
  }, [org, gene]);

  let res;

  if (error) {
    res = (
      <div>
        Error:
        {error.message}
      </div>
    );
  } else if (!isLoaded) {
    res = (
      <Space size="middle">
        <Spin size="large" />
      </Space>
    );
  } else {
    res = (
      <Collapse
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        defaultActiveKey={['1']}
      >
        {/* https://stackoverflow.com/a/15069646 */}
        <Panel header={`Totally ${data.all_type.length} pain types is found: ${superJoin(data.all_type)}`} key={1}>
          <Collapse
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            defaultActiveKey="1"
          >
            {data.all_type.map((type, index) => (
              <Collapse
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                defaultActiveKey={[...Array(data.all_type.length).keys()]}
              >
                <Panel header={`For ${type}: Totally ${data[type].all_tissue.length} tissues is found: ${superJoin(data[type].all_tissue)}` } key={index}>
                  {data[type].all_tissue.map((tissue) => (
                    <>
                      <h4>{tissue}</h4>
                      <Table
                        columns={data[type][tissue].col}
                        dataSource={data[type][tissue].data}
                        pagination={false}
                        expandable={{
                          expandedRowRender: (record) => <BoxPlot gene={gene} group={record.ID} />,
                          expandIconColumnIndex: 3,
                          /* eslint-disable react/prop-types */
                          expandIcon: ({ onExpand, record }) => (
                            <FundViewOutlined onClick={(e) => onExpand(record, e)} />
                          ),
                        }}
                      />
                    </>
                  ))}
                </Panel>
              </Collapse>
            ))}
          </Collapse>
        </Panel>
      </Collapse>
    );
  }

  return res;
};

export default function SearchPage() {
  const [result, setResult] = useState(null);
  const [org, setOrg] = useState('Homo sapiens');
  // https://stackoverflow.com/a/60256650
  const location = useLocation();

  const SelectOrg = () => (
    <div>
      <span className="set-species">Choose a species: </span>
      <Select defaultValue="Homo sapiens" value={org} style={{ width: 'auto' }} onChange={(value) => setOrg(value)}>
        <Option value="Homo sapiens">Homo sapiens</Option>
        <Option value="Mus musculus">Mus musculus</Option>
        <Option value="Rattus norvegicus">Rattus norvegicus</Option>
        <Option value="Sus scrofa">Sus scrofa</Option>
      </Select>
    </div>
  );

  const onSearch = (gene) => {
    setResult(
      <>
        <Divider />
        <GeneBasicInfo
          org={org}
          gene={gene}
        />
        <Divider />
        <Card title={`${gene} Differential Expression in ${org}`} bordered={false} style={{ width: 'auto' }}>
          <SearchedExpression
            gene={gene}
            org={org}
          />
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  let search;

  if (location.state) {
    search = (
      <>
        <h2 className="search">Search</h2>
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
        <h2 className="search">Search</h2>
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
