import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card, Table, Spin, Space,
} from 'antd';

export default function GeneBasicInfo(props) {
  const { gene, org } = props;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [cols, setCol] = useState([]);

  const onCell = () => ({
    style: {
      color: 'black',
    },
  });

  useEffect(() => {
    fetch(`/api/tables/gene-info/${org}-${gene}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(() => {
            const res = result;
            const href = `https://www.ncbi.nlm.nih.gov/nuccore/?term=(${res[0].value})+AND+"${org}"`;
            res[0].value = <a href={href} target="_blank" rel="noreferrer">{res[0].value}</a>;
            return res;
          });
          setCol([{ dataIndex: 'name', onCell }, { dataIndex: 'value', onCell }]);
        },
        (e) => {
          setIsLoaded(true);
          setError(e);
        },
      );
  }, [org, gene]);

  let geneInfoTable;

  if (error) {
    geneInfoTable = (
      <div>
        Error:
        {error.message}
      </div>
    );
  } else if (!isLoaded) {
    geneInfoTable = (
      <Space size="middle">
        <Spin size="large" />
      </Space>
    );
  } else {
    geneInfoTable = (
      <Table
        columns={cols}
        dataSource={data}
        showHeader={false}
        scroll={{ x: '100%' }}
        pagination={false}
      />
    );
  }

  return (
    <Card title="Gene Basic Information" bordered={false} style={{ width: 'auto' }}>
      {geneInfoTable}
    </Card>
  );
}

GeneBasicInfo.propTypes = {
  gene: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
};
