import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import VirtualTable from '../VirtualTable';

function addColProps(col) {
  const newCol = col;
  newCol.sorter = (a, b) => a[newCol.dataIndex] - b[newCol.dataIndex];
  newCol.title = newCol.dataIndex;
  newCol.sortDirections = ['descend', 'ascend'];
  newCol.width = newCol.dataIndex === 'id' ? 250 : 70;
  return newCol;
}

export default function Table(props) {
  const { table } = props;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [cols, setCol] = useState([]);

  useEffect(() => {
    fetch(`/tables/${table}`)
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result.data);
          setCol(result.columns.map(addColProps));
        },
        (e) => {
          setIsLoaded(true);
          setError(e);
        },
      );
  }, [table]);

  let heatTable;

  if (error) {
    heatTable = (
      <div>
        Error:
        {error.message}
      </div>
    );
  } else if (!isLoaded) {
    heatTable = (<div>Loading...</div>);
  } else {
    heatTable = (
      <div className="explorer">
        <VirtualTable
          columns={cols}
          dataSource={data}
          scroll={{
            y: 300,
            x: '100vw',
          }}
        />
      </div>
    );
  }

  return (
    <div>
      { heatTable }
    </div>
  );
}

Table.propTypes = {
  table: PropTypes.string.isRequired,
};
