import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InfinityTable as Table } from 'antd-table-infinity';
import Highlighter from 'react-highlight-words';
import {
  Spin, Input, Space, Button,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Details from '../../pages/details';
import BoxPlot from '../BoxPlot';
import './index.styl';

export default function LazyTable(props) {
  const { table, selectedGene, searched } = props;
  const [data, setData] = useState([]);
  const [cols, setCol] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [visible, setVisible] = useState(false);
  const [gene, setGene] = useState(null);
  const [group, setGroup] = useState(null);
  const [offset, setOffset] = useState(0);

  const setAll = ({ newGene, newGroup, newVisible }) => {
    setGene(newGene);
    setGroup(newGroup);
    setVisible(newVisible);
  };

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

  // const calBounds = (dataSource) => {
  //   // To get numeric values across JSONs
  //   const ds = JSON.parse(JSON.stringify(dataSource)); // Must use deep copy here
  //   const valuesArr = ds.map((d) => {
  //     delete d.Gene;
  //     delete d.key;
  //     // https://stackoverflow.com/a/41221771
  //     // https://stackoverflow.com/a/46677794
  //     return Object.values(d).filter((i) => !Number.isNaN(Number(i)));
  //   }).flat(Infinity);

  //   // Split array to pos & neg separately
  //   const posArr = valuesArr.filter((v) => v > 0);
  //   posArr.sort();
  //   const negArr = valuesArr.filter((v) => v < 0);
  //   negArr.sort();

  //   // Get upper & lower bound for scaling later
  //   // https://stackoverflow.com/a/31572826
  //   const upperBound = posArr[Math.floor(posArr.length * 0.5) - 1];
  //   // console.log(upperBound)
  //   const lowerBound = negArr[Math.floor(negArr.length * 0.5) - 1];
  //   return { upper: upperBound, lower: lowerBound }
  // }

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

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

  const v2bgColor = (v) => {
    const vNum = Number(v);
    let bgColor;
    let colorWeight;
    const upperBound = 1;
    const lowerBound = -1;
    if (Number.isNaN(vNum)) {
      bgColor = null;
    } else if (vNum > 0) {
      colorWeight = vNum > upperBound
        ? 1
        : (vNum / upperBound);
      // 别问，迷信可以治愈一切
      bgColor = `hsl(0, ${colorWeight * 0.88 * 100}%, ${(1 - colorWeight * 0.518) * 100}%)`;
    } else {
      colorWeight = vNum < lowerBound
        ? 1
        : (vNum / lowerBound);
      bgColor = `hsl(221, ${colorWeight * 0.88 * 100}%, ${(1 - colorWeight * 0.518) * 100}%)`;
    }
    return (bgColor);
  };

  const colHeader = (col) => {
    const splittedGroup = col.filter((c) => c.dataIndex.includes(':')).map((c) => c.dataIndex.split(':'));
    const orgs = col.filter((c) => c.dataIndex.includes(':')).map((c) => c.dataIndex.split(':')[0]).filter(onlyUnique);
    const orgsJson = orgs.map((org) => {
      const records = splittedGroup.filter((sg) => sg[0] === org);
      // https://stackoverflow.com/a/5669730
      const locationCount = records.map((r) => r[1]).reduce((acc, curr) => {
        if (typeof acc[curr] === 'undefined') {
          acc[curr] = 1;
        } else {
          acc[curr] += 1;
        }
        return acc;
      }, {});

      const outlier = { title: org, children: [] };

      Object.entries(locationCount).forEach(([location, count]) => {
        records.filter((r) => r[1] === location).forEach((r, i) => {
          if (i === 0) {
            outlier.children.push({
              title: location,
              dataIndex: r.join(':'),
              colSpan: count,
              width: 75,
              sorter: (a, b) => a[r.join(':')] - b[r.join(':')],
              sortDirections: ['descend', 'ascend'],
              onCell: (record) => ({
                style: {
                  background: v2bgColor(record[r.join(':')]),
                  cursor: 'pointer',
                  color: !Number.isNaN(record[r.join(':')]) && Math.abs(Number(record[r.join(':')])) > 0.5 ? 'white' : 'black',
                },
                onClick: (() => setAll({
                  newGene: record.Gene,
                  newGroup: r.join(':'),
                  newVisible: true,
                })),
              }),
            });
          } else {
            outlier.children.push({
              title: location,
              dataIndex: r.join(':'),
              colSpan: 0,
              width: 75,
              sorter: (a, b) => a[r.join(':')] - b[r.join(':')],
              sortDirections: ['descend', 'ascend'],
              onCell: (record) => ({
                style: {
                  background: v2bgColor(record[r.join(':')]),
                  cursor: 'pointer',
                  color: !Number.isNaN(record[r.join(':')]) && Math.abs(Number(record[r.join(':')])) > 0.5 ? 'white' : 'black',
                },
                onClick: (() => setAll({
                  newGene: record.Gene,
                  newGroup: r.join(':'),
                  newVisible: true,
                })),
              }),
            });
          }
        });
      });
      return (outlier);
    });

    let filteredCols;

    if (searched) {
      filteredCols = col.filter((c) => c.dataIndex === 'Gene');
    } else {
      filteredCols = col.filter((c) => !c.dataIndex.includes(':'));
    }

    const fixedCols = filteredCols.map((c) => {
      let colConfig = {
        dataIndex: c.dataIndex,
        title: table === 'cpg' ? 'ID' : c.dataIndex,
        fixed: 'left',
        width: 100,
        onCell: () => ({
          style: {
            color: 'black',
          },
        }),
      };
      if (c.dataIndex === 'Gene') {
        colConfig = Object.assign(colConfig, getColumnSearchProps(c.dataIndex));
      }
      return colConfig;
    });
    return (fixedCols.concat(orgsJson));
  };

  const handleFetch = () => {
    setLoading(true);
    fetch(selectedGene ? `/api/tables/${table}?gene=${selectedGene}` : `/api/tables/${table}?offset=15`)
      .then((res) => res.json())
      .then(
        (result) => {
          setLoading(false);
          setData(Array.isArray(result.data) ? data.concat(result.data) : [result.data]);
          setCol(colHeader(result.columns));
          setOffset(offset + 15);
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

  let lazyTable;

  if ((offset === 0) && loading) {
    lazyTable = <Spin size="large" tip="Loading..." />;
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

  let tableDetails;

  if (gene === null) {
    tableDetails = lazyTable;
  } else if (searched) {
    tableDetails = (
      <>
        {lazyTable}
        <BoxPlot
          gene={gene}
          group={group}
        />
      </>
    );
  } else {
    tableDetails = (
      <>
        {lazyTable}
        <Details
          gene={gene}
          group={group}
          visible={visible}
        />
      </>
    );
  }

  return (
    <div>{tableDetails}</div>
  );
}

LazyTable.propTypes = {
  table: PropTypes.string.isRequired,
  selectedGene: PropTypes.string.isRequired,
  searched: PropTypes.bool.isRequired,
};
