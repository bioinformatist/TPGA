import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InfinityTable as Table } from 'antd-table-infinity';
import {
  Spin, Input, Space, Button, Empty,
} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

export default function SimpleLazyTable(props) {
  const { table, gene } = props;
  const [data, setData] = useState([]);
  const [cols, setCol] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [exists, setExists] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  let lazyTable;

  let searchInput = null;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText({ searchText: '' });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      /* eslint-disable react/prop-types */
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => (record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : ''),
    onFilterDropdownVisibleChange: (dropDownVisible) => {
      if (dropDownVisible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) => (searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    )),
  });

  const strToLink = (str, type) => {
    const col = str;
    // https://stackoverflow.com/a/10003709
    if (type === 'Source') {
      const href = `https://pubmed.ncbi.nlm.nih.gov/${col.Source.replace(/^\D+/g, '')}/`;
      col.Source = <a href={href} target="_blank" rel="noreferrer">{str.Source}</a>;
    } else if (type === 'Dataset') {
      const href = `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${col.Dataset}`;
      col.Dataset = <a href={href} target="_blank" rel="noreferrer">{str.Dataset}</a>;
    }
    return col;
  };

  const handleFetch = () => {
    setLoading(true);
    fetch(gene ? `/api/tables/${table}?gene=${gene}` : `/api/tables/${table}?offset=15`)
      .then((res) => res.json())
      .then(
        (result) => {
          // Check if gene record exists in table
          if (typeof result.data !== 'undefined') {
            setLoading(false);
            setData(() => {
              let finalData;
              if (Array.isArray(result.data)) {
                if (Object.prototype.hasOwnProperty.call(result.data[0], 'Source')) {
                  finalData = data.concat(result.data.map((c) => strToLink(c, 'Source')));
                } else if (Object.prototype.hasOwnProperty.call(result.data[0], 'Dataset')) {
                  finalData = data.concat(result.data.map((c) => strToLink(c, 'Dataset')));
                } else {
                  finalData = data.concat(result.data);
                }
              } else if (Object.prototype.hasOwnProperty.call(result.data, 'Source')) {
                finalData = [strToLink(result.data, 'Source')];
              } else if (Object.prototype.hasOwnProperty.call(result.data, 'Dataset')) {
                finalData = [strToLink(result.data, 'Dataset')];
              } else {
                finalData = [result.data];
              }
              return finalData;
            });
            setCol(result.columns.map((c) => {
              let col = c;
              col.title = col.dataIndex;
              col.onCell = () => ({
                style: {
                  color: 'white',
                },
              });
              if (c.dataIndex === 'Gene' || c.dataIndex === 'Disease') {
                col = Object.assign(col, getColumnSearchProps(c.dataIndex));
              }
              if (c.dataIndex === 'Chromosome') {
                // https://stackoverflow.com/a/33352604
                const chrs = Array.from({ length: 22 }, (_, i) => `chr${i + 1}`);
                chrs.push('chrX', 'chrY');
                const chrFilters = [];
                chrs.map((chr) => chrFilters.push({ text: chr, value: chr }));
                col.filters = chrFilters;
                col.onFilter = (value, record) => record.Chromosome === value;
              }
              if (c.dataIndex === 'Strand') {
                col.filters = [{ text: '-', value: '-' }, { text: '+', value: '+' }];
                col.onFilter = (value, record) => record.Strand === value;
              }
              if (c.dataIndex === 'Direction') {
                col.filters = [{ text: 'up', value: 'up' }, { text: 'down', value: 'down' }];
                col.onFilter = (value, record) => record.Direction === value;
              }
              return col;
            }));
            setOffset(offset + 15);
          } else {
            setExists(false);
          }
        },
      );
  };

  const loadMoreContent = () => (
    <div
      style={{
        textAlign: 'center',
        paddingTop: 40,
        paddingBottom: 40,
        border: '1px solid #e8e8e8',
      }}
    >
      <Spin tip="Loading..." />
    </div>
  );

  if ((offset === 0) && loading && exists) {
    lazyTable = <Spin size="large" tip="Loading..." />;
  } else if (!exists) {
    lazyTable = <Empty />;
  } else {
    lazyTable = (
      <Table
        rowKey="key"
        loading={loading}
        onFetch={handleFetch}
        pageSize={15}
        loadingIndicator={loadMoreContent()}
        columns={cols}
    // https://github.com/ant-design/ant-design/issues/13825#issuecomment-658646755
        scroll={{ x: '100%', y: 450 }}
        dataSource={data}
        bordered
      />
    );
  }

  return (
    <>
      {lazyTable}
    </>
  );
}

SimpleLazyTable.propTypes = {
  table: PropTypes.string.isRequired,
  gene: PropTypes.string.isRequired,
};
